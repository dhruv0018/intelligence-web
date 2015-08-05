export default `

<input
    type="button"
    value="{{displayValue.name}}"
    id="field-{{field.index}}"
    class="arena-field mousetrap"
    ng-class="{
        'field-valid': field.valid,
        'field-invalid': !field.valid,
        'field-required': field.isRequired,
        'field-optional': !field.isRequired
    }"
    tab-index="{{field.index}}"
    ng-model="displayValue"
    ng-blur="onBlur($event)"
    ng-focus="onFocus($event)"
>

`;
