/**
 * IndexerScript.Link
 * @module IndexerScript
 * @name IndexerScript.Link
 * @type {Function}
 */

function IndexerScriptLink ($scope, element, attributes) {

    // Variable alias
    let fields = $scope.event.fields;
    // Find the lowest index in fields
    let currentFieldIndex = Object.keys(fields)
        .sort((a, b) => a - b)
        [0];
    // Map of HTML Nodes for fields
    let FieldHTMLNodes = {};

    for (let key in fields) {

        let field = fields[key];
        let id = 'field-' + field.index;
        FieldHTMLNodes[field.index] = document.getElementById(id);
    }

    currentFieldHTMLNode = FieldHTMLNodes[currentFieldIndex];
    currentFieldHTMLNode.focus();
}

export default IndexerScriptLink;
