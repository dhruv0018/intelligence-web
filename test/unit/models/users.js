var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('UsersResource', function(){

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should post password resend by unique', inject(['$httpBackend', 'UsersResource', function($httpBackend, UsersResource){

        $httpBackend.whenPOST(/http:\/\/.+\/users\/101\/emailRequest/).respond(200);

        UsersResource.resendEmail({
            unique: 101,
            params: null
        })

        $httpBackend.flush();

    }]));

    it('should fetch emailChange state by ID', inject(['$httpBackend', 'UsersResource', function($httpBackend, UsersResource){

        $httpBackend.whenGET(/http:\/\/.+\/users\/101\/email-change/).respond(200);

        UsersResource.emailChange({
            id: 101
        })

        $httpBackend.flush();

    }]));

    afterEach(function () {
        inject(['$httpBackend', function ($httpBackend) {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }]);
    });

});
