import KrossoverPlay from './play';

/* Fetch angular from the browser scope */
const angular = window.angular;

PlayDataDependencies.$inject = [
    'TagsetsFactory'
];

function PlayDataDependencies (
    tagsets
) {

    tagsets.load();

    return new KrossoverPlay(play, tagsets);
}

export default PlayDataDependencies;
