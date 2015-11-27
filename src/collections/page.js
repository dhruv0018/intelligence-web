class Page {

    constructor (number, size) {

        this.number = number;
        this.size = size;
    }

    get queryStart () {

        return (this.number - 1) * this.size;
    }
}

export default Page;
