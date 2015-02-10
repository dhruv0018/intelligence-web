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

            var verticesInPixels = self.getVerticesInPixels();
            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            var self = this;

            var offsetX = endPoint.x - startPoint.x;
            var offsetY = endPoint.y - startPoint.y;

            function editMode() {
                var submitText = function submitText(mouseEvent) {
                    console.log(mouseEvent, textInputElement.val());
                    if (typeof self.onTextChangedHandler === 'function') self.onTextChangedHandler(textInputElement.val());

                    //remove and clean up input element
                    textInputElement.off('mousedown');
                    textInputElement.off('keydown');
                    textInputElement.remove();
                };

                self.elem.empty();

                var textInputElement = angular.element('<textarea style="top:' + startPoint.y + 'px;left:' + startPoint.x + 'px;height:' + offsetY + 'px;width:' + offsetX + 'px;">' +
                    (this.text || self.hintText) +
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

                textInputElement.one('blur', submitText);
                textInputElement.on('keydown', function(mouseEvent) {
                    if (mouseEvent.keyCode === 13) {
                        submitText(mouseEvent);
                    }
                });
            }

            if (text && typeof text === 'string') {
                self.elem.empty();
                self.currentElement = angular.element('<div class="telestration-text" style="top:' + startPoint.y + 'px;left:' + startPoint.x + 'px;color:' + color + ';">' + text + '</div>');
                this.elem.append(self.currentElement);

                self.currentElement.on('click', editMode);
            } else {
                editMode();
            }
        };

        TextBox.prototype.destroy = function() {
            this.elem.empty();
            if (this.elem) this.elem.off('click');
            Shape.prototype.destroy.call(this);
            // TODO: Fill in rest of clean up for textbox below
        };

        return TextBox;
    }
]);
