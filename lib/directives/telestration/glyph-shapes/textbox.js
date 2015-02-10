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

                self.glyphElement.empty();

                var textInputElement = angular.element('<textarea style="top:' + startPoint.y + 'px;left:' + startPoint.x + 'px;height:' + offsetY + 'px;width:' + offsetX + 'px;">' +
                    (text || self.HINT_TEXT) +
                '</textarea>');
                self.glyphElement.append(textInputElement);

                textInputElement.one('click', function(mouseEvent) {
                    if (textInputElement.text() === self.HINT_TEXT) {
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
                self.glyphElement.empty();
                self.currentElement = angular.element('<div class="telestration-text" style="top:' + startPoint.y + 'px;left:' + startPoint.x + 'px;color:' + color + ';">' + text + '</div>');
                this.glyphElement.append(self.currentElement);

                self.currentElement.on('click', editMode);
            } else {
                editMode();
            }
        };

        TextBox.prototype.destroy = function() {
            this.glyphElement.empty();
            if (this.glyphElement) this.glyphElement.off('click');
            Shape.prototype.destroy.call(this);
            // TODO: Fill in rest of clean up for textbox below
        };

        return TextBox;
    }
]);
