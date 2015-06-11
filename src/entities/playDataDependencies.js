import KrossoverPlay from './play';

KrossoverPlayDataDependencies.$inject = [
    'TagsetsFactory'
];

function KrossoverPlayDataDependencies (
    tagsets
) {

    return function playDataFactory (play) {

        return new KrossoverPlay(play, tagsets);
    };
}

export default KrossoverPlayDataDependencies;
