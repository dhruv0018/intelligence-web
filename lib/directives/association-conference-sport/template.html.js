export default `

    <div class="association-conference-sport" ng-class="{'isDefunct': conferenceSport.isDefunct}">
        <span>{{conferenceSport.gender}} {{sports[conferenceSport.sportId].name}}</span>

        <div>
            <i class="icon icon-ban" ng-show="!conferenceSport.isDefunct" ng-click="toggleDefunct()" tooltip="Make Defunct" tooltip-placement="top"></i>
            <i class="icon icon-refresh" ng-show="conferenceSport.isDefunct" ng-click="toggleDefunct()" tooltip="Make Active" tooltip-placement="top"></i>
            <i class="icon icon-trash-o" ng-click="deleteConferenceSport()"></i>
        </div>
    </div>

`;
