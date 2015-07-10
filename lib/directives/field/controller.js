class FieldController {
    constructor(scope) {
        this.scope = scope;
        console.log(scope);
        //this.element = element;
        this.scope.isSelecting = false;
        this.scope.selectedValue = {
            name: ''
        };
        this.scope.backupValue = {};
        this.initialize();
    }
    // initializeInteraction() {
    //     console.log(this.element);
    // }
    initialize() {
        this.scope.selectValue = (value) => {
            console.log('on select');
            this.scope.field.currentValue = value;
            this.scope.isSelecting = false;
        };

        this.scope.onBlur = () => {
            console.log('on blur');
            this.scope.isSelecting = false;
            // let currentValue = this.scope.field.currentValue;
            // if (currentValue) {
            //     let name = angular.copy(currentValue.name);
            //     this.scope.selectedValue = {name};
            // } else {
            //     //restore what what previously there
            //     this.scope.field.currentValue = this.scope.backupValue;
            // }
        };

        this.scope.onFocus = () => {
            console.log('on focus');
            this.scope.field.reset();
            this.scope.selectedValue = {name: ''};
            // this.scope.isSelecting = true;
            // let currentValue = this.scope.field.currentValue;
            // if (currentValue) {
            //     this.scope.backupValue = currentValue;
            // }
            // this.scope.field.reset();
        };

        this.scope.onChange = () => {
        };

        this.shouldFocus = () => {
            return false;
        };
    }

}

FieldController.$inject = ['$scope'];

export default FieldController;
