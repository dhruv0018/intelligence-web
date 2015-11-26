// TODO: Write unit tests

class Page {

    constructor (number) {

        this.number = number;
    }

    get queryStart () {

        return (this.number - 1) * VIEWS.QUEUE.GAME.QUERY_SIZE;
    }
}

export default Page;
