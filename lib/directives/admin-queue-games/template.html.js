import gameTemplate from './game-template.html';

export default `

<table class="table-striped table-hover queue-list">

    <tbody>

        <tr ng-repeat="game in priority3Games | limitTo: 20">${gameTemplate}</tr>
        <tr ng-repeat="game in priority2Games | limitTo: 20">${gameTemplate}</tr>
        <tr ng-repeat="game in priority1Games | limitTo: 20">${gameTemplate}</tr>

    </tbody>

</table>
`;
