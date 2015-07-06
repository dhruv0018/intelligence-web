class FieldController {
    constructor(scope) {
        this.scope = scope;
        this.scope.isSelecting = false;
        this.scope.selectedValue = scope.field.value;
        this.initScope();
    }
    initScope() {
        this.scope.selectValue = (value) => {
            this.scope.field.currentValue = value;
            let currentValue = this.scope.field.currentValue;
            this.scope.isSelecting = false;
        };

        this.scope.onBlur = () => {
            //console.log('on blur firing');
            this.scope.isSelecting = false;
        };

        this.scope.onFocus= () => {
            //console.log('on focus');
        };

        this.scope.onChange= () => {
            //console.log('firing on change');
            //scope.event.activeEventVariableIndex = scope.field.order + 1;
            //console.log(scope.event.activeEventVariableIndex);
        };

        this.shouldFocus = () => {
            //console.log('inside shouldFocus');
            //console.log(scope.event.activeEventVariableIndex == scope.field.order);
            //return scope.event.activeEventVariableIndex == scope.field.order;
            return true;
        };
    }

}
FieldController.$inject = ['$scope'];

export default FieldController;
