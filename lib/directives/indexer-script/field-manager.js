/**
 * FieldsElementsManagerService
 * @module IndexerScript
 * @name FieldsElementsManagerService
 * @type {Service}
 */
class FieldsElementsManagerService {

    constructor (fields) {

        // Store fields indicies in ascending order
        this.fieldsIndices = Object.keys(fields).sort((a, b) => a - b);
        // Default current field to first field
        this.currentFieldIndex = this.fieldsIndices[0];
    }

    getElement (fieldIndex) {

        const id = 'field-' + fieldIndex;

        return document.getElementById(id);
    }

    get first () {

        return this.getElement(this.fieldsIndices[0]);
    }

    get last () {

        return this.getElement(this.fieldsIndices[this.fieldsIndices.length - 1]);
    }

    get current () {

        let element = this.getElement(this.currentFieldIndex);

        return element;
    }

    get currentIsFirst () {

        return this.current === this.first;
    }

    get currentIsLast () {

        return this.current === this.last;
    }

    previous () {

        let i = this.fieldsIndices.indexOf(this.currentFieldIndex);
        const firstIndex = 0;

        if (i <= firstIndex) {

            return undefined;
        }

        this.currentFieldIndex = this.fieldsIndices[--i];

        let element = this.getElement(this.currentFieldIndex);

        return element;
    }

    next () {

        let i = this.fieldsIndices.indexOf(this.currentFieldIndex);
        const lastIndex = this.fieldsIndices.length - 1;

        if (i >= lastIndex) {

            return undefined;
        }

        this.currentFieldIndex = this.fieldsIndices[++i];

        let element = this.getElement(this.currentFieldIndex);

        return element;
    }

    backward (fallback) {

        if (this.currentIsFirst) {

            fallback();
        }
        else {

            this.previous().click();
        }
    }

    forward (fallback) {

        if (this.currentIsLast) {

            fallback();
        }
        else {

            this.next().click();
        }
    }
}

/**
* FieldsElementsManagerService dependencies
*/
FieldsElementsManagerService.$inject = [];

export default FieldsElementsManagerService;
