const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const TEAM_GENDER_IDS = {

    0: 'MALE',
    1: 'FEMALE',
    2: 'COED'
};

IntelligenceWebClient.constant('TEAM_GENDER_IDS', TEAM_GENDER_IDS);

const TEAM_GENDERS = {

    MALE: {
        name: 'Male'
    },

    FEMALE: {
        name: 'Female'
    },

    COED: {
        name: 'Coed'
    }
};

IntelligenceWebClient.constant('TEAM_GENDERS', TEAM_GENDERS);

const TEAM_TYPE_IDS = {

    0: 'SCHOLASTIC',
    1: 'RECREATIONAL',
    2: 'OTHER'
};

IntelligenceWebClient.constant('TEAM_TYPE_IDS', TEAM_TYPE_IDS);

const TEAM_TYPES = {

    SCHOLASTIC: {
        name: 'Scholastic'
    },

    RECREATIONAL: {
        name: 'Recreational'
    },

    OTHER: {
        name: 'Other'
    }
};

IntelligenceWebClient.constant('TEAM_TYPES', TEAM_TYPES);

const TEAM_AGE_LEVEL_IDS = {

    0: 'PRIMARY',
    1: 'SECONDARY',
    2: 'COLLEGIATE',
    3: 'ADULT',
    4: 'ALLAGES'
};

IntelligenceWebClient.constant('TEAM_AGE_LEVEL_IDS', TEAM_AGE_LEVEL_IDS);

const TEAM_AGE_LEVELS = {

    PRIMARY: {
        name: 'Primary'
    },

    SECONDARY: {
        name: 'Secondary'
    },

    COLLEGIATE: {
        name: 'Collegiate'
    },

    ADULT: {
        name: 'Adult'
    },

    ALLAGES: {
        name: 'All Ages'
    }
};

IntelligenceWebClient.constant('TEAM_AGE_LEVELS', TEAM_AGE_LEVELS);

const TEAM_AMATEURPRO_IDS = {

    0: 'AMATEUR',
    1: 'PRO'
};

IntelligenceWebClient.constant('TEAM_AMATEURPRO_IDS', TEAM_AMATEURPRO_IDS);

const TEAM_AMATEURPROS = {

    AMATEUR: {
        name: 'Amateur'
    },

    PRO: {
        name: 'Pro'
    }
};

IntelligenceWebClient.constant('TEAM_AMATEURPROS', TEAM_AMATEURPROS);
