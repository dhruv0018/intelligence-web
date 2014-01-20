var IntelligenceWebClient = require('../app');

/* TODO: values below to be changed to IDs when the ENUM refactoring occurs */
var TAG_VARIABLE_TYPE = {

    PLAYER_DROPDOWN: 'PLAYER_DROPDOWN',
    TEAM_DROPDOWN: 'TEAM_DROPDOWN',
    TEXT: 'TEXT',
    DROPDOWN: 'DROPDOWN',
    ARENA: 'ARENA',
    PLAYER_TEAM_DROPDOWN: 'PLAYER_TEAM_DROPDOWN',

};

IntelligenceWebClient.constant('TAG_VARIABLE_TYPE', TAG_VARIABLE_TYPE);

IntelligenceWebClient.factory('TagsetsResource', [
    'config', '$resource',
    function(config, $resource) {

        var TagsetsResource = $resource(

            config.api.uri + 'tag-sets/:id', {

                id: '@id'

            }, {

                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return TagsetsResource;
    }
]);

