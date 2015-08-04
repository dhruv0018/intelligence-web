export default `

<input
    type="button"
    value="{{displayValue.name}}"
    id="field-{{field.index}}"
    class="arena-field mousetrap"
    tab-index="{{field.index}}"
    ng-model="displayValue"
    ng-blur="onBlur($event)"
    ng-focus="onFocus($event)"
>

`;
