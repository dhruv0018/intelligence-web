class LinkedListItem {

    constructor (value) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked LinkedListItem.constructor without passing a value');
        }

        this.value    = value;
        this.next     = null;
        this.previous = null;
    }
}

export default LinkedListItem;
