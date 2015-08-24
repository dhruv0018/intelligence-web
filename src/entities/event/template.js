/**
 * Function to compile and return a string HTML for a single event in the playlist
 *
 * @function
 * @param event {Event} - The event instance
 * @param scriptHtmlString {String} - HTML of the events from relevant script
 * @returns {String} - HTML string
 */

export default (event, scriptHtmlString, isButtonActive) => {
    return `
    <button
        class="item btn-select-event ${isButtonActive}"
        krossover-event-active
        ng-click="selectEvent();"
    >

        ${scriptHtmlString}

    </button>
    `;
};
