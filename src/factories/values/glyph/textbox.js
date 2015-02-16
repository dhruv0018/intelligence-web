
/* Textbox - extends Glyph */

module.exports = [
    'GlyphValue', 'GlyphConstants',
    function(Glyph, GlyphConstants) {

        function TextBox(type, SVGContext) {

            Glyph.call(this, type, SVGContext);
            this.editMode = true;

        }
        angular.inheritPrototype(TextBox, Glyph);

        TextBox.prototype.editable = false;
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

                var textInputElement;
                var textInputArea;

                var submitText = function submitText(saveText) {
                    self.editMode = false;

                    var textToSave = (saveText) ? textInputArea.val() : self.text;

                    var textChangeObj = {
                        text: textToSave,
                        fontSize: '80px',
                        dimensions: textInputArea[0].getBoundingClientRect()
                    };

                    if (typeof self.onTextChangedHandler === 'function') self.onTextChangedHandler(textChangeObj);

                    //remove and clean up input element
                    textInputArea.off('mousedown');
                    textInputArea.off('keydown');
                    textInputArea.off('change keyup keydown paste cut');
                    textInputElement.remove();
                };

                self.elem.empty();

                textInputElement = angular.element('<div class="telestration-text-wrapper">' +
                    '<textarea wrap="off" class="telestration-text" style="overflow-x:hidden;overflow-y:hidden;top:' + startPoint.y + 'px;left:' + startPoint.x + 'px;width:' + offsetX + 'px;color:' + self.color + '" autofocus="true">' +
                    '</textarea>' +
                '</div>');

                self.elem.append(textInputElement);

                textInputArea = textInputElement.find('textarea');
                textInputArea[0].focus();

                function fitTextArea(event) {
                    var thisElement = angular.element(this);
                    thisElement.css('width', '0px');
                    thisElement.css('height', '0px');
                    if (typeof this.scrollWidth === 'undefined') {
                        thisElement.css('width', offsetX + 'px');
                    } else {
                        thisElement.css('width', this.scrollWidth + 'px');
                    }

                    if (typeof this.scrollHeight === 'undefined') {
                        thisElement.css('height', offsetY + 'px');
                    } else {
                        thisElement.css('height', this.scrollHeight + 'px');
                    }
                }

                textInputArea.on('change keyup keydown paste cut', fitTextArea);
                fitTextArea.call(textInputArea);
                textInputArea.val('').val(self.text || '');

                //prevent drawing on top of text input box
                textInputArea.on('mousedown', function(mouseEvent) {
                    mouseEvent.stopPropagation();
                });

                textInputArea.one('blur', function() {
                    submitText(true);
                });

                textInputArea.on('keydown', function(keyEvent) {
                    if (keyEvent.keyCode === 27) {
                        submitText(false);
                    } else if (keyEvent.keyCode === 13) {
                        submitText(true);
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
                        var currrentTop = Number.parseInt(self.currentElement.css('top').replace(/px/, ''), 10);
                        var currrentLeft = Number.parseInt(self.currentElement.css('left').replace(/px/, ''), 10);
                        currrentTop = currrentTop + delta.y;
                        currrentLeft = currrentLeft + delta.x;
                        self.currentElement.css({top: currrentTop + 'px', left: currrentLeft + 'px'});
                    }

                }

                function dragend(mouseEvent) {
                    if (isMoving) {
                        isMoving = false;

                        var delta = {};
                        delta.x = mouseEvent.x - moveStartPoint.x;
                        delta.y = mouseEvent.y - moveStartPoint.y;
                        var distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);

                        if (distance > 5) {
                            if (typeof self.onMovedHandler === 'function') self.onMovedHandler(delta);
                        }
                    }
                }

                element.bind('mousedown', dragstart);
                angular.element(document).bind('mousemove', dragmove);
                angular.element(document).bind('mouseup', dragend);
            }

            if (self.editMode) {
                editMode();
            } else {
                self.elem.empty();
                self.currentElement = angular.element('<div class="telestration-text-element telestration-text" style="top:' + startPoint.y + 'px;left:' + startPoint.x + 'px;color:' + self.color + ';height:' + offsetY + 'px;width:' + offsetX + 'px;">' + self.text + '</div>');
                this.elem.append(self.currentElement);
                registerMoveListeners(self.currentElement);

                self.currentElement.on('click', self.onClickHandler);
                self.currentElement.on('dblclick', editMode);
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
