/**
 * Function to compile and return a string HTML for a single event in the playlist
 *
 * @function eventTemplate
 * @param event {Event} - The event instance
 * @param scriptHtmlString {String} - HTML of the events from relevant script
 * @returns {String} - HTML string
 */
function eventTemplate (event, scriptHtmlString) {

    return `
    <li class="event">

        <button class="item btn-select-event" ng-click="selectEvent(${event.id});">

            ${scriptHtmlString}

        </button>

    </li>
    `;
}

/**
 * @module eventTemplate
 * @exports eventTemplate
 */
export default eventTemplate;
