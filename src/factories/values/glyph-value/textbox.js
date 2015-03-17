
/* Textbox - extends Glyph */

module.exports = [
    'GlyphValue',
    function(Glyph) {

        function TextBox(type, options, containerElement) {

            Glyph.call(this, type, options, containerElement);
            this.editMode = true;
        }
        angular.inheritPrototype(TextBox, Glyph);

        TextBox.prototype.EDITABLE = false;
        TextBox.prototype.MOVEABLE = true;
        TextBox.prototype.TEXT_TOOL_HINT_TEXT = 'Enter text here';

        /* Getters and Setters */

        TextBox.prototype.getShapeContext = function getShapeContext() {

            // TODO: Return Text Element height/width
            return null;
        };

        TextBox.prototype.render = function renderTextBox() {

            var self = this;
            var verticesInPixels = self.getVerticesInPixels();

            if (verticesInPixels.length !== 2) throw new Error('TextBox render function requires 2 vertices and ' + verticesInPixels.length + ' given');

            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            var width = endPoint.x - startPoint.x;
            var height = endPoint.y - startPoint.y;
        };

        TextBox.prototype.destroy = function() {
            Glyph.prototype.destroy.call(this);
        };

        return TextBox;
    }
];
