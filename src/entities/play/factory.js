KrossoverPlayFactory.$inject = [
    '$KrossoverPlay'
];

function KrossoverPlayFactory (
    KrossoverPlay
) {

    function create (play) {

        return new KrossoverPlay(play);
    }

    return {create};
}

export default KrossoverPlayFactory;
