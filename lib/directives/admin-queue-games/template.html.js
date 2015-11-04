import gameTemplate from './game-template.html';

export default `

<table class="queue-list">

    <tbody>

        <tr
            ng-repeat="game in priority3Games | limitTo: 20"
            class="queue-list__highest-priority"
        >${gameTemplate}</tr>
        <tr
            ng-repeat="game in priority2Games | limitTo: 20"
            class="queue-list__high-priority"
        >${gameTemplate}</tr>
        <tr
            ng-repeat="game in priority1Games | limitTo: 20"
            class="queue-list__normal-priority"
        >${gameTemplate}</tr>

    </tbody>

</table>
`;
