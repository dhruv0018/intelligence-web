var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('button', function(){

    let elm;
    let scope;

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(inject(['$rootScope', '$compile',
    function($rootScope, $compile){

        scope = $rootScope.$new();

        elm = angular.element('<button disabled=false>test</button>');
        $compile(elm)(scope);
        scope.$digest();
    }]));

    it('should have disabled state', inject([function(){

        scope.$broadcast('$stateChangeStart');
        expect(elm.prop('disabled')).to.be.true;
        scope.$digest();

    }]));

    afterEach(function(){
        elm.remove();
    });
});

describe('buttonAddNew', function(){

    let elm;
    let scope;

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(inject(['$rootScope', '$compile',
    function($rootScope, $compile){

        scope = $rootScope.$new();

        elm = angular.element('<button-add-new data-elem-id="add-new-school-cta">Add a new school</button-add-new>');
        $compile(elm)(scope);
        scope.$digest();
    }]));

    it('should have elemId', inject([function(){

        expect(scope.elemId).to.equal('add-new-school-cta');

    }]));

    afterEach(function(){
        elm.remove();
    });
});
