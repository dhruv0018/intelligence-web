const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('StatsService', StatsService);

function StatsService () {

    const service = {
        parse
    };

    function parse (statsObject) {

        // Remove extraneous properties
        delete statsObject.$promise;
        delete statsObject.$resolved;

        // Mock table names
        statsObject.gameLog.meta.tableName = 'Game Log';
        statsObject.homeTeamStats.meta.tableName = 'Home Team';
        statsObject.awayTeamStats.meta.tableName = 'Away Team';

        // Mock index
        statsObject.gameLog.meta.index = 0;
        statsObject.homeTeamStats.meta.index = 1;
        statsObject.awayTeamStats.meta.index = 2;

        // Handle score summary property
        if (statsObject.scoreSummary === null) {

            delete statsObject.scoreSummary;
        }
        else {

            statsObject.scoreSummary.meta.tableName = 'Score Summary';
            statsObject.scoreSummary.meta.index = 3;
        }

        // Convert Object to array ordered by statsObject.table.meta.index
        let statsKeys = Object.keys(statsObject);
        statsKeys.sort((a, b) => statsObject[a].meta.index > statsObject[b].meta.index);
        let statsArray = [];
        statsKeys.forEach(key => statsArray.push(statsObject[key]));

        return statsArray;
    }

    return service;
}
