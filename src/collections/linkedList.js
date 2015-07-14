class LinkedList {

    constructor (array) {

        if (arguments.lengh === 0 || !Array.isArray(array)) {

            throw new Error('LinkedList#constructor: Must supply an array to manage!');
        }

        this.data             = array;
        this.currentNodeIndex = 0;
    }

    next () {

        if (++this.currentNodeIndex < this.data.length) {

            return this.currentNode();
        } else {

            this.currentNodeIndex = this.data.length -1;
            return null;
        }
    }

    previous () {

        if (--this.currentNodeIndex >= 0) {

            return this.currentNode();
        } else {

            this.currentNodeIndex = 0;
            return null;
        }
    }

    get currentNode () {

        return this.data[this.currentNodeIndex];
    }

    set currentNode (value) {

        return;
    }

    get listData () {

        return this.data;
    }

    toJSON () {

        return this.data.slice(0);
    }
}

export default LinkedList;
