export default `
        <md-dialog>
            <md-dialog-content aria-label="Confirmation Send to QA" class="modal-content">

                <div class="send-to-qa">

                    <header class="modal-header">

                        <span class="modal-title">
                            Confirmation:  Send to QA
                        </span>

                    </header>

                    <div class="modal-body">
                        <p>
                            Are you sure you want to send this game to QA?
                        </p>
                        <p ng-if="showFlags">
                            Please be sure to
                            <a ng-href="{{flagsUrl}}" target="_blank"> check for flags </a>
                            before you submit.
                        </p>
                    </div>

                    <footer class="modal-footer">

                        <button ng-disabled="isSaving" ng-click="cancel()" class="cancel">
                            Cancel
                        </button>
                        <button ng-disabled="isSaving" ng-click="close();" class="confirm">
                            <span ng-show="!isSaving">Send To QA</span>
                            <span ng-show="isSaving" class="icon icon-spinner spinner"></span>
                        </button>

                    </footer>

                </div>

            </md-dialog-content>
        </<md-dialog>
`;
