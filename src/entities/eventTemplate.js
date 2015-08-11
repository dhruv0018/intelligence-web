/**
 * Function to compile and return a string HTML for a single event in the playlist
 *
 * @function
 * @param event {Event} - The event instance
 * @param scriptHtmlString {String} - HTML of the events from relevant script
 * @returns {String} - HTML string
 */

export default (event, scriptHtmlString) => {
    let domId = event.id ? 'select-event-' + event.id + '-cta' : 'select-event-new-cta';
    return `
    <li class="event">

        <button id="${domId}" class="item btn-select-event" ng-click="selectEvent(${event.id});">

            ${scriptHtmlString}

        </button>

    </li>
    `;
};
