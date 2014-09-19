var AdminTeam = function AdminTeam() {

    var self = this;

    self.plansAndPackages = {
        activePlans: element.all(by.repeater('plan in filteredPlans')),
        activePackages: element.all(by.repeater('activePackage in filteredPackages')),
        addPlanButton: element(by.class('add-plan-button')),
        addPackageButton: element(by.class('add-package-button')),
        editPlan: element(by.class('edit-plan')),
        editPackage: element(by.class('edit-package')),
        removePlan: element(by.class('remove-plan')),
        removePackage: element(by.class('remove-package')),

        get: function get(teamId) {

            if (!config || !config.base_url) throw new Error('config.base_url not set');

            teamId = teamId || 1;

            browser.get(config.base_url + '/team/' + teamId).then(function(){
                element(by.class('plans-and-packages')).click();
            });

            
        },

        isInValidState: function isInValidState() {

            function exclusiveOr(P, Q) {
                return (P || Q) && !(P && Q);
            }
            var validPlan = //add plan button should be hidden if there is an active plan
                            exclusiveOr(self.plansAndPackages.activePlans.count(), self.addPlanButton.isDisplayed()) &&
                            //if active plan make sure edit and remove buttons are displayed, if not make sure they are hidden
                            ( self.plansAndPackages.activePlans.count() ? self.editPlan.isDisplayed() && self.removePlan.isDisplayed() : !self.editPlan.isDisplayed() && !self.removePlan.isDisplayed());

            var validPackage = //add package button should be hidden if there is an active package
                            exclusiveOr(self.plansAndPackages.activePackages.count(), self.addPackageButton.isDisplayed()) &&
                            //if active package make sure edit and remove buttons are displayed, if not make sure they are hidden
                            ( self.plansAndPackages.activePackages.count() ? self.editPackage.isDisplayed() && self.removePackage.isDisplayed() : !self.editPackage.isDisplayed() && !self.removePackage.isDisplayed());
        }
    };
};