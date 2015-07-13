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
    initialize() {
        this.scope.selectValue = (value) => {
            console.log('on select');
            this.scope.field.currentValue = value;
            this.scope.isSelecting = false;
        };

        this.scope.onBlur = () => {
            console.log('on blur');
            this.scope.isSelecting = false;
            let currentValue = this.scope.field.currentValue;
            this.scope.selectedValue = {
                name : currentValue.name
            };
        };

        this.scope.onFocus = () => {
            console.log('on focus');
        };

        this.scope.chooseField = () => {
            this.scope.isSelecting = true;
            this.scope.selectedValue = {name: ''};
        };
    }

}

FieldController.$inject = ['$scope'];

export default FieldController;
