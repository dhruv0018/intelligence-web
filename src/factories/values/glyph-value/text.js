
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

            this.primaryTextarea = new PrimaryTextarea(this);
            if (!testTextArea) createTestTextarea.call(this);
        }
        angular.inheritPrototype(Text, Glyph);

        Text.prototype.KEY_CODE_TO_HTML_ENTITY = {
            ' ': '&nbsp;'
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
            'placeholder': Text.prototype.TEXT_TOOL_HINT_TEXT
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

            // set the starting position if it exists
            var startPoint = self.getVertexInPixelsAtIndex(0);
            if (startPoint) self.primaryTextarea.element.css({'left': startPoint.x + 'px', 'top': startPoint.y + 'px'});
            // update textarea position
            self.primaryTextarea.recalculatePrimaryTextareaWidth();
            self.primaryTextarea.recalculatePrimaryTextareaStartPosition();
        };

        // TODO: Cleanup
        Text.prototype.destroy = function() {

            Glyph.prototype.destroy.call(this);
        };

        Text.prototype.show = function show() {

            if (this.primaryTextarea) this.primaryTextarea.element.css('display', 'block');
        };

        Text.prototype.hide = function hide() {

            if (this.primaryTextarea) this.primaryTextarea.element.css('display', 'none');
        };


        /* Private Functions */


        // creation

        function PrimaryTextarea(parentGlyph) {

            console.log('PrimaryTextarea');

            var self = this;

            /* State Switching (edit-text and display modes) */

            // TODO: Use window resize to recalc textarea width/position.
            // $window.on('resize', function() {
            //     recalculatePrimaryTextareaWidth.call(primaryTextarea, primaryTextarea[0].value);
            // });

            /*
             * Changes styles and handlers for edit-text mode.
             * Text Input Handlers are already set.
             */
            let enterEditMode = function enterEditMode(event) {

                console.log('enterEditMode', self.element);
                self.element[0].focus();
                // if (event) event.stopPropagation();

                // bind event handlers to the primaryTextArea
                // boundEnterDisplayMode = enterDisplayMode.bind(self);
                // boundOnEditModeBlur = onEditModeBlur.bind(self);

                // remove this handler as primaryTextArea is already in this state
                self.element.off('dblclick', enterEditMode);

                // remove any other handlers
                self.element.off('mousedown', stopEventPropagation);
                self.element.on('mousedown', stopEventPropagation);

                // add blur event (to handle exiting this state)
                self.element.off('blur', onEditModeBlur);
                self.element.on('blur', onEditModeBlur);

                // add style & properties
                self.element.css(parentGlyph.TEXT_AREA_EDIT_CSS);
                self.element.attr('readOnly', false);
            };

            /*
             * Changes styles and handlers for display-text mode.
             * Text Input Handlers are already set.
             */
            let enterDisplayMode = function enterDisplayMode(event) {

                console.log('enterDisplayMode', self.element);
                // if (event) {
                //     // TODO: remove cancel bubble
                //     event.stopPropagation();
                // }

                // bind event handlers to the primaryTextArea
                // boundEnterEditMode = enterEditMode.bind(self);
                // boundAddDraggable = addDraggable.bind(self);

                // add textarea display-mode event handlers
                self.element.off('dblclick', enterEditMode);
                self.element.on('dblclick', enterEditMode);

                // TODO: add dragging functionality
                // self.element.off('mousedown', addDraggable);
                // self.element.on('mousedown', addDraggable);

                // TODO: remove this handler elsewhere
                // self.containerElement.on('mouseup', function() {
                //     self.containerElement.off('mousemove', boundDragMove);
                // });

                // add style & properties
                console.log('set display css and readonly');
                self.element.css(parentGlyph.TEXT_AREA_DISPLAY_CSS);
                self.element.attr('readOnly', true);
            };

            /*
             * Handles exiting edit-state and entering display-state
             */
            let onEditModeBlur = function onEditModeBlur(event) {
                console.log('onEditModeBlur');

                self.element.off('blur', onEditModeBlur);
                self.element.off('mousedown', addDraggable);

                enterDisplayMode(event);

                // TODO: check if text changed and fire an onTextChanged event

                // save text area properties
                storeTextAreaProperties();

                self.element[0].dispatchEvent(telestrationOnEditModeBlurEvent);
            };

            let storeTextAreaProperties = function storeTextAreaProperties() {
                console.log('storeTextAreaProperties');
                var boundingBox = self.element[0].getBoundingClientRect();

                parentGlyph.updateStartPointFromPixels(boundingBox.left, boundingBox.top);
                parentGlyph.updateEndPointFromPixels(boundingBox.right, boundingBox.bottom);

                var newText = self.element[0].value;

                if (newText !== parentGlyph.text) {

                    parentGlyph.text = newText;
                    // TODO: Dispatch text change event (so it can be saved)
                }
            };

            let stopEventPropagation = function stopEventPropagation(event) {
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

            let dragEnd = function dragEnd(event) {
                console.log('dragEnd');
                self.recalculatePrimaryTextareaStartPosition();
                storeTextAreaProperties();

                $window.removeEventListener('mousemove', dragMove);
                $window.off('mouseup', dragEnd);
            };

            // TODO: Finish implementing draggable.
            let addDraggable = function addDraggable(event) {
                console.log('addDraggable', event);

                containerBoundingBox = parentGlyph.getContainerDimensions();
                self.element.startPosition = {x: event.offsetX, y: event.offsetY};

                // boundDragMove = dragMove.bind(self);
                // boundDragEnd = dragEnd.bind(self);

                $window.removeEventListener('mousemove', dragMove);
                $window.addEventListener('mousemove', dragMove);

                // listen to turn off dragging
                $window.off('mouseup', dragEnd);
                $window.on('mouseup', dragEnd);
            };

            let dragMove = function dragMove(event) {

                var left = event.clientX - containerBoundingBox.left - self.element.startPosition.x;
                var top = event.clientY - containerBoundingBox.top - self.element.startPosition.y;

                console.log('dragMove', event);
                self.element.css({
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
            let handleTextareaInput = function handleTextareaInput(event) {

                event.preventDefault();
                event.stopPropagation();

                var keyCode = event.keyCode || event.which;
                var keyCodeString = String.fromCharCode(keyCode);

                if (self.element[0].readOnly) return;

                // TODO: Prevent Enter until text-box height expansion is allowed.
                if (keyCode === parentGlyph.KEY_MAP.ENTER) {
                    // TODO: HANDLE THIS CASE WHEN GROWING VERTICALLY
                    return;
                } else {

                    let newestValue = '';

                    if (event.type === 'paste') {

                        newestValue = event.clipboardData.getData('text/plain');

                    } else if (keyCodeString) {

                        newestValue = keyCodeString;
                    }

                    let selectionStart = self.element[0].selectionStart;
                    let selectionEnd = self.element[0].selectionEnd;

                    // nextString is the actual text to be set in the primaryTextArea
                    let nextString = self.element[0].value.split('');
                    nextString.splice(selectionStart, selectionEnd - selectionStart, newestValue);
                    nextString = nextString.join('');

                    // Limit textarea string length
                    if (nextString.length >= parentGlyph.MAX_LENGTH) return;

                    let htmlEncodedString = htmlEntityEncode(nextString);
                    let nextWidth = calculateTextWidth(htmlEncodedString);

                    // prevent input if next width would be too wide for container
                    if (Math.ceil(nextWidth) > parentGlyph.getMaxWidth()) return;

                    // NOTE: placeholder affects text-area inner size, thus remove it
                    // when there is any entered text
                    if (nextString.length) self.element.removeAttr('placeholder');

                    // IMPORTANT: set the width to the proper width first before setting the textarea's value
                    self.recalculatePrimaryTextareaWidth(htmlEncodedString);

                    // set the textarea's value
                    self.element[0].value = nextString;

                    // set the selected range up by 1 from where it started
                    self.element[0].setSelectionRange(selectionStart + 1, selectionStart + 1);
                }
            };

            /*
             * Handle cut/delete events primarily.
             */
            let handleTextareaDeleteText = function handleTextareaDeleteText(event) {

                event.stopPropagation();

                if (self.element[0].readOnly) {
                    event.preventDefault();
                    return;
                }

                var keyCode = event.keyCode || event.which;
                var nextString = self.element[0].value;
                var htmlEncodedString = htmlEntityEncode(nextString);
                self.recalculatePrimaryTextareaWidth(htmlEncodedString);
                self.recalculatePrimaryTextareaStartPosition();

                // NOTE: Add placeholder when there's no text
                if (!nextString.length) self.element.attr('placeholder', parentGlyph.TEXT_TOOL_HINT_TEXT);
            };

            self.recalculatePrimaryTextareaWidth = function recalculatePrimaryTextareaWidth(text) {

                if (!text) {

                    self.element.css('width', 'auto');

                } else {

                    var newTextWidth = calculateTextWidth(text);

                    setTextareaWidth(newTextWidth);
                }
            };

            self.recalculatePrimaryTextareaStartPosition = function recalculatePrimaryTextareaStartPosition() {

                var textareaClientRect = self.element[0].getBoundingClientRect();
                var containerElementClientRect = parentGlyph.getContainerDimensions();

                var overlapDeltaRight = textareaClientRect.right - containerElementClientRect.right;
                var overlapDeltaLeft = textareaClientRect.left - containerElementClientRect.left;
                var overlapDeltaBottom = textareaClientRect.bottom - containerElementClientRect.bottom;
                var overlapDeltaTop = textareaClientRect.top - containerElementClientRect.top;

                if (overlapDeltaLeft < 0) {

                    let newLeft = textareaClientRect.left - containerElementClientRect.left + Math.abs(overlapDeltaLeft);
                    self.element.css('left', newLeft + 'px');

                } else if (overlapDeltaRight > 0) {

                    let newLeft = textareaClientRect.left - containerElementClientRect.left - Math.abs(overlapDeltaRight);
                    self.element.css('left', newLeft + 'px');
                }

                if (overlapDeltaTop < 0) {

                    let newTop = textareaClientRect.top - containerElementClientRect.top + Math.abs(overlapDeltaTop);
                    self.element.css('top', newTop + 'px');

                } else if (overlapDeltaBottom > 0) {

                    let newTop = textareaClientRect.top - containerElementClientRect.top - Math.abs(overlapDeltaBottom);
                    self.element.css('top', newTop + 'px');
                }
            };

            let setTextareaWidth = function setTextareaWidth(width) {
                //console.log('setTextareaWidth', width);

                self.element.css('width', width + 'px');
            };

            let calculateTextWidth = function calculateTextWidth(newString) {

                testTextArea.html(newString);

                var boundingBox = testTextArea[0].getBoundingClientRect();

                return boundingBox.width;
            };

            let htmlEntityEncode = function htmlEntityEncode(value){

                var htmlEntityEncoded = '';

                for (var index in value) {

                    var char = value[index];
                    htmlEntityEncoded += parentGlyph.KEY_CODE_TO_HTML_ENTITY[char] || char;
                }

                return htmlEntityEncoded;
            };

            // create element
            self.element = angular.element('<textarea></textarea>');

            // set text
            self.element[0].value = parentGlyph.text;

            // add generic styles and attributes
            self.element.css(parentGlyph.TEXT_AREA_EDIT_CSS);
            self.element.attr(parentGlyph.TEXT_AREA_EDIT_ATTR);

            // add custom styles and attributes
            self.element.attr('readOnly', false);

            // add to dom
            parentGlyph.containerElement.append(self.element);

            // add edit handlers
            // TODO: Leave binds for now, remove later if possible
            self.element.on('paste', handleTextareaInput);
            self.element.on('keypress', handleTextareaInput);
            self.element.on('keyup', handleTextareaDeleteText);
            self.element.on('cut', handleTextareaDeleteText);

            // enter default start-state
            enterEditMode();

            return self;
        }

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

        return Text;
    }
];
