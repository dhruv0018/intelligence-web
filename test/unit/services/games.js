var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('GamesFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(GamesFactory) {

        expect(GamesFactory).to.exist;
    }));

    it('should have public API', inject(function(GamesFactory) {

        expect(GamesFactory).to.respondTo('getStatus');
        expect(GamesFactory).to.respondTo('currentAssignment');
        expect(GamesFactory).to.respondTo('userAssignment');
        expect(GamesFactory).to.respondTo('startAssignment');
        expect(GamesFactory).to.respondTo('isAssignmentStarted');
        expect(GamesFactory).to.respondTo('isAssignmentCompleted');
        expect(GamesFactory).to.respondTo('areIndexerAssignmentsCompleted');
        expect(GamesFactory).to.respondTo('areQaAssignmentsCompleted');
        expect(GamesFactory).to.respondTo('isAssignedToUser');
        expect(GamesFactory).to.respondTo('isAssignedToIndexer');
        expect(GamesFactory).to.respondTo('isAssignedToQa');
        expect(GamesFactory).to.respondTo('hasAssignment');
        expect(GamesFactory).to.respondTo('hasIndexerAssignment');
        expect(GamesFactory).to.respondTo('hasQaAssignment');
        expect(GamesFactory).to.respondTo('canBeAssigned');
        expect(GamesFactory).to.respondTo('canBeAssignedToIndexer');
        expect(GamesFactory).to.respondTo('canBeAssignedToQa');
        expect(GamesFactory).to.respondTo('canBeStarted');
        expect(GamesFactory).to.respondTo('canBeStartedByIndexer');
        expect(GamesFactory).to.respondTo('canBeStartedByQa');
        expect(GamesFactory).to.respondTo('assignToIndexer');
        expect(GamesFactory).to.respondTo('assignToQa');
    }));
});

