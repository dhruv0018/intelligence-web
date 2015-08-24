import KrossoverPlay from './play';

KrossoverPlayFactory.$inject = [
    'TagsetsFactory'
];

function KrossoverPlayFactory (
    tagsets
) {

    this.create = play => new KrossoverPlay(play, tagsets);

    return this;
}

export default KrossoverPlayFactory;
