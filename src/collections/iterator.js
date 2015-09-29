class Iterator {
    constructor(backingStore) {
        this.index = 0;
        this.backingStore = backingStore;
    }

    next() {
        this.index++;
        return this.current;
    }

    prev() {
        this.index--;
        return this.current;
    }

    get current() {
        let value = this.backingStore[this.index] ? this.backingStore[this.index] : null;
        return {
            value,
            done: !this.hasNext()
        };
    }
    set current(item) {
        this.index = this.backingStore.indexOf(item);
    }
    hasNext() {
        return this.index < this.backingStore.length;
    }

    hasPrev() {
        return this.index >= 0;
    }
}

export default Iterator;
