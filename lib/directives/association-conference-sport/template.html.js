export default `

    <div class="association-conference-sport">
        <span>{{conferenceSport.gender}} {{sports[conferenceSport.sportId].name}}</span>

        <div>
            <i class="icon icon-ban" ng-show="!conferenceSport.isDefunct" ng-click="toggleDefunct()"></i>
            <i class="icon icon-refresh" ng-show="conferenceSport.isDefunct" ng-click="toggleDefunct()"></i>
            <i class="icon icon-trash-o" ng-click="deleteConferenceSport()"></i>
        </div>
    </div>

`;
