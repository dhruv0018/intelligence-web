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
    size="{{(displayValue.name.length > 0) ? (displayValue.name.length + 1) : 10}}"
    tab-index="{{field.index}}"
    ng-blur="onBlur($event)"
    ng-focus="onFocus($event)"
>

`;
