angular.module('GlyphShapes.TextBoxShape', []).factory('TextBoxFactory', [
    'TelestrationInterface', 'ShapeFactory',
    function(telestrationInterface, Shape) {

        function TextBox(glyphElement) {
            if (!glyphElement) throw new Error('Textbox require glyph element');

            Shape.call(this);

            this.glyphElement = glyphElement;
        }
        angular.inheritPrototype(TextBox, Shape);

        TextBox.prototype.editable = false;
        TextBox.prototype.movable = false;

        TextBox.prototype.render = function renderTextBox(vertices, color, text) {

            var startPoint = vertices[0];
            var endPoint = vertices[1];

            this.glyphElement.empty();

            var offsetX = endPoint[0] - startPoint[0];
            var offsetY = endPoint[1] - startPoint[1];

            var textInputElement = angular.element('<textarea style="top:' + startPoint[1] + 'px;left:' + startPoint[0] + 'px;height:' + offsetY + 'px;width:' + offsetX + 'px;">' +
                text +
            '</textarea>');
            this.glyphElement.append(textInputElement);

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
