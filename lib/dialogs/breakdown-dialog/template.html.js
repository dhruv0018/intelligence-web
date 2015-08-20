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

            <!-- Temporarily hide sidebar on md-min screensize, once the video-player
            can render an accurate height so that the sidebar can be placed
            below the video-player via flex-direction: column-reverse -->
            <krossover-sidebar class="screen-md-min">

                <krossover-playlist></krossover-playlist>

            </krossover-sidebar>

            <video-player video="video"></video-player>

        </div>

    </md-dialog-content>

</md-dialog>

`;
