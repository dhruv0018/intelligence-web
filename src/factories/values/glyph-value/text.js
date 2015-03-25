
/* Text - extends Glyph */

module.exports = [
    'GlyphValue', '$window',
    function(Glyph, $window) {

        var body;
        var testTextArea; // Singleton object used for all text tools
        var TEXT_TOOL_HINT_TEXT = 'Enter text here';

        var KEY_CODE_TO_HTML_ENTITY = {
            ' ': '&nbsp;',
        };

        function Text(type, options, containerElement) {

            Glyph.call(this, type, options, containerElement);

            body = angular.element(document.getElementsByTagName('body'));

            createPrimaryTextarea.call(this);
            if (!testTextArea) createTestTextarea.call(this);

            // enter default start-state
            enterEditMode.call(this);
        }
        angular.inheritPrototype(Text, Glyph);

        Text.prototype.TEXT_AREA_EDIT_CSS = {
            'margin': '0px',
            'padding': '20px',
            'letter-spacing': '0.5px',
            'font-family': 'Helvetica',
            'font-size': '22px',
            'line-height': '0px',
            'color': '#F3F313',
            'overflow': 'hidden',
            'min-width': '60px',
            'opacity': '1',
            'z-index': '5',
            'border': '1px solid #5394ec',
            'border-radius': '2px',
            'autofocus': true,
            'position': 'absolute',
            'background': 'transparent',
            'max-length': '70',
            // remove inherent styles
            '-webkit-box-shadow':'none',
            '-moz-box-shadow': 'none',
            'box-shadow': 'none',
            'outline': 'none',
            'resize': 'none',
            'box-sizing': 'border-box'
        };

        Text.prototype.TEXT_AREA_DISPLAY_CSS = {
            'margin': '0px',
            'padding': '20px',
            'letter-spacing': '0.5px',
            'font-family': 'Helvetica',
            'font-size': '22px',
            'line-height': '0px',
            'color': '#F3F313',
            'overflow': 'none',
            'opacity': '1',
            'z-index': '5',
            'border': 'none',
            'position': 'absolute',
            'background': 'transparent',
            'max-length': '70',
            // remove inherent styles
            '-webkit-box-shadow':'none',
            '-moz-box-shadow': 'none',
            'box-shadow': 'none',
            'outline': 'none',
            'resize': 'none',
            'box-sizing': 'border-box'
        };

        Text.prototype.TEXT_AREA_EDIT_ATTR = {
            'placeholder': TEXT_TOOL_HINT_TEXT,
            'autofocus': true
        };

        Text.prototype.KEY_MAP = {
            'DELETE': 8,
            'ENTER': 13
        };


        /* Getters and Setters */

        // TODO: Is this function needed?
        Text.prototype.getShapeContext = function getShapeContext() {

            // TODO: Return Text Element height/width
            return null;
        };

        /*
         * Used set the start position and reset the width and position of the text position based on start/end points.
         */
        Text.prototype.render = function renderText() {

            var self = this;

            if (!self.primaryTextarea) throw new Error('Text render function requires a primaryTextarea');

            var startPoint = self.getVertexInPixelsAtIndex(0);
            console.log('startPoint', startPoint);
            if (startPoint) self.primaryTextarea.css({'left': startPoint.x + 'px', 'top': startPoint.y + 'px'});

            // update textarea position
            recalculatePrimaryTextareaWidth.call(self);
            recalculatePrimaryTextareaStartPosition.call(self);
        };

        // TODO: Cleanup
        Text.prototype.destroy = function() {
            Glyph.prototype.destroy.call(this);
        };

        Text.prototype.show = function show() {

            this.primaryTextarea.css('display', 'block');
        };

        Text.prototype.hide = function hide() {

            this.primaryTextarea.css('display', 'none');
        };


        /* Private Functions */


        // creation

        var createPrimaryTextarea = function createPrimaryTextarea() {

            console.log('createPrimaryTextarea');

            var self = this;

            // create elements
            self.primaryTextarea = angular.element('<textarea></textarea>');

            // set text
            self.primaryTextarea[0].value = self.text;

            // add generic styles and attributes
            self.primaryTextarea.css(self.TEXT_AREA_EDIT_CSS);
            self.primaryTextarea.attr(self.TEXT_AREA_EDIT_ATTR);

            // add custom styles and attributes
            self.primaryTextarea.attr('readOnly', false);

            // add to dom
            self.containerElement.append(self.primaryTextarea);

            // set the starting position if it exists
            var startPoint = self.getVertexInPixelsAtIndex(0);
            if (startPoint) self.primaryTextarea.css({'left': startPoint.x + 'px', 'top': startPoint.y + 'px'});

            // add edit handlers
            // TODO: Leave binds for now, remove later if possible
            self.primaryTextarea.on('paste', handleTextareaInput.bind(self));
            self.primaryTextarea.on('keypress', handleTextareaInput.bind(self));
            self.primaryTextarea.on('keyup', handleTextareaDeleteText.bind(self));
            self.primaryTextarea.on('cut', handleTextareaDeleteText.bind(self));

            // TODO: Use window resize to recalc textarea width/position.
            // window.on('resize', function() {
            //     recalculatePrimaryTextareaWidth.call(primaryTextarea, primaryTextarea[0].value);
            // });
        };

        var createTestTextarea = function createTestTextarea() {

            console.log('createTestTextarea');

            var self = this;

            testTextArea = angular.element('<div></div>');

            // add to dom
            body.append(testTextArea);

            // add generic styles and attributes
            testTextArea.css(self.TEXT_AREA_EDIT_CSS);

            // add custom styles and attributes
            testTextArea.css({'top': '-9999px'});
        };


        /* State Switching (edit-text and display modes) */

        var boundOnEditModeBlur;
        var boundEnterDisplayMode;
        var boundEnterEditMode;
        var boundAddDraggable;
        var boundDragmove;

        /*
         * Changes styles and handlers for edit-text mode.
         * Text Input Handlers are already set.
         */
        var enterEditMode = function enterEditMode(event) {

            var self = this;

            var primaryTextarea = self.primaryTextarea;

            console.log('enterEditMode', primaryTextarea);
            if (event) event.stopPropagation();

            // bring focus to the textarea
            primaryTextarea[0].focus();

            // bind event handlers to the primaryTextArea
            boundEnterDisplayMode = enterDisplayMode.bind(self);
            boundOnEditModeBlur = onEditModeBlur.bind(self);

            // remove this handler as primaryTextArea is already in this state
            primaryTextarea.off('dblclick', boundEnterEditMode);

            // remove any other handlers
            primaryTextarea.off('click', stopEventPropagation);
            primaryTextarea.on('click', stopEventPropagation);

            // add blur event (to handle exiting this state)
            primaryTextarea.off('blur', boundOnEditModeBlur);
            primaryTextarea.on('blur', boundOnEditModeBlur);

            // add style & properties
            primaryTextarea.css(self.TEXT_AREA_EDIT_CSS);
            primaryTextarea.attr('readOnly', false);
        };

        /*
         * Changes styles and handlers for display-text mode.
         * Text Input Handlers are already set.
         */
        var enterDisplayMode = function enterDisplayMode(event) {

            var self = this;

            var primaryTextarea = self.primaryTextarea;

            console.log('enterDisplayMode', primaryTextarea);
            if (event) {
                // TODO: remove cancel bubble
                event.cancelBubble = true;
                event.stopImmediatePropagation();
            }

            // bind event handlers to the primaryTextArea
            boundEnterEditMode = enterEditMode.bind(self);
            // boundAddDraggable = addDraggable.bind(self);

            // add textarea display-mode event handlers
            primaryTextarea.off('click', stopEventPropagation);
            primaryTextarea.on('click', stopEventPropagation);
            primaryTextarea.off('dblclick', boundEnterEditMode);
            primaryTextarea.on('dblclick', boundEnterEditMode);

            // TODO: add dragging functionality
            // primaryTextarea.on('mousedown', boundAddDraggable);

            // TODO: remove this handler elsewhere
            // self.containerElement.on('mouseup', function() {
            //     self.containerElement.off('mousemove', boundDragmove);
            // });

            // add style & properties
            primaryTextarea.css(self.TEXT_AREA_DISPLAY_CSS);
            primaryTextarea.attr('readOnly', true);
        };

        /*
         * Handles exiting edit-state and entering display-state
         */
        var onEditModeBlur = function onEditModeBlur(event) {
            console.log('onEditModeBlur');
            var self = this;

            var primaryTextarea = self.primaryTextarea;

            primaryTextarea.off('blur', boundOnEditModeBlur);
            // primaryTextarea.off('mousedown', boundAddDraggable);
            primaryTextarea.off('mousemove', boundDragmove);

            boundEnterDisplayMode(event);

            // TODO: check if text changed and fire an onTextChanged event

            // save text area properties
            storeTextAreaProperties.call(self);

            primaryTextarea[0].dispatchEvent(telestrationOnEditModeBlurEvent);
        };

        var storeTextAreaProperties = function storeTextAreaProperties() {
            console.log('storeTextAreaProperties');

            var self = this;

            var boundingBox = self.primaryTextarea[0].getBoundingClientRect();

            self.updateStartPointFromPixels(boundingBox.left, boundingBox.top);
            self.updateEndPointFromPixels(boundingBox.right, boundingBox.bottom);

            var newText = self.primaryTextarea[0].value;

            if (newText !== self.text) {

                self.text = newText;
                // TODO: Dispatch text change event (so it can be saved)
            }
        };

        var stopEventPropagation = function stopEventPropagation(event) {
            console.log('stopEventPropagation');

            event.stopPropagation();
        };

        // TODO: Use node emitter
        var telestrationOnEditModeBlurEventInfo = {
            detail: {},
            bubbles: true,
            cancelable: true
        };
        var telestrationOnEditModeBlurEvent = new CustomEvent('telestration:onEditModeBlur', telestrationOnEditModeBlurEventInfo);

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
            console.log('handleTextareaInput');
            var self = this;

            event.preventDefault();
            event.stopPropagation();

            var primaryTextarea = self.primaryTextarea;
            console.log('handleTextareaInput primaryTextarea[0].value', primaryTextarea[0].value, 'keyCode', event.keyCode, 'keyChar', String.fromCharCode(event.keyCode));
            //console.log('handleTextareaInput', primaryTextarea, event);
            if (primaryTextarea[0].readOnly) {
                console.log('handleTextareaInput readOnly');
                event.preventDefault();
                return;
            }

            var numChars = primaryTextarea[0].textLength;
            var keyCode = event.keyCode || event.which;
            var keyCodeString = String.fromCharCode(keyCode);

            // TODO: Prevent Enter until text-box height expansion is allowed.
            if (keyCode === self.KEY_MAP.ENTER) {
                console.log('handleTextareaInput prevent enter default');
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

                console.log('htmlEncodedString', htmlEncodedString);
                // prevent input if next width would be too wide for container
                if (Math.ceil(nextWidth) > self.getMaxWidth()) {
                    console.log('handleTextareaInput preventDefault');
                    event.preventDefault();
                }

                // NOTE: placeholder affects text-area inner size, thus remove it
                // when there is any entered text
                if (nextString.length) primaryTextarea.removeAttr('placeholder');

                recalculatePrimaryTextareaWidth.call(self, htmlEncodedString);

                primaryTextarea[0].value = nextString;
            }
        }

        /*
         * Handle cut/delete events primarily.
         */
        function handleTextareaDeleteText(event) {
            console.log('handleTextareaDeleteText');
            var self = this;

            var primaryTextarea = self.primaryTextarea;
            event.stopPropagation();

            console.log('handleTextareaDeleteText');
            if (primaryTextarea[0].readOnly) {
                console.log('handleTextareaDeleteText readOnly');
                event.preventDefault();
                return;
            }

            //console.log('handleTextareaDeleteText', primaryTextarea, event);
            var keyCode = event.keyCode || event.which;
            var nextString = primaryTextarea[0].value;
            var htmlEncodedString = htmlEntityEncode(nextString);
            recalculatePrimaryTextareaWidth.call(self, htmlEncodedString);
            recalculatePrimaryTextareaStartPosition.call(self);

            console.log('handleTextareaDeleteText htmlEncodedString', htmlEncodedString);
            // NOTE: Add placeholder when there's no text
            if (!nextString.length) primaryTextarea.attr('placeholder', TEXT_TOOL_HINT_TEXT);
        }

        function recalculatePrimaryTextareaWidth(text) {

            var self = this;

            var primaryTextarea = self.primaryTextarea;

            // console.log('recalculatePrimaryTextareaWidth', text);

            if (!text) {

                primaryTextarea.css('width', 'auto');

            } else {

                var newTextWidth = calculateTextWidth(text);

                setTextareaWidth.call(self, newTextWidth);
            }
        }

        function recalculatePrimaryTextareaStartPosition() {

            var self = this;
            var newLeft;
            var newTop;

            var primaryTextarea = self.primaryTextarea;

            var textareaClientRect = primaryTextarea[0].getBoundingClientRect();

            var containerElementClientRect = self.containerElement[0].getBoundingClientRect();

            //console.log('textareaClientRect', textareaClientRect);
            //console.log('containerElementWidth', containerElementClientRect.width);
            var overlapDeltaX = textareaClientRect.right - containerElementClientRect.right;
            var overlapDeltaY = textareaClientRect.bottom - containerElementClientRect.bottom;
            //console.log('overlapDelta', overlapDeltaX, overlapDeltaY);

            if (overlapDeltaX > 0) {

                newLeft = textareaClientRect.left - overlapDeltaX - containerElementClientRect.left;
                //console.log('newLeft', newLeft, newLeft+textareaClientRect.width, containerElementClientRect.width);
                primaryTextarea.css('left', newLeft + 'px');
            }

            if (overlapDeltaY > 0) {

                newTop = textareaClientRect.top - overlapDeltaY - containerElementClientRect.top;
                //console.log('newTop', newTop);
                primaryTextarea.css('top', newTop + 'px');
            }
        }

        function setTextareaWidth(width) {
            //console.log('setTextareaWidth', width);

            var self = this;

            self.primaryTextarea.css('width', width + 'px');
        }

        function calculateTextWidth(newString) {
            //console.log('calculateTextWidth', newString);
            testTextArea.html(newString);

            var boundingBox = testTextArea[0].getBoundingClientRect();
            // console.log('calculateTextWidth boundingBox', boundingBox);
            //console.log('Pre-calculated Width', testTextArea[0].getBoundingClientRect().width);
            return boundingBox.width;
        }

        function htmlEntityEncode(value){

            var htmlEntityEncoded = '';

            for (var index in value) {

                var char = value[index];
                htmlEntityEncoded += KEY_CODE_TO_HTML_ENTITY[char] || char;
            }

            return htmlEntityEncoded;
        }

        return Text;
    }
];
