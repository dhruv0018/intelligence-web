
/* Text - extends Glyph */

TextValue.$inject = [
    'GlyphValue',
    '$window',
    'TelestrationsEventEmitter',
    'TELESTRATION_COLORS',
    'TELESTRATION_EVENTS'
];

function TextValue(
    Glyph,
    $window,
    TelestrationsEventEmitter,
    TELESTRATION_COLORS,
    TELESTRATION_EVENTS
) {

    var body;
    var testTextArea; // Singleton object used for all text tools
    var containerBoundingBox;

    function Text(type, options, containerElement, mode) {

        Glyph.call(this, type, options, containerElement);

        body = angular.element(document.getElementsByTagName('body')[0]);

        this.TEXT_AREA_EDIT_CSS.color = this.color;
        this.TEXT_AREA_DISPLAY_CSS.color = this.color;

        this.primaryTextarea = new PrimaryTextarea(this, mode);
        if (!testTextArea) createTestTextarea.call(this);

        this.addEditHandlers();
    }
    angular.inheritPrototype(Text, Glyph);

    Text.prototype.KEY_CODE_TO_HTML_ENTITY = {
        ' ': '&nbsp;'
    };

    Text.prototype.HINT_TEXT = 'Enter text here';
    Text.prototype.HELPER_TEXT = 'Double-click to edit text';

    Text.prototype.TEXT_AREA_BASE_CSS = {
        'margin': '0px',
        'padding': '20px 10px',
        'letter-spacing': '0.5px',
        'font-family': 'Helvetica',
        'font-size': '22px',
        'font-weight': '500',
        'line-height': '0px',
        'overflow': 'hidden',
        'min-width': '60px',
        'opacity': '1',
        'z-index': '1',
        'border-radius': '2px',
        'position': 'absolute',
        // remove inherent styles
        '-webkit-box-shadow':'none',
        '-moz-box-shadow': 'none',
        'box-shadow': 'none',
        'outline': 'none',
        'resize': 'none',
        'box-sizing': 'border-box'
    };

    Text.prototype.TEXT_AREA_EDIT_CSS = {
        'background-color': TELESTRATION_COLORS.ACTIVE_GRAY(0.9),
        'border': '1px solid ' + TELESTRATION_COLORS.HIGHLIGHT_BLUE(),
        'cursor': 'text'
    };

    Text.prototype.TEXT_AREA_DISPLAY_CSS = {
        'background-color': TELESTRATION_COLORS.ACTIVE_GRAY(0.7),
        'border': 'none',
        'cursor': 'pointer'
    };

    Text.prototype.TEXT_AREA_DISPLAY_SELECTED_CSS = {
        'border': '1px solid ' + TELESTRATION_COLORS.HIGHLIGHT_BLUE()
    };

    Text.prototype.TEXT_AREA_EDIT_ATTR = {
        'placeholder': Text.prototype.HINT_TEXT,
        'title': ''
    };

    Text.prototype.TEXT_AREA_DISPLAY_ATTR = {
        'placeholder': Text.prototype.HINT_TEXT,
        'title': Text.prototype.HELPER_TEXT
    };

    Text.prototype.TEXT_AREA_DISPLAY_SELECTED_ATTR = {
        'placeholder': Text.prototype.HINT_TEXT,
        'title': Text.prototype.HELPER_TEXT
    };

    Text.prototype.KEY_MAP = {
        'DELETE': 8,
        'ENTER': 13
    };

    Text.prototype.MAX_LENGTH = 70;


    Text.prototype.addEditHandlers = function addEditHandlers() {

        this.primaryTextarea.element.on('click', (event) => {

            this.onClickHandler(event);
        });
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
        self.primaryTextarea.recalculatePrimaryTextareaWidth(self.text);
        self.primaryTextarea.recalculatePrimaryTextareaStartPosition();
    };

    Text.prototype.destroy = function() {

        this.removeListeners();
        this.primaryTextarea.element.remove();
        Glyph.prototype.destroy.call(this);
    };

    Text.prototype.show = function show() {

        if (this.primaryTextarea) this.primaryTextarea.element.css('display', 'block');
    };

    Text.prototype.hide = function hide() {

        if (this.primaryTextarea) this.primaryTextarea.element.css('display', 'none');
    };

    Text.prototype.removeListeners = function removeListeners() {

        this.primaryTextarea.removeListeners();
    };


    /* Private Functions */


    // creation

    function PrimaryTextarea(parentGlyph, mode) {

        var self = this;

        /* State Switching (edit-text and display modes) */

        /*
         * Changes styles and handlers for edit-text mode.
         * Text Input Handlers are already set.
         */
        function enterEditMode(event) {

            self.element[0].focus();

            // remove this handler as primaryTextArea is already in this state
            self.element.off('dblclick', enterEditMode);
            $window.removeEventListener('click', onDisplaySelectedModeBlur);

            // remove any other handlers
            self.element.off('mousedown', dragStart);
            TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.DISABLE_DRAW);

            self.element.off('mousedown', stopEventPropagation);
            self.element.on('mousedown', stopEventPropagation);

            // add blur event (to handle exiting this state)
            self.element.off('blur', onEditModeBlur);
            self.element.on('blur', onEditModeBlur);

            // add style & properties
            self.element.css(parentGlyph.TEXT_AREA_EDIT_CSS);
            self.element.attr('readOnly', false);
        }

        /*
         * Changes styles and handlers for display-text mode.
         * Text Input Handlers are already set.
         */
        function enterDisplayMode(event) {

            self.element.off('mousedown', enterDisplaySelectedMode);
            self.element.on('mousedown', enterDisplaySelectedMode);

            self.element.off('mousedown', dragStart);
            self.element.on('mousedown', dragStart);

            // add style & properties
            self.element.css(parentGlyph.TEXT_AREA_DISPLAY_CSS);
            self.element.attr(parentGlyph.TEXT_AREA_DISPLAY_ATTR);
            self.element.attr('readOnly', true);
        }


        function enterDisplaySelectedMode() {

            TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.DISABLE_DRAW);

            self.element.off('mousedown', enterDisplaySelectedMode);

            $window.removeEventListener('click', onDisplaySelectedModeBlur);
            $window.addEventListener('click', onDisplaySelectedModeBlur);

            self.element.off('mousedown', dragStart);
            self.element.on('mousedown', dragStart);

            // add textarea display-mode event handlers
            self.element.off('dblclick', enterEditMode);
            self.element.on('dblclick', enterEditMode);

            self.element.css(parentGlyph.TEXT_AREA_DISPLAY_SELECTED_CSS);
            self.element.attr(parentGlyph.TEXT_AREA_DISPLAY_SELECTED_ATTR);
        }

        function onDisplaySelectedModeBlur(event) {

            $window.removeEventListener('click', onDisplaySelectedModeBlur);

            enterDisplayMode(event);

            TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.ENABLE_DRAW);
        }

        /*
         * Handles exiting edit-state and entering display-state
         */
        function onEditModeBlur(event) {

            self.element.off('blur', onEditModeBlur);

            enterDisplayMode(event);

            // save text area properties
            storeTextAreaProperties();

            TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.ENABLE_DRAW);
        }

        function storeTextAreaProperties() {

            containerBoundingBox = parentGlyph.getContainerDimensions();
            let boundingBox = self.element[0].getBoundingClientRect();

            let newLeft = boundingBox.left - containerBoundingBox.left;
            let newTop = boundingBox.top - containerBoundingBox.top;
            let newRight = boundingBox.right - containerBoundingBox.right;
            let newBottom = boundingBox.bottom - containerBoundingBox.bottom;

            parentGlyph.updateStartPointFromPixels(newLeft, newTop);
            parentGlyph.updateEndPointFromPixels(newRight, newBottom);

            let newText = self.element[0].value;

            if (newText !== parentGlyph.text) {

                parentGlyph.text = newText;
                parentGlyph.onTextChangedHandler();
            }
        }

        function stopEventPropagation(event) {

            event.stopPropagation();
        }

        function dragStart(event) {

            event.stopPropagation();

            containerBoundingBox = parentGlyph.getContainerDimensions();
            self.element.startPosition = {x: event.offsetX, y: event.offsetY};

            $window.removeEventListener('mousemove', dragMove);
            $window.addEventListener('mousemove', dragMove);

            // listen to turn off dragging
            $window.removeEventListener('mouseup', dragEnd);
            $window.addEventListener('mouseup', dragEnd);

            parentGlyph.onDragStartHandler();
        }

        function dragMove(event) {

            event.preventDefault();

            var left = event.clientX - containerBoundingBox.left - self.element.startPosition.x;
            var top = event.clientY - containerBoundingBox.top - self.element.startPosition.y;

            self.element.css({
                'left': left + 'px',
                'top': top + 'px'
            });
        }

        function dragEnd(event) {

            event.preventDefault();

            // ensure text is within constraints
            self.recalculatePrimaryTextareaStartPosition();

            // save text area properties
            storeTextAreaProperties();

            $window.removeEventListener('mousedown', dragStart);
            $window.removeEventListener('mousemove', dragMove);
            $window.removeEventListener('mouseup', dragEnd);

            parentGlyph.onDragEndHandler();
        }


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
        }

        /*
         * Handle cut/delete events primarily.
         */
        function handleTextareaDeleteText(event) {

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
            if (!nextString.length) self.element.attr('placeholder', parentGlyph.HINT_TEXT);
        }

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

        function setTextareaWidth(width) {

            self.element.css('width', width + 'px');
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
                htmlEntityEncoded += parentGlyph.KEY_CODE_TO_HTML_ENTITY[char] || char;
            }

            return htmlEntityEncoded;
        }

        self.removeListeners = function removeListeners() {

            $window.removeEventListener('mousedown', dragStart);
            $window.removeEventListener('mousemove', dragMove);
            $window.removeEventListener('mouseup', dragEnd);
            self.element.off('dblclick', enterEditMode);
            self.element.off('mousedown', dragStart);
        };

        // create element
        self.element = angular.element('<textarea></textarea>');

        // set text
        self.element[0].value = parentGlyph.text;

        // add generic styles and attributes
        self.element.css(parentGlyph.TEXT_AREA_BASE_CSS);
        self.element.css(parentGlyph.TEXT_AREA_EDIT_CSS);
        self.element.attr(parentGlyph.TEXT_AREA_EDIT_ATTR);

        // set color
        self.element.css('color', parentGlyph.color);

        // add custom styles and attributes
        self.element.attr('readOnly', false);

        // add to dom
        parentGlyph.containerElement.append(self.element);

        // add edit handlers
        self.element.on('paste', handleTextareaInput);
        self.element.on('keypress', handleTextareaInput);
        self.element.on('keyup', handleTextareaDeleteText);
        self.element.on('cut', handleTextareaDeleteText);

        // enter default start-state
        if (mode !== 'display') enterEditMode();
        else enterDisplayMode();

        return self;
    }

    /*
     * This is a div that is used a width 'calculation' area. It has the same styles
     * as the primaryTextarea edit-mode, so that the width will be completely accurate.
     * The reason a div is used as because there is no way of getting the width of lines of text
     * from the textarea. The div is hidden off screen so it's not visible to the user.
     */
    var createTestTextarea = function createTestTextarea() {

        var self = this;

        testTextArea = angular.element('<div class="telestrations testTextArea"></div>');

        // add to dom
        body.append(testTextArea);

        // add generic styles and attributes
        testTextArea.css(self.TEXT_AREA_BASE_CSS);
        testTextArea.css(self.TEXT_AREA_EDIT_CSS);

        // add custom styles and attributes
        testTextArea.css({'top': '-9999px'});
    };

    return Text;
}

module.exports = TextValue;
