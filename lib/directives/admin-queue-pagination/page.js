class Page {

    constructor (number) {

        this.number = number;
    }

    get viewNumber () {

        return this.number + 1;
    }

    get queryStart () {

        return this.number * VIEWS.QUEUE.GAME.QUERY_SIZE;
    }
}

export default Page;
