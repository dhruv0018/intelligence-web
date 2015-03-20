
/* Textbox - extends Glyph */

module.exports = [
    'GlyphValue', '$window',
    function(Glyph, $window) {

        var body = angular.element(document.getElementsByTagName('body'));
        var testTextArea; // Singleton object used for all text tools
        var TEXT_TOOL_HINT_TEXT = 'Enter text here';

        function TextBox(type, options, containerElement) {

            Glyph.call(this, type, options, containerElement);

            createPrimaryTextarea.call(this);
            if (!testTextArea) createTestTextarea.call(this);

            // enter default start-state
            enterTextareaEditMode.call(this);
        }
        angular.inheritPrototype(TextBox, Glyph);

        TextBox.prototype.EDITABLE = false;
        TextBox.prototype.MOVEABLE = true;

        TextBox.prototype.TEXT_AREA_EDIT_CSS = {
            'margin': '0px',
            'padding': '1vw 1vw 0 1vw',
            'letter-spacing': '0.5px',
            'font-family': 'Helvetica',
            'font-size': '2vw',
            'line-height': '1vw',
            'color': '#F3F313',
            'overflow': 'hidden',
            'opacity': '1',
            'z-index': '1',
            'border': '1px solid #5394ec',
            'border-radius': '2px',
            'autofocus': true,
            'position': 'absolute',
            'background': 'transparent',
            'max-length': '140',
            // remove inherent styles
            '-webkit-box-shadow':'none',
            '-moz-box-shadow': 'none',
            'box-shadow': 'none',
            'outline': 'none',
            'resize': 'none',
            'box-sizing': 'border-box'
        };

        TextBox.prototype.TEXT_AREA_DISPLAY_CSS = {
            'margin': '0px',
            'padding': '1vw 1vw 0 1vw',
            'letter-spacing': '0.5px',
            'font-family': 'Helvetica',
            'font-size': '2vw',
            'line-height': '1vw',
            'color': '#F3F313',
            'overflow': 'none',
            'opacity': '1',
            'z-index': '1',
            'border': 'none',
            'position': 'absolute',
            'background': 'transparent',
            'max-length': '140',
            // remove inherent styles
            '-webkit-box-shadow':'none',
            '-moz-box-shadow': 'none',
            'box-shadow': 'none',
            'outline': 'none',
            'resize': 'none',
            'box-sizing': 'border-box'
        };

        TextBox.prototype.TEXT_AREA_EDIT_ATTR = {
            'placeholder': TEXT_TOOL_HINT_TEXT,
            'autofocus': true
        };

        TextBox.prototype.KEY_MAP = {
            'DELETE': 8,
            'ENTER': 13
        };

        var KEY_CODE_TO_HTML_ENTITY = {
            ' ': '&nbsp;',
        };

        /* Getters and Setters */

        TextBox.prototype.getShapeContext = function getShapeContext() {

            // TODO: Return Text Element height/width
            return null;
        };

        TextBox.prototype.render = function renderTextBox() {

            var self = this;
            var verticesInPixels = self.getVerticesInPixels();

            if (verticesInPixels.length !== 1) throw new Error('TextBox render function requires 2 vertices and ' + verticesInPixels.length + ' given');

            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            // update textarea position
            self.primaryTextarea.css({'left': startPoint + 'px', 'top': endPoint + 'px'});

        };

        TextBox.prototype.destroy = function() {
            Glyph.prototype.destroy.call(this);
        };


        /* Private Functions */


        // creation

        var createPrimaryTextarea = function createPrimaryTextarea() {

            var self = this;

            // create elements
            self.primaryTextarea = angular.element('<textarea></textarea>');

            // add generic styles and attributes
            self.primaryTextarea.css(self.TEXT_AREA_EDIT_CSS);
            self.primaryTextarea.attr(self.TEXT_AREA_EDIT_ATTR);

            // add custom styles and attributes
            self.primaryTextarea.attr('readonly', false);

            // add to dom
            self.containerElement.append(self.primaryTextarea);

            // add edit handlers
            // TODO: Leave binds for now, remove later if possible
            self.primaryTextarea.on('paste', handleTextareaInput.bind(self));
            self.primaryTextarea.on('keypress', handleTextareaInput.bind(self));
            self.primaryTextarea.on('keyup', handleTextareaDeleteText.bind(self));
            self.primaryTextarea.on('cut', handleTextareaDeleteText.bind(self));

            recalculateTextareaPosition.call(self);

            // TODO: Use window resize to recalc textarea width/position.
            // window.on('resize', function() {
            //     recalculateTextareaWidth.call(primaryTextarea, primaryTextarea[0].value);
            // });
        };

        var createTestTextarea = function createTestTextarea() {

            var self = this;

            testTextArea = angular.element('<div></div>');

            // add to dom
            body.append(testTextArea);

            // add generic styles and attributes
            testTextArea.css(self.TEXT_AREA_DISPLAY_CSS);

            // add custom styles and attributes
            testTextArea.css({'top': '-9999px'});
        };


        /* State Switching (edit-text and display modes) */

        var boundGlyphBlurred;
        var boundEnterTextareaDisplayMode;
        var boundEnterTextareaEditMode;
        var boundAddDraggable;
        var boundDragmove;

        /*
         * Changes styles and handlers for edit-text mode.
         * Text Input Handlers are already set.
         */
        var enterTextareaEditMode = function enterTextareaEditMode(event) {

            var self = this;

            var primaryTextarea = self.primaryTextarea;

            //console.log('enterTextareaDisplayMode', primaryTextarea, event);
            if (event) event.stopPropagation();

            // bring focus to the textarea
            primaryTextarea[0].focus();

            // bind event handlers to the primaryTextArea
            boundEnterTextareaDisplayMode = enterTextareaDisplayMode.bind(primaryTextarea);
            boundGlyphBlurred = glyphBlurred.bind(primaryTextarea);

            // remove this handler as primaryTextArea is already in this state
            primaryTextarea.off('dblclick', boundEnterTextareaEditMode);

            // remove any other handlers
            primaryTextarea.off('click', stopEventPropagation);

            // add blur event (to handle exiting this state)
            primaryTextarea.on('blur', boundGlyphBlurred);

            // add style & properties
            primaryTextarea.css(self.TEXT_AREA_DISPLAY_CSS);
            primaryTextarea.attr('readonly', false);
        };

        /*
         * Changes styles and handlers for display-text mode.
         * Text Input Handlers are already set.
         */
        var enterTextareaDisplayMode = function enterTextareaDisplayMode(event) {

            var primaryTextarea = self.primaryTextarea;

            console.log('enterTextareaDisplayMode', primaryTextarea, event);
            if (event) {
                event.stopImmediatePropagation();
            }

            // bind event handlers to the primaryTextArea
            boundEnterTextareaEditMode = enterTextareaEditMode.bind(primaryTextarea);
            boundAddDraggable = addDraggable.bind(primaryTextarea);

            // add textarea display-mode event handlers
            primaryTextarea.on('click', stopEventPropagation);
            primaryTextarea.on('dblclick', boundEnterTextareaEditMode);

            // TODO: add dragging functionality
            // primaryTextarea.on('mousedown', boundAddDraggable);

            // TODO: remove this handler elsewhere
            // self.containerElement.on('mouseup', function() {
            //     self.containerElement.off('mousemove', boundDragmove);
            // });

            // add style & properties
            primaryTextarea.css(self.TEXT_AREA_DISPLAY_CSS);
            primaryTextarea.attr('readonly', true);
        };

        /*
         * Handles exiting edit-state and entering display-state
         */
        var glyphBlurred = function glyphBlurred(event) {

            var primaryTextarea = self.primaryTextarea;

            primaryTextarea.off('blur', boundGlyphBlurred);
            primaryTextarea.off('mousedown', boundAddDraggable);
            primaryTextarea.off('mousemove', boundDragmove);

            boundEnterTextareaDisplayMode(event);

            primaryTextarea[0].dispatchEvent(telestrationGlyphBlurredEvent);
        };

        var stopEventPropagation = function stopEventPropagation(event) {

            event.stopPropagation();
        };

        // TODO: Use node emitter
        var telestrationGlyphBlurredEventInfo = {
            detail: {},
            bubbles: true,
            cancelable: true
        };
        var telestrationGlyphBlurredEvent = new CustomEvent('telestration:glyphBlurred', telestrationGlyphBlurredEventInfo);

        // TODO: Finish implementing draggable.
        // var addDraggable = function addDraggable(event) {

        //     var primaryTextarea = self.primaryTextarea;

        //     console.log('addDraggable', event);
        //     boundDragmove = dragmove.bind(primaryTextarea);

        //     self.containerElement.on('mousemove', boundDragmove);
        // };

        // var dragmove = function dragmove(event) {

        //     var primaryTextarea = self.primaryTextarea;

        //     console.log('dragmove', event);
        //     primaryTextarea.css({
        //         'left': event.offsetX + 'px',
        //         'top': event.offsetY + 'px'
        //     });
        // };

        /******************************************************************
         * Text input (while in edit-state) and textarea size/positiong functions *
         ******************************************************************/

        /*
         * Handles new entered text, and resizing/positioning the textarea pre-emptively
         */
        function handleTextareaInput(event) {

            var self = this;

            var primaryTextarea = self.primaryTextarea;

            //console.log('handleTextareaInput', primaryTextarea, event);
            if (primaryTextarea[0].readonly) {
                event.preventDefault();
                return;
            }

            var numChars = primaryTextarea[0].textLength;
            var keyCode = event.keyCode || event.which;
            var keyCodeString = String.fromCharCode(keyCode);

            // TODO: Prevent Enter until text-box height expansion is allowed.
            if (keyCode === self.KEY_MAP.ENTER) {

               event.preventDefault();

            } else {

                var newestValue = '';

                if (event.type === 'paste') {

                    newestValue = event.clipboardData.getData('text/plain');

                } else if (keyCodeString) {

                    newestValue = keyCodeString;
                }

                var nextString = primaryTextarea[0].value + newestValue;
                var htmlEncodedString = htmlEntityEncode(nextString);
                var nextWidth = calculateTextWidth.call(primaryTextarea, htmlEncodedString);

                // prevent input if next width would be too wide for container
                if (Math.ceil(nextWidth) > self.getMaxWidth()) {

                    event.preventDefault();
                }

                // NOTE: placeholder affects text-area inner size, thus remove it
                // when there is any entered text
                if (nextString.length) primaryTextarea.removeAttr('placeholder');

                recalculateTextareaWidth.call(self, htmlEncodedString);
            }
        }

        /*
         * Handle cut/delete events primarily.
         */
        function handleTextareaDeleteText(event) {

            var self = this;

            var primaryTextarea = self.primaryTextarea;

            if (primaryTextarea[0].readonly) {

                event.preventDefault();
                return;
            }

            //console.log('handleTextareaDeleteText', primaryTextarea, event);
            var keyCode = event.keyCode || event.which;
            var nextString = primaryTextarea[0].value;
            var htmlEncodedString = htmlEntityEncode(nextString);
            recalculateTextareaWidth.call(self, htmlEncodedString);
            recalculateTextareaPosition.call(self);

            // NOTE: Add placeholder when there's no text
            if (!nextString.length) primaryTextarea.attr('placeholder', TEXT_TOOL_HINT_TEXT);
        }

        function recalculateTextareaWidth(text) {

            console.log('recalculateTextareaWidth', text, text.length);

            if (!text.length) {

                this.css('width', 'auto');

            } else {

                var newTextWidth = calculateTextWidth(text);

                setTextareaWidth.call(this, newTextWidth);
            }
        }

        function recalculateTextareaPosition() {

            var self = this;

            var primaryTextarea = self.primaryTextarea;

            var textareaClientRect = primaryTextarea[0].getBoundingClientRect();

            var containerElementClientRect = containerElement[0].getBoundingClientRect();

            // console.log('textareaClientRect', textareaClientRect);
            // console.log('containerElementWidth', containerElementClientRect.width);
            var overlapDeltaX = textareaClientRect.right - containerElementClientRect.width;
            var overlapDeltaY = textareaClientRect.bottom - containerElementClientRect.height;
            // console.log('overlapDelta', overlapDeltaX, overlapDeltaY);

            if (overlapDeltaX > 0) {

                var newLeft = textareaClientRect.left - overlapDeltaX;
                // console.log('newLeft', newLeft, newLeft+textareaClientRect.width, containerElementClientRect.width);
                primaryTextarea.css('left', newLeft + 'px');
            }

            if (overlapDeltaY > 0) {

                var newTop = textareaClientRect.top - overlapDeltaY;
                // console.log('newTop', newTop);
                primaryTextarea.css('top', newTop + 'px');
            }
        }

        function setTextareaWidth(width) {

            console.log('setTextareaWidth', width);

            this.css('width', width + 'px');
        }

        function calculateTextWidth(newString) {

            testTextArea.html(newString);
            //console.log('Pre-calculated Width', testTextArea[0].getBoundingClientRect().width);
            return testTextArea[0].getBoundingClientRect().width;
        }

        function htmlEntityEncode(value){

            var htmlEntityEncoded = '';

            for (var index in value) {

                var char = value[index];
                htmlEntityEncoded += self.KEY_CODE_TO_HTML_ENTITY[char] || char;
            }

            return htmlEntityEncoded;
        }

        return TextBox;
    }
];




// Going to be the telestration context area.
self.containerElement.on('mouseout', function(event) {
    // console.log('containerElement mouseout. Remove click handler', event);
    self.containerElement.off('click', handleClick);
});

self.containerElement.on('mouseenter', addClickHandler);

function addClickHandler() {
    // console.log('add click handler');
    self.containerElement.off('mousemove', addClickHandler);
    self.containerElement.off('click', handleClick);
    self.containerElement.on('click', handleClick);
}

self.containerElement.on('telestration:glyphBlurred', function(event) {

    self.console.log('containerElement received telestration:glyphBlurred event');
    self.containerElement.on('click', addClickHandler);
});

