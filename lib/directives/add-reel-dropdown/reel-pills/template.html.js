export default `

<div class="reel-pills">
    <span class="reel-pill" ng-repeat="reel in reels">{{reel.name}}<i class="icon icon-remove" ng-click="removeReel(reel)"></i></span>
</div>
`;
