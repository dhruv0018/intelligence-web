export default `

    <div class="filter-container screen-lg-min">

        <plays-filter></plays-filter>

    </div>

    <div class="main-highlight">

        <krossover-sidebar>

            <div ng-if="isEditing">
                Try our Self-Editing tool and quickly create and tag plays for this film!
                <button class="btn btn-primary" ng-click="isEditing = true">Start Self-Editing</button>
            </div>

        </krossover-sidebar>

        <video-player>
        </video-player>

    </div>

`;
