
/* Textbox - extends Glyph */

module.exports = [
    'GlyphValue', 'GlyphConstants',
    function(Glyph, GlyphConstants) {

        function TextBox(type, SVGContext) {

            Glyph.call(this, type, SVGContext);

        }
        angular.inheritPrototype(TextBox, Glyph);

        TextBox.prototype.editable = true;
        TextBox.prototype.movable = true;
        TextBox.prototype.hintText = GlyphConstants.TEXT_TOOL_HINT_TEXT;

        TextBox.prototype.render = function renderTextBox() {

            var self = this;
            var verticesInPixels = self.getVerticesInPixels();

            if (verticesInPixels.length !== 2) throw new Error('TextBox render function requires 2 vertices and ' + verticesInPixels.length + ' given');

            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            var offsetX = endPoint.x - startPoint.x;
            var offsetY = endPoint.y - startPoint.y;

            function editMode() {
                var submitText = function submitText(saveText) {
                    var textToSave = (saveText) ? textInputElement.val() : self.text;
                    if (typeof self.onTextChangedHandler === 'function') self.onTextChangedHandler(textToSave);

                    //remove and clean up input element
                    textInputElement.off('mousedown');
                    textInputElement.off('keydown');
                    textInputElement.remove();
                };

                self.elem.empty();

                var textInputElement = angular.element('<textarea class="telestration-text" style="top:' + startPoint.y + 'px;left:' + startPoint.x + 'px;height:' + offsetY + 'px;width:' + offsetX + 'px;" autofocus="true">' +
                '</textarea>');
                self.elem.append(textInputElement);
                textInputElement[0].focus();
                textInputElement.val('').val(self.text || self.hintText);
                textInputElement[0].select();

                textInputElement.one('keydown', function(mouseEvent) {
                    if (textInputElement.text() === self.hintText) {
                        textInputElement.text('');
                    }
                });

                //prevent drawing on top of text input box
                textInputElement.on('mousedown', function(mouseEvent) {
                    mouseEvent.stopPropagation();
                });

                textInputElement.one('blur', function() {
                    submitText(true);
                });

                textInputElement.on('keydown', function(mouseEvent) {
                    if (mouseEvent.keyCode === 27) {
                        submitText(false);
                    }
                });
            }

            function registerMoveListeners(element) {

                var isMoving = false;
                var moveStartPoint = {};

                function dragstart(mouseEvent) {

                    mouseEvent.stopPropagation();
                    isMoving = true;

                    moveStartPoint.x = mouseEvent.x;
                    moveStartPoint.y = mouseEvent.y;
                    lastMovePoint = angular.copy(moveStartPoint);

                    if (typeof self.onMoveStartHandler === 'function') self.onMoveStartHandler();
                }

                function dragmove(mouseEvent) {
                    if (isMoving) {
                        var delta = {};
                        delta.x = mouseEvent.x - lastMovePoint.x;
                        delta.y = mouseEvent.y - lastMovePoint.y;
                        lastMovePoint.x = mouseEvent.x;
                        lastMovePoint.y = mouseEvent.y;

                        if (typeof self.onMoveHandler === 'function') self.onMoveHandler(delta, mouseEvent);
                    }

                }

                function dragend(mouseEvent) {
                    if (isMoving) {
                        isMoving = false;

                        var moveOffsetX = mouseEvent.x - moveStartPoint.x;
                        var moveOffsetY = mouseEvent.y - moveStartPoint.y;
                        var distance = Math.sqrt(moveOffsetX * moveOffsetX + moveOffsetY * moveOffsetY);

                        if (distance > 10) {
                            var delta = {};
                            delta.x = mouseEvent.x - lastMovePoint.x;
                            delta.y = mouseEvent.y - lastMovePoint.y;
                            if (typeof self.onMovedHandler === 'function') self.onMovedHandler(delta);
                        }
                    }
                }

                element.bind('mousedown', dragstart);
                angular.element(document).bind('mousemove', dragmove);
                angular.element(document).bind('mouseup', dragend);
            }

            if (self.text && typeof self.text === 'string') {
                self.elem.empty();
                self.currentElement = angular.element('<div class="telestration-text-element telestration-text" style="top:' + startPoint.y + 'px;left:' + startPoint.x + 'px;color:' + self.color + ';height:' + offsetY + 'px;width:' + offsetX + 'px;">' + self.text + '</div>');
                this.elem.append(self.currentElement);
                registerMoveListeners(self.currentElement);

                self.currentElement.on('dblclick', editMode);
            } else {
                editMode();
            }
        };

        TextBox.prototype.destroy = function() {
            this.elem.empty();
            if (this.elem) this.elem.off('click');
            Glyph.prototype.destroy.call(this);
            // TODO: Fill in rest of clean up for textbox below
        };

        return TextBox;
    }
];
