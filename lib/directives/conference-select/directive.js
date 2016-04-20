import controller from './controller';
import template from './template.html';

const dependencies = [
];

/**
 * @param {}
 */
const KrossoverConferenceSelectDirective = (
) => {

    return {

        template,
        controller,
        restrict: 'E',
        scope: {
            teamId: '='
        }
    };
};

KrossoverConferenceSelectDirective.$inject = dependencies;

export default KrossoverConferenceSelectDirective;
