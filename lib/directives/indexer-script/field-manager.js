/**
 * FIXME:
 * Extend FieldsElementsManagerService class from SortedList as FieldsList
 * and utilize LinkedList previous, next methods
 */
/**
 * FieldsElementsManagerService
 * @module IndexerScript
 * @name FieldsElementsManagerService
 * @type {Service}
 */
class FieldsElementsManagerService {

    /**
     * @constructor
     * @param {Object} Event.fields
     */
    constructor (fields) {

        // Store fields indicies in ascending order
        this.fieldsIndices = Object.keys(fields)
            .map(key => Number.parseInt(key))
            .sort((a, b) => a - b);
        // Default current field to first field
        this.currentFieldIndex = this.fieldsIndices[0];

        this.fields = fields;
    }

    get currentFieldIndex () {

        return this.currentIndex;
    }

    set currentFieldIndex(fieldIndex) {

        this.currentIndex = fieldIndex;

        let i = this.fieldsIndices.indexOf(this.currentIndex);
        const firstIndex = 0;
        const lastIndex = this.fieldsIndices.length - 1;

        this.previousFieldIndex =
            (i > firstIndex) ?
            this.fieldsIndices[i-1] :
            null;

        this.nextFieldIndex =
            (i < lastIndex) ?
            this.fieldsIndices[i+1]:
            null;

    }

    /**
     * Returns an HTML element ID'd by the given field index
     * @method FieldsElementsManagerService.getElement
     * @param {Integer} fieldIndex
     * @returns {HTMLElement} fieldElement
     */
    getElement (fieldIndex) {

        const id = 'field-' + fieldIndex;

        return document.getElementById(id);
    }

    /**
     * Returns first field in fields
     * @method FieldsElementsManagerService.first
     * @return {HTMLElement} firstField OR
     * {undefined} if no fields
     */
    get first () {

        return this.fieldsIndices.length ?  this.getElement(this.fieldsIndices[0]) : undefined;
    }

    /**
     * Returns last field in fields
     * @method FieldsElementsManagerService.last
     * @return {HTMLElement} lastField OR
     * {undefined} if no fields
     */
    get last () {

        return this.fieldsIndices.length ?  this.getElement(this.fieldsIndices[this.fieldsIndices.length - 1]) :
        undefined;
    }

    /**
     * Returns current/active field in fields
     * @method FieldsElementsManagerService.current
     * @return {HTMLElement} currentField OR
     * {undefined} if no fields
     */
    get current () {

        return this.fieldsIndices.length ?
        this.getElement(this.currentFieldIndex) :
        undefined;
    }

    /**
     * Checks if the current/active field is the first field
     * @method FieldsElementsManagerService.currentIsFirst
     * @return {Boolean}
     */
    get currentIsFirst () {

        return this.current === this.first;
    }

    /**
     * Checks if the current/active field is the last field
     * @method FieldsElementsManagerService.currentIsLast
     * @return {Boolean}
     */
    get currentIsLast () {

        return this.current === this.last;
    }

    /**
     * Returns previous field of current field in fields
     * @method FieldsElementsManagerService.previous
     * @return {HTMLElement} previousField OR {undefined}
     */
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

    /**
     * Returns next field of current field in fields
     * @method FieldsElementsManagerService.next
     * @return {HTMLElement} nextField OR {undefined}
     */
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

    /**
     * Steps to the next field if not the last field,
     * else execute a fallback callback
     * @method FieldsElementsManagerService.backward
     */
    backward (fallback = () => {}) {

        if (this.currentIsFirst) {

            fallback();
        }
        else {

            this.previous().focus();
        }
    }

    /**
     * Steps to the next field if not the last field,
     * else execute a fallback callback
     * @method FieldsElementsManagerService.forward
     */
    forward (fallback = () => {}) {

        if (this.currentIsLast) {

            fallback();
        }
        else if (this.fields[this.currentFieldIndex].valid){

            this.next().focus();
        }
    }
}

/**
* FieldsElementsManagerService dependencies
*/
FieldsElementsManagerService.$inject = [];

export default FieldsElementsManagerService;
