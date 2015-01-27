angular.module('GlyphShapes.TextBoxShape', []).factory('TextBoxFactory', [
    'TelestrationInterface',
    function(telestrationInterface) {
        function TextBox() {

            var self = this;

            self.currentShape = telestrationInterface.telestrationSVG.path();

            self.render = function renderTextBox(vertices, color, text) {

                var startPoint = vertices[0];
                var endPoint = vertices[1];

                self.glyphElement.empty();

                var offsetX = endPoint[0] - startPoint[0];
                var offsetY = endPoint[1] - startPoint[1];

                var textShape = angular.element('<textarea style="top:' + startPoint[1] + 'px;left:' + startPoint[0] + 'px;height:' + offsetY + 'px;width:' + offsetX + 'px;">' +
                    text +
                '</textarea>');
                self.glyphElement.append(textShape);

                textShape.one('click', function(mouseEvent) {
                    //TODO: make 'Enter text here' variable/constant
                    if (textShape.text() === 'Enter text here') {
                        textShape.text('');
                    }
                });

                //prevent drawing on top of text input box
                textShape.on('mousedown', function(mouseEvent) {
                    mouseEvent.stopPropagation();
                });

                textShape.one('blur', function(mouseEvent) {
                    console.log(mouseEvent, textShape.val());
                    //if (typeof self.onTextChanged === 'function') self.onTextChanged(textShape.val());
                });

                return self;
            };
        }

        return TextBox;
    }
]);
