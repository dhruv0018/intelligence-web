import KrossoverTag from '../entities/tag';

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

    const factory = {

        description: 'tagsets',

        model: 'TagsetsResource',

        storage: 'TagsetsStorage',

        extend: function (tagset) {

            angular.extend(tagset, this);

            let tags = {};
            let endAndStartTags = [];

            tagset.tags.forEach(tag => {

                if (tag.isEnd && tag.children.length === 1) {

                    endAndStartTags.push(tag.children[0]);
                }

                tags[tag.id] = tag;
                indexedTags[tag.id] = new KrossoverTag(tag);
            });

            endAndStartTags.forEach(tagId => {

                tags[tagId].isStartOfEndAndStart = true;
                indexedTags[tagId].isStartOfEndAndStart = true;
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

                if (tag.isStartOfEndAndStart) {

                    delete tag.isStartOfEndAndStart;
                }

                tags.push(tag.toJSON());
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

            .map(key => new KrossoverTag(tags[key]))
            .filter(tag => this.isStartTag(tag.id));
        },

        getFloatTags: function () {

            let tags = this.tags;

            return Object.keys(tags)

            .map(key => new KrossoverTag(tags[key]))
            .filter(tag => this.isFloatTag(tag.id));
        },

        getNextTags: function (tagId) {

            let tags = this.tags;
            let tag = new KrossoverTag(tags[tagId]);

            if (tag.children && tag.children.length) {

                let nextTags = tag.children.map(childId => new KrossoverTag(tags[childId]));

                if (!tag.isGroup) {

                    nextTags.concat(this.getFloatTags);
                }

                return nextTags;
            } else {

                return this.getStartTags();
            }
        },

        isStartTag: function (tagId) {

            let tags = this.tags;
            let tag = new KrossoverTag(tags[tagId]);

            return tag.isStart && !tag.isStartOfEndAndStart;
        },

        isFloatTag: function (tagId) {

            let tags = this.tags;
            let tag = new KrossoverTag(tags[tagId]);

            return tag.isStart === false && tag.isEnd === false && tag.children && tag.children.length === 0;
        },

        isEndTag: function (tagId) {

            let tags = this.tags;
            let tag = new KrossoverTag(tags[tagId]);

            return tag.isEnd;
        }
    };

    angular.augment(factory, BaseFactory);

    return factory;
}
