
/* Text - extends Glyph */

module.exports = [
    'GlyphValue', '$window',
    function(Glyph, $window) {

        var body;
        var testTextArea; // Singleton object used for all text tools
        var containerBoundingBox;

        function Text(type, options, containerElement) {

            Glyph.call(this, type, options, containerElement);

            body = angular.element(document.getElementsByTagName('body'));

            createPrimaryTextarea.call(this);
            if (!testTextArea) createTestTextarea.call(this);

            // enter default start-state
            enterEditMode.call(this);
        }
        angular.inheritPrototype(Text, Glyph);

        Text.prototype.KEY_CODE_TO_HTML_ENTITY = {
            ' ': '&nbsp;',
        };

        Text.prototype.TEXT_TOOL_HINT_TEXT = 'Enter text here';

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
            // remove inherent styles
            '-webkit-box-shadow':'none',
            '-moz-box-shadow': 'none',
            'box-shadow': 'none',
            'outline': 'none',
            'resize': 'none',
            'box-sizing': 'border-box',
            'cursor': 'text'
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
            // remove inherent styles
            '-webkit-box-shadow':'none',
            '-moz-box-shadow': 'none',
            'box-shadow': 'none',
            'outline': 'none',
            'resize': 'none',
            'box-sizing': 'border-box',
            'cursor': 'pointer'
        };

        Text.prototype.TEXT_AREA_EDIT_ATTR = {
            'placeholder': Text.prototype.TEXT_TOOL_HINT_TEXT,
            'autofocus': true
        };

        Text.prototype.KEY_MAP = {
            'DELETE': 8,
            'ENTER': 13
        };

        Text.prototype.MAX_LENGTH = 70;


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
            // $window.on('resize', function() {
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
        var boundDragMove;
        var boundDragEnd;

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
            boundAddDraggable = addDraggable.bind(self);

            // add textarea display-mode event handlers
            primaryTextarea.off('click', stopEventPropagation);
            primaryTextarea.on('click', stopEventPropagation);
            primaryTextarea.off('dblclick', boundEnterEditMode);
            primaryTextarea.on('dblclick', boundEnterEditMode);

            // TODO: add dragging functionality
            primaryTextarea.on('mousedown', boundAddDraggable);

            // TODO: remove this handler elsewhere
            // self.containerElement.on('mouseup', function() {
            //     self.containerElement.off('mousemove', boundDragMove);
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
            primaryTextarea.off('mousedown', boundAddDraggable);
            removeDraggable();

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

        var removeDraggable = function removeDraggable(event) {
            console.log('mouseup');
            $window.removeEventListener('mousemove', boundDragMove);
        };

        var dragEnd = function dragEnd(event) {

            var self = this;

            removeDraggable();
            recalculatePrimaryTextareaStartPosition.call(self);
        };

        // TODO: Finish implementing draggable.
        var addDraggable = function addDraggable(event) {
            console.log('addDraggable', event);
            var self = this;
            var primaryTextarea = self.primaryTextarea;

            containerBoundingBox = self.getContainerDimensions();
            primaryTextarea.startPosition = {x: event.offsetX, y: event.offsetY};

            boundDragMove = dragMove.bind(self);
            boundDragEnd = dragEnd.bind(self);

            $window.removeEventListener('mousemove', boundDragMove);
            $window.addEventListener('mousemove', boundDragMove);

            // listen to turn off dragging
            primaryTextarea.off('mouseup',boundDragEnd);
            primaryTextarea.on('mouseup', boundDragEnd);
        };

        var dragMove = function dragMove(event) {

            var primaryTextarea = this.primaryTextarea;

            var left = event.clientX - containerBoundingBox.left - primaryTextarea.startPosition.x;
            var top = event.clientY - containerBoundingBox.top - primaryTextarea.startPosition.y;

            console.log('dragMove', event);
            primaryTextarea.css({
                'left': left + 'px',
                'top': top + 'px'
            });
        };

        /******************************************************************
         * Text input (while in edit-state) and textarea size/positiong functions *
         ******************************************************************/

        /*
         * Handles new entered text, and resizing/positioning the textarea pre-emptively
         * Handles text input MANUALLY so that we can pre-emptively grow the textarea's
         * width before the text is entered. In order to know the width before-hand, we
         * use a secondary div element (testTextarea) off-screen with the same style to
         * get the nextWidth of the primaryTextarea.
         */
        function handleTextareaInput(event) {

            var self = this;

            event.preventDefault();
            event.stopPropagation();

            var primaryTextarea = self.primaryTextarea;

            var keyCode = event.keyCode || event.which;
            var keyCodeString = String.fromCharCode(keyCode);

            if (primaryTextarea[0].readOnly) return;

            // TODO: Prevent Enter until text-box height expansion is allowed.
            if (keyCode === self.KEY_MAP.ENTER) {
                // TODO: HANDLE THIS CASE WHEN GROWING VERTICALLY
                return;
            } else {

                let newestValue = '';

                if (event.type === 'paste') {

                    newestValue = event.clipboardData.getData('text/plain');

                } else if (keyCodeString) {

                    newestValue = keyCodeString;
                }

                let selectionStart = primaryTextarea[0].selectionStart;
                let selectionEnd = primaryTextarea[0].selectionEnd;

                // nextString is the actual text to be set in the primaryTextArea
                let nextString = primaryTextarea[0].value.split('');
                nextString.splice(selectionStart, selectionEnd - selectionStart, newestValue);
                nextString = nextString.join('');

                // Limit textarea string length
                if (nextString.length >= self.MAX_LENGTH) return;

                let htmlEncodedString = htmlEntityEncode.call(self, nextString);
                let nextWidth = calculateTextWidth.call(primaryTextarea, htmlEncodedString);

                // prevent input if next width would be too wide for container
                if (Math.ceil(nextWidth) > self.getMaxWidth()) return;

                // NOTE: placeholder affects text-area inner size, thus remove it
                // when there is any entered text
                if (nextString.length) primaryTextarea.removeAttr('placeholder');

                // IMPORTANT: set the width to the proper width first before setting the textarea's value
                recalculatePrimaryTextareaWidth.call(self, htmlEncodedString);

                // set the textarea's value
                primaryTextarea[0].value = nextString;

                // set the selected range up by 1 from where it started
                primaryTextarea[0].setSelectionRange(selectionStart + 1, selectionStart + 1);
            }
        }

        /*
         * Handle cut/delete events primarily.
         */
        function handleTextareaDeleteText(event) {

            var self = this;

            var primaryTextarea = self.primaryTextarea;
            event.stopPropagation();

            if (primaryTextarea[0].readOnly) {
                event.preventDefault();
                return;
            }

            var keyCode = event.keyCode || event.which;
            var nextString = primaryTextarea[0].value;
            var htmlEncodedString = htmlEntityEncode.call(self, nextString);
            recalculatePrimaryTextareaWidth.call(self, htmlEncodedString);
            recalculatePrimaryTextareaStartPosition.call(self);

            // NOTE: Add placeholder when there's no text
            if (!nextString.length) primaryTextarea.attr('placeholder', self.TEXT_TOOL_HINT_TEXT);
        }

        function recalculatePrimaryTextareaWidth(text) {

            var self = this;

            var primaryTextarea = self.primaryTextarea;

            if (!text) {

                primaryTextarea.css('width', 'auto');

            } else {

                var newTextWidth = calculateTextWidth(text);

                setTextareaWidth.call(self, newTextWidth);
            }
        }

        function recalculatePrimaryTextareaStartPosition() {

            var self = this;
            var primaryTextarea = self.primaryTextarea;

            var textareaClientRect = primaryTextarea[0].getBoundingClientRect();
            var containerElementClientRect = self.containerElement[0].getBoundingClientRect();

            var overlapDeltaRight = textareaClientRect.right - containerElementClientRect.right;
            var overlapDeltaLeft = textareaClientRect.left - containerElementClientRect.left;
            var overlapDeltaBottom = textareaClientRect.bottom - containerElementClientRect.bottom;
            var overlapDeltaTop = textareaClientRect.top - containerElementClientRect.top;

            if (overlapDeltaLeft < 0) {

                let newLeft = textareaClientRect.left - containerElementClientRect.left + Math.abs(overlapDeltaLeft);
                primaryTextarea.css('left', newLeft + 'px');

            } else if (overlapDeltaRight > 0) {

                let newLeft = textareaClientRect.left - containerElementClientRect.left - Math.abs(overlapDeltaRight);
                primaryTextarea.css('left', newLeft + 'px');
            }

            if (overlapDeltaTop < 0) {

                let newTop = textareaClientRect.top - containerElementClientRect.top + Math.abs(overlapDeltaTop);
                primaryTextarea.css('top', newTop + 'px');

            } else if (overlapDeltaBottom > 0) {

                let newTop = textareaClientRect.top - containerElementClientRect.top - Math.abs(overlapDeltaBottom);
                primaryTextarea.css('top', newTop + 'px');
            }
        }

        function setTextareaWidth(width) {
            //console.log('setTextareaWidth', width);

            var self = this;

            self.primaryTextarea.css('width', width + 'px');
        }

        function calculateTextWidth(newString) {

            testTextArea.html(newString);

            var boundingBox = testTextArea[0].getBoundingClientRect();

            return boundingBox.width;
        }

        function htmlEntityEncode(value){

            var htmlEntityEncoded = '';

            for (var index in value) {

                var char = value[index];
                htmlEntityEncoded += this.KEY_CODE_TO_HTML_ENTITY[char] || char;
            }

            return htmlEntityEncoded;
        }

        return Text;
    }
];
