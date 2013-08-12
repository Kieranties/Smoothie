/**
 * User: Kieranties
 * Date: 12/08/13
 */

describe('The rtm module', function(){
    var Rtm, Api, Chrome, $httpBackend, $rootScope,
        setChromeSpy;


    beforeEach(function(){
        module('rtm', 'chrome');
        inject(function($injector){
            Rtm = $injector.get('Rtm');
            Api = $injector.get('Api');
            Chrome = $injector.get('Chrome');
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
        });

        setChromeSpy = function(data){
            spyOn(Chrome.storage.local, 'get')
                .andCallFake(function(key, callback){
                    callback(data);
                })
        }

    })

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

    it('should expose the API parameters', function(){
        expect(Api).not.toBeNull();
        expect(Api.url).toBeDefined();
        expect(Api.authUrl).toBeDefined();
        expect(Api.permissions).toBeDefined();
        expect(Api.format).toBeDefined();
        expect(Api.key).toBeDefined();
        expect(Api.secret).toBeDefined();
    })

    describe('when getting', function(){
        it('should return a promise', function(){
            setChromeSpy();
            $httpBackend.whenGET(/.*/).respond({});
            $httpBackend.expect('GET',/.*/);
            expect(Rtm.getData).toBeDefined();
            expect(Rtm.getData().then).toBeDefined();
            $rootScope.$apply();
            $httpBackend.flush();
        })

        it('should request the Api.url', function(){
            setChromeSpy();
            var regex = new RegExp(Api.url + '.*');
            $httpBackend.whenGET(/.*/).respond({});
            $httpBackend.expect('GET',regex);
            Rtm.getData();
            $rootScope.$apply();
            $httpBackend.flush();
        })

        it('should set "format" based on Api.format', function(){
            setChromeSpy();
            var regex = new RegExp(Api.url + '.*format=' + Api.format + '.*');
            $httpBackend.whenGET(/.*/).respond({});
            $httpBackend.expect('GET', regex);
            Rtm.getData();
            $rootScope.$apply();
            $httpBackend.flush();
        })

        it('should set "api_key" based on Api.key', function(){
            setChromeSpy();
            var regex = new RegExp(Api.url + '.*api_key=' + encodeURIComponent(Api.key) + '.*');
            $httpBackend.whenGET(/.*/).respond({});
            $httpBackend.expect('GET', regex);
            Rtm.getData();
            $rootScope.$apply();
            $httpBackend.flush();
        })

        it('should set the provided parameters', function(){
            setChromeSpy();
            var params = {p1: 'v1', p2: 'v2'};
            var regex = new RegExp('.*p1=v1.*&.*p2=v2.*');
            $httpBackend.whenGET(/.*/).respond({});
            $httpBackend.expect('GET', regex);
            Rtm.getData('', params);
            $rootScope.$apply();
            $httpBackend.flush();
        })

        it('should set the "method" based on th provided method name', function(){
            setChromeSpy();
            var method = 'my.test.method';
            var regex = new RegExp('.*method=' + method.replace('.', '\.') + '.*');
            $httpBackend.whenGET(/.*/).respond({});
            $httpBackend.expect('GET', regex);
            Rtm.getData(method);
            $rootScope.$apply();
            $httpBackend.flush();
        })

        it('should set both the method and parameters', function(){
            setChromeSpy();
            var method = 'my.test.method';
            var params = {p1: 'v1', p2: 'v2'};
            var paramsRegex = new RegExp('.*p1=v1.*&.*p2=v2.*');
            var methodRegex = new RegExp('.*method=' + method.replace('.', '\.') + '.*');
            $httpBackend.whenGET(/.*/).respond({});
            $httpBackend.expect('GET', methodRegex);
            $httpBackend.resetExpectations();
            $httpBackend.expect('GET', paramsRegex);
            Rtm.getData(method, params);
            $rootScope.$apply();
            $httpBackend.flush();
        })

        it('should set the "auth_token" parameter from the store if available', function(){
            var tokenValue = 'testtoken'
            setChromeSpy({auth: {token: tokenValue}});
            var regex = new RegExp('.*auth_token=' + tokenValue + '.*');
            $httpBackend.whenGET(/.*/).respond({});
            $httpBackend.expect('GET', regex);
            Rtm.getData();
            $rootScope.$apply();
            $httpBackend.flush();
        })

        describe('the authorisation url', function(){

            it('should return the Api.authUrl as its root', function(){
                expect(Rtm.getAuth()).toMatch(new RegExp(Api.authUrl));
            })

            it('should add the permissions to the url', function(){
                expect(Rtm.getAuth()).toMatch(new RegExp('perms=' + Api.permissions));
            })

            it('should add the frob to the url', function(){
                var frob = 'myfrob';
                expect(Rtm.getAuth(frob)).toMatch(new RegExp('frob=' + frob));
            })

            it('should sign the request', function(){
                var frob = 'myfrob';
                expect(Rtm.getAuth(frob)).toMatch(new RegExp('api_sig=.+'));
            })
        })
    })
})