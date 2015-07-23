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
        // Map of elements for each field
        this.fieldElements = {};

        // Populate this.fieldElements
        for (let key in fields) {

            let field = fields[key];
            let id = 'field-' + field.index;
            this.fieldElements[field.index] = document.getElementById(id);
        }

        // Default current field to first field
        this.currentFieldIndex = this.fieldsIndices[0];
    }

    get elements () {

        return this.fieldElements;
    }

    get first () {

        return this.elements[this.fieldsIndices[0]];
    }

    get last () {

        const lastIndex = this.fieldsIndices.length - 1;
        return this.elements[this.fieldsIndices[lastIndex]];
    }

    get current () {

        return this.elements[this.currentFieldIndex];
    }

    currentIsFirst () {

        return this.current === this.first;
    }

    currentIsLast () {

        return this.current === this.last;
    }

    previous() {

        let i = this.fieldsIndices.indexOf(this.currentFieldIndex);
        const firstIndex = 0;

        if (i <= firstIndex) {

            return undefined;
        }

        this.currentFieldIndex = this.indicies[--i];

        return this.elements.indicies[this.currentFieldIndex];
    }

    next() {

        let i = this.fieldsIndices.indexOf(this.currentFieldIndex);
        const lastIndex = this.fieldsIndices.length - 1;

        if (i >= lastIndex) {

            return undefined;
        }

        this.currentFieldIndex = this.indicies[++i];

        return this.elements.indicies[this.currentFieldIndex];
    }
}

/**
* FieldsElementsManagerService dependencies
*/
FieldsElementsManagerService.$inject = [];

export default FieldsElementsManagerService;
