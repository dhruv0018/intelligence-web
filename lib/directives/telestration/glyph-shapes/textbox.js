angular.module('GlyphShapes.TextBoxShape', []).factory('TextBoxFactory', [
    'TelestrationInterface', 'ShapeFactory', 'GlyphShapesConstants', 'TELESTRATION_TYPES',
    function(telestrationInterface, Shape, glyphShapesConstants, TELESTRATION_TYPES) {

        function TextBox() {

            Shape.call(this, TELESTRATION_TYPES.TEXT_TOOL);

        }
        angular.inheritPrototype(TextBox, Shape);

        TextBox.prototype.editable = false;
        TextBox.prototype.movable = false;
        TextBox.prototype.text = glyphShapesConstants.TEXTBOX_TEXT;

        TextBox.prototype.render = function renderTextBox() {

            var verticesInPixels = this.getVerticesInPixels();
            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            this.elem.empty();

            var offsetX = endPoint.x - startPoint.x;
            var offsetY = endPoint.y - startPoint.y;

            var textInputElement = angular.element('<textarea style="top:' + startPoint.y + 'px;left:' + startPoint.x + 'px;height:' + offsetY + 'px;width:' + offsetX + 'px;">' +
                this.text +
            '</textarea>');
            this.elem.append(textInputElement);

            textInputElement.one('click', function(mouseEvent) {
                //TODO: make 'Enter text here' variable/constant
                if (textInputElement.text() === 'Enter text here') {
                    textInputElement.text('');
                }
            });

            //prevent drawing on top of text input box
            textInputElement.on('mousedown', function(mouseEvent) {
                mouseEvent.stopPropagation();
            });

            textInputElement.one('blur', function(mouseEvent) {
                console.log(mouseEvent, textInputElement.val());
                //if (typeof this.onTextChanged === 'function') this.onTextChanged(textInputElement.val());

                //remove and clean up input element
                textInputElement.off('mousedown');
                textInputElement.remove();
            });
        };

        TextBox.prototype.destroy = function() {
            Shape.prototype.destroy.call(this);
            // TODO: Fill in rest of clean up for textbox below
        };

        return TextBox;
    }
]);
