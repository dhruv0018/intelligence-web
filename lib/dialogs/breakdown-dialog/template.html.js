export default `

<md-dialog
    class="breakdown-dialog"
    flex="66"
>
    <header class="dialog-header">
        <h3 class="dialog-title">Play Breakdown
        <i class="icon icon-remove pull-right" ng-click="closeDialog()"></i></h3>
    </header>

    <md-dialog-content class="dialog-content" ng-if="animationComplete">

        <div class="dialog-body">

            <!-- TODO: Temporarily hides sidebar on md-min screensize. Should use
            flex-direction: column-reverse once the video-player
            can render an accurate height in the DOM. Look into this. -->
            <krossover-sidebar class="screen-md-min">

                <krossover-playlist></krossover-playlist>

            </krossover-sidebar>

            <video-player video="video"></video-player>

        </div>

    </md-dialog-content>

</md-dialog>

`;
