/**
 * IndexerScript.Controller
 * @module IndexerScript
 * @name IndexerScript.Controller
 * @type {Controller}
 */
class IndexerScriptController {

    constructor ($scope) {

        // Set up $scope variables
        $scope.text = 'Hello World';

        // Bind controller methods to $scope
        $scope.type = this.type;
        $scope.isString = this.isString;
    }

    type (obj) {

        return typeof obj;
    }

    isString (obj) {

        return this.type(obj) === 'string';
    }
}

/**
* IndexerScript.Controller dependencies
*/
IndexerScriptController.$inject = [
    '$scope'
];

export default IndexerScriptController;
