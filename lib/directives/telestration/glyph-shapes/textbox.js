angular.module('GlyphShapes.TextBoxShape', []).factory('TextBoxFactory', [
    'TelestrationInterface', 'ShapeFactory', 'GlyphShapesConstants', 'TELESTRATION_TYPES',
    function(telestrationInterface, Shape, glyphShapesConstants, TELESTRATION_TYPES) {

        function TextBox() {

            Shape.call(this, TELESTRATION_TYPES.TEXT_TOOL);

        }
        angular.inheritPrototype(TextBox, Shape);

        TextBox.prototype.editable = false;
        TextBox.prototype.movable = false;
        TextBox.prototype.hintText = glyphShapesConstants.TEXT_TOOL_HINT_TEXT;

        TextBox.prototype.render = function renderTextBox() {

            var self = this;

            var verticesInPixels = self.getVerticesInPixels();
            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            self.elem.empty();

            var offsetX = endPoint.x - startPoint.x;
            var offsetY = endPoint.y - startPoint.y;

            if (this.text && typeof this.text === 'string') {
                self.currentElement = angular.element('<div class="telestration-text" style="top:' + startPoint.y + 'px;left:' + startPoint.x + 'px;color:' + this.color + ';">' + this.text + '</div>');
                self.elem.append(self.currentElement);
            } else {

                var textInputElement = angular.element('<textarea style="top:' + startPoint.y + 'px;left:' + startPoint.x + 'px;height:' + offsetY + 'px;width:' + offsetX + 'px;">' +
                    self.hintText +
                '</textarea>');
                self.elem.append(textInputElement);

                textInputElement.one('click', function(mouseEvent) {
                    if (textInputElement.text() === self.hintText) {
                        textInputElement.text('');
                    }
                });

                //prevent drawing on top of text input box
                textInputElement.on('mousedown', function(mouseEvent) {
                    mouseEvent.stopPropagation();
                });

                textInputElement.one('blur', function(mouseEvent) {
                    console.log(mouseEvent, textInputElement.val());
                    if (typeof self.onTextChangedHandler === 'function') self.onTextChangedHandler(textInputElement.val());

                    //remove and clean up input element
                    textInputElement.off('mousedown');
                    textInputElement.remove();
                });
            }
        };

        TextBox.prototype.destroy = function() {
            Shape.prototype.destroy.call(this);
            // TODO: Fill in rest of clean up for textbox below
        };

        return TextBox;
    }
]);
