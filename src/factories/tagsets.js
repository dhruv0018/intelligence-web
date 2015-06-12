import KrossoverTag from '../entities/tag.js';

const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('TagsetsFactory', TagsetsFactory);

TagsetsFactory.$inject = [
    'BaseFactory',
    '$filter'
];

function TagsetsFactory (
    BaseFactory,
    $filter
) {

    let indexedTags = {};

    let factory = {

        description: 'tagsets',

        model: 'TagsetsResource',

        storage: 'TagsetsStorage',

        extend: function (tagset) {

            angular.extend(tagset, this);

            let tags = {};

            tagset.tags.forEach(tag => {

                if (tag.id === 42) console.log('tag', tag.id, tag);
                tag = new KrossoverTag(tag);

                tags[tag.id] = tag;
                indexedTags[tag.id] = tag;
            });

            tagset.tags = tags;

            return tagset;
        },

        unextend: function (tagset) {

            tagset = tagset || this;

            let copy = angular.copy(tagset);
            let tags = [];

            Object.keys(copy.tags).forEach(tagKey => {

                let tag = copy.tags[tagKey];
                tags.push(JSON.stringify(tag));
            });

            copy.tags = tags;

            return copy;
        },

        getTag: function (tagId) {

            let tag = indexedTags[tagId];

            if (!tag) throw new Error(`Tag ${tagId} not found`);

            return tag;
        },

        getTagMap: function () {

            return indexedTags;
        },

        getStartTags: function () {

            let tags = this.tags;

            return Object.keys(tags)

            .map(key => tags[key])
            .filter(tag => this.isStartTag(tag.id));
        },

        getFloatTags: function () {

            let tags = this.tags;

            return Object.keys(tags)

            .map(key => tags[key])
            .filter(tag => this.isFloatTag(tag.id));
        },

        getNextTags: function (tagId) {

            let tags = this.tags;
            let tag = tags[tagId];

            if (tag.children && tag.children.length) {

                return tag.children.map(childId => tags[childId])
                .concat(this.getFloatTags());
            } else {

                return this.getStartTags();
            }
        },

        isStartTag: function (tagId) {

            let tags = this.tags;
            let tag = tags[tagId];

            return tag.isStart;
        },

        isFloatTag: function (tagId) {

            let tags = this.tags;
            let tag = tags[tagId];

            return tag.isStart === false && tag.isEnd === false && tag.children && tag.children.length === 0;
        },

        isEndTag: function (tagId) {

            let tags = this.tags;
            let tag = tags[tagId];

            return tag.isEnd;
        }
    };

    angular.augment(factory, BaseFactory);

    return factory;
}
