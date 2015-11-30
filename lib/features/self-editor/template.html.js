export default `

    <div class="filter-container screen-lg-min">

        <plays-filter></plays-filter>

    </div>

    <div class="main-highlight">

        <krossover-sidebar>

            <div class="breakdown-sidebar-empty-state" ng-hide="indexingMode">
                Try our Self-Editing tool and quickly create and tag plays for this film!
            </div>

            <self-editing-playlist ng-show="indexingMode" indexing-mode="indexingMode"></self-editing-playlist>

            <div class="breakdown-sidebar-footer">
                <button class="btn btn-primary" ng-click="indexingMode = true">Start Self-Editing</button>
            </div>
        </krossover-sidebar>

        <video-player>
        </video-player>

    </div>

`;
