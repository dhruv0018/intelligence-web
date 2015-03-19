
/* Textbox - extends Glyph */

module.exports = [
    'GlyphValue', '$window',
    function(Glyph, $window) {

        var body = angular.element(document.getElementsByTagName('body'));
        var testTextArea; // Singleton object used for all text tools

        function TextBox(type, options, containerElement) {

            var newPrimaryTextarea = createPrimaryTextarea.call(this, event);
            if (!testTextArea) createTestTextarea(this, event);
            enterTextareaEditMode.call(newPrimaryTextarea); // default start-state

            Glyph.call(this, type, options, containerElement);
            this.editMode = true;
        }
        angular.inheritPrototype(TextBox, Glyph);

        TextBox.prototype.EDITABLE = false;
        TextBox.prototype.MOVEABLE = true;
        TextBox.prototype.TEXT_TOOL_HINT_TEXT = 'Enter text here';

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
            'placeholder': self.TEXT_TOOL_HINT_TEXT,
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

            if (verticesInPixels.length !== 2) throw new Error('TextBox render function requires 2 vertices and ' + verticesInPixels.length + ' given');

            var startPoint = verticesInPixels[0];
            var endPoint = verticesInPixels[1];

            var width = endPoint.x - startPoint.x;
            var height = endPoint.y - startPoint.y;
        };

        TextBox.prototype.destroy = function() {
            Glyph.prototype.destroy.call(this);
        };


        /* Private Functions */


        // creation

        var createPrimaryTextarea = function createPrimaryTextarea() {

            var self = this;

            // create elements
            var primaryTextarea = angular.element('<textarea></textarea>');

            // add generic styles and attributes
            primaryTextarea.css(self.TEXT_AREA_EDIT_CSS);
            primaryTextarea.attr(self.TEXT_AREA_EDIT_ATTR);

            // add custom styles and attributes
            primaryTextarea.attr('readonly', false);
            primaryTextarea.css({'left': event.offsetX + 'px', 'top': event.offsetY + 'px'});

            // add to dom
            self.containerElement.append(primaryTextarea);

            // add edit handlers
            primaryTextarea.on('paste', handleTextBoxInput.bind(primaryTextarea));
            primaryTextarea.on('keypress', handleTextBoxInput.bind(primaryTextarea));
            primaryTextarea.on('keyup', handleKeyDown.bind(primaryTextarea));
            primaryTextarea.on('cut', handleKeyDown.bind(primaryTextarea));

            recalculateTextareaPosition.call(primaryTextarea);

            // window.on('resize', function() {
            //     recalculateTextareaWidth.call(primaryTextarea, primaryTextarea[0].value);
            // });

            return primaryTextarea;
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

        // Handling text input (while in edit-state).

        function handleTextBoxInput(event) {

            var self = this;

            var primaryTextarea = self.primaryTextarea;

            //console.log('handleTextBoxInput', primaryTextarea, event);
            if (primaryTextarea[0].readonly) {
                event.preventDefault();
                return;
            }


            var numChars = primaryTextarea[0].textLength;
            var keyCode = event.keyCode || event.which;
            var keyCodeString = String.fromCharCode(keyCode);

            // Prevent Enter until text-box height expansion is allowed.
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

                // NOTE: Place holder affects text-area inner size, thus remove it
                // when there is entered text into the textarea
                if (nextString.length) primaryTextarea.removeAttr('placeholder');

                recalculateTextareaWidth.call(primaryTextarea, htmlEncodedString);
            }
        }

        return TextBox;
    }
];


// var root = angular.element(document.getElementsByClassName('root'));
// var containerElement = angular.element(document.getElementsByClassName('context-area'));
// var body = angular.element(document.getElementsByTagName('body'));
// var window = angular.element(window);

// var maxTextWidth = root[0].getBoundingClientRect().width;

// var self.TEXT_TOOL_HINT_TEXT = 'Enter text here';

// var self.TEXT_AREA_DISPLAY_CSS = {
//     'margin': '0px',
//     'padding': '1vw 1vw 0 1vw',
//     'letter-spacing': '0.5px',
//     'font-family': 'Helvetica',
//     'font-size': '2vw',
//     'line-height': '1vw',
//     'color': '#F3F313',
//     'overflow': 'hidden',
//     'opacity': '1',
//     'z-index': '1',
//     'border': '1px solid #5394ec',
//     'border-radius': '2px',
//     'autofocus': true,
//     'position': 'absolute',
//     'background': 'transparent',
//     'max-length': '140',
//     // remove inherent styles
//     '-webkit-box-shadow':'none',
//     '-moz-box-shadow': 'none',
//     'box-shadow': 'none',
//     'outline': 'none',
//     'resize': 'none',
//     'box-sizing': 'border-box'
// };

