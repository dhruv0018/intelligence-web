import FieldsTemplate from '../template';

/**
 * FIXME: Use better pattern to pass in multiple class names
 */
const className = 'user-fields btn-select-event';
const fields = 'event.userFields';

const UserFieldsTemplate = new FieldsTemplate(className, fields).template;

export default UserFieldsTemplate;
