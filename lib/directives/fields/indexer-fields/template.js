import FieldsTemplate from '../template';

const className = 'indexer-fields';
const fields = 'event.indexerFields';

const IndexerFieldsTemplate = new FieldsTemplate(className, fields).template;

export default IndexerFieldsTemplate;