// var textareaDisplayCSS = {
//     'margin': '0px',
//     'padding': '1vw 1vw 0 1vw',
//     'letter-spacing': '0.5px',
//     'font-family': 'Helvetica',
//     'font-size': '2vw',
//     'line-height': '1vw',
//     'color': '#F3F313',
//     'overflow': 'none',
//     'opacity': '1',
//     'z-index': '1',
//     'border': 'none',
//     'position': 'absolute',
//     'background': 'transparent',
//     'max-length': '140',
//     // remove inherent styles
//     '-webkit-box-shadow':'none',
//     '-moz-box-shadow': 'none',
//     'box-shadow': 'none',
//     'outline': 'none',
//     'resize': 'none',
//     'box-sizing': 'border-box'
// };



// function handleTextBoxInput(event) {

//     var primaryTextarea = this.primaryTextarea;

//     //console.log('handleTextBoxInput', primaryTextarea, event);
//     if (primaryTextarea[0].readonly) {
//         event.preventDefault();
//         return;
//     }


//     var numChars = primaryTextarea[0].textLength;
//     var keyCode = event.keyCode || event.which;
//     var keyCodeString = String.fromCharCode(keyCode);

//     // Prevent Enter until text-box height expansion is allowed.
//     if (keyCode === self.KEY_MAP.ENTER) {

//        event.preventDefault();

//     } else {

//         var newestValue = '';

//         if (event.type === 'paste') {
//             newestValue = event.clipboardData.getData('text/plain');
//         } else if (keyCodeString) {
//             newestValue = keyCodeString;
//         }

//         var nextString = primaryTextarea[0].value + newestValue;
//         var htmlEncodedString = htmlEntityEncode(nextString);
//         var nextWidth = calculateTextWidth.call(primaryTextarea, htmlEncodedString);

//         // prevent input if next width would be too wide for container
//         if (Math.ceil(nextWidth) > self.getMaxWidth()) {

//             event.preventDefault();
//         }

//         // NOTE: Place holder affects text-area inner size, thus remove it
//         // when there is entered text into the textarea
//         if (nextString.length) primaryTextarea.removeAttr('placeholder');

//         recalculateTextareaWidth.call(primaryTextarea, htmlEncodedString);
//     }
// }

function handleKeyDown(event) {

    var primaryTextarea = this.primaryTextarea;

    if (primaryTextarea[0].readonly) {

        event.preventDefault();
        return;
    }

    //console.log('handleKeyDown', primaryTextarea, event);
    var keyCode = event.keyCode || event.which;
    var nextString = primaryTextarea[0].value;
    var htmlEncodedString = htmlEntityEncode(nextString);
    recalculateTextareaWidth.call(primaryTextarea, htmlEncodedString);
    recalculateTextareaPosition.call(primaryTextarea);

    // NOTE: Add placeholder when there's no text
    if (!nextString.length) primaryTextarea.attr('placeholder', self.TEXT_TOOL_HINT_TEXT);
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

    var primaryTextarea = this.primaryTextarea;

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

/****************************
/* Handle State Interaction *
*****************************/

// var createPrimaryTextarea = function createPrimaryTextarea(event) {

//     // create elements
//     var primaryTextarea = angular.element('<textarea></textarea>');

//     // add generic styles and attributes
//     primaryTextarea.css(self.TEXT_AREA_EDIT_CSS);
//     primaryTextarea.attr(self.TEXT_AREA_EDIT_ATTR);

//     // add custom styles and attributes
//     primaryTextarea.attr('readonly', false);
//     primaryTextarea.css({'left': event.offsetX + 'px', 'top': event.offsetY + 'px'});

//     // add to dom
//     self.containerElement.append(primaryTextarea);

//     // add edit handlers
//     primaryTextarea.on('paste', handleTextBoxInput.bind(primaryTextarea));
//     primaryTextarea.on('keypress', handleTextBoxInput.bind(primaryTextarea));
//     primaryTextarea.on('keyup', handleKeyDown.bind(primaryTextarea));
//     primaryTextarea.on('cut', handleKeyDown.bind(primaryTextarea));

//     recalculateTextareaPosition.call(primaryTextarea);

//     // window.on('resize', function() {
//     //     recalculateTextareaWidth.call(primaryTextarea, primaryTextarea[0].value);
//     // });

//     return primaryTextarea;
// };

// var createTestTextarea = function createTestTextarea(event) {

//     testTextArea = angular.element('<div></div>');

//     // add to dom
//     body.append(testTextArea);

//     // add generic styles and attributes
//     testTextArea.css(self.TEXT_AREA_DISPLAY_CSS);

//     // add custom styles and attributes
//     testTextArea.css({'top': '-9999px'});
// }

var handleTextBoxClick = function handleTextBoxClick(event) {

    // console.log('handleTextBoxClick', event);

    event.stopPropagation();
};

var telestrationGlyphBlurredEventInfo = {
    detail: {},
    bubbles: true,
    cancelable: true
};
var telestrationGlyphBlurredEvent = new CustomEvent('telestration:glyphBlurred', telestrationGlyphBlurredEventInfo);


var boundGlyphBlurred;
var boundEnterTextareaDisplayMode;
var boundEnterTextareaEditMode;
var boundAddDraggable;
var boundDragmove;

var glyphBlurred = function glyphBlurred(event) {

    var primaryTextarea = this.primaryTextarea;

    primaryTextarea.off('blur', boundGlyphBlurred);
    primaryTextarea.off('mousedown', boundAddDraggable);
    primaryTextarea.off('mousemove', boundDragmove);

    boundEnterTextareaDisplayMode(event);

    primaryTextarea[0].dispatchEvent(telestrationGlyphBlurredEvent);
};

var addDraggable = function addDraggable(event) {

    var primaryTextarea = this.primaryTextarea;

    console.log('addDraggable', event);
    boundDragmove = dragmove.bind(primaryTextarea);

    self.containerElement.on('mousemove', boundDragmove);
};

var dragmove = function dragmove(event) {

    var primaryTextarea = this.primaryTextarea;

    console.log('dragmove', event);
    primaryTextarea.css({
        'left': event.offsetX + 'px',
        'top': event.offsetY + 'px'
    });
};

var enterTextareaDisplayMode = function enterTextareaDisplayMode(event) {

    var primaryTextarea = this.primaryTextarea;

    console.log('enterTextareaDisplayMode', primaryTextarea, event);
    if (event) {
        event.cancelBubble = true;
        event.stopImmediatePropagation();
    }

    boundEnterTextareaEditMode = enterTextareaEditMode.bind(primaryTextarea);
    boundAddDraggable = addDraggable.bind(primaryTextarea);

    // Turn on Double click to edit-mode for this textarea.
    primaryTextarea.on('click', handleTextBoxClick);
    primaryTextarea.on('dblclick', boundEnterTextareaEditMode);
    primaryTextarea.on('mousedown', boundAddDraggable);
    self.containerElement.on('mouseup', function() {
        self.containerElement.off('mousemove', boundDragmove);
    });

    // add style & properties
    primaryTextarea.css(textareaDisplayCSS);
    primaryTextarea.attr('readonly', true);
};

/*
 * Text Input Handlers are already set. This just adds
 * the appropriate styles, and handles the element change-state
 * (i.e. toDisplayMode) based on click interactions
 */
var enterTextareaEditMode = function enterTextareaEditMode(event) {

    var primaryTextarea = this.primaryTextarea;

    //console.log('enterTextareaDisplayMode', primaryTextarea, event);
    if (event) event.stopPropagation();

    primaryTextarea[0].focus();

    boundEnterTextareaDisplayMode = enterTextareaDisplayMode.bind(primaryTextarea);
    boundGlyphBlurred = glyphBlurred.bind(primaryTextarea);

    // already in this state, remove the handler to get in this state.
    primaryTextarea.off('dblclick', boundEnterTextareaEditMode);

    // Turn on click handlers to exit edit-mode and put text
    primaryTextarea.on('blur', boundGlyphBlurred);

    // add style & properties
    primaryTextarea.css(self.TEXT_AREA_DISPLAY_CSS);
    primaryTextarea.attr('readonly', false);
};

// var handleClick = function handleClick(event) {
//     // console.log('handleClick', event);
//     var newPrimaryTextarea = createPrimaryTextarea(event);
//     if (!testTextArea) createTestTextarea(event);
//     enterTextareaEditMode.call(newPrimaryTextarea); // default start
// };

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

