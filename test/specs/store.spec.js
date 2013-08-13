/**
 * User: Kieranties
 * Date: 11/08/13
 */

describe('The store module', function(){
    var store, chrome, setChromeError;

    beforeEach(function(){
        module('store','chrome');
        inject(function(Store, Chrome){
            store = Store;
            chrome = Chrome;
        })

        setChromeError = function(message){
            spyOn(chrome.runtime, 'lastError')
                .andCallFake(function(){
                    if(!!message) { return {message: message};}
                    else { return null;}
                })
        }
    })

    describe('when setting values', function(){
        beforeEach(function(){
            spyOn(chrome.storage.local, 'set')
                .andCallFake(function(data, callback){
                    callback();
                });
        })

        it('should pass the value to the native chrome method',function(){
            var saveValue = {test: 'value'};
            store.set(saveValue);
            expect(chrome.storage.local.set)
                .toHaveBeenCalledWith(saveValue, jasmine.any(Function));

        })

        it('should return a promise', function(){
            expect(store.set({}).then).toBeDefined();
        })

        it('should resolve the promise when chrome storage completes successfully',
            inject(function($rootScope){
                var promiseSpy = jasmine.createSpy('promise');
                setChromeError();
                store.set({test: 'value'}).then(promiseSpy);
                $rootScope.$apply();
                expect(promiseSpy).toHaveBeenCalled();
            })
        )

        it('should reject the promise when chrome storage errors',
            inject(function($rootScope){
                var promiseSpy = jasmine.createSpy('promise');
                var errorSpy = jasmine.createSpy('error');
                var message = "Error message";
                setChromeError(message);
                store.set({test: 'value'}).then(promiseSpy, errorSpy);
                $rootScope.$apply();
                expect(promiseSpy).not.toHaveBeenCalled();
                expect(errorSpy).toHaveBeenCalledWith(jasmine.any(String));
                expect(errorSpy.mostRecentCall.args[0]).toMatch(message);
            })
        )
    })

    describe('when getting values', function(){
        beforeEach(function(){
            spyOn(chrome.storage.local, 'get')
                .andCallFake(function(key, callback){
                    callback({ 'key': 'keyValue' });
                });
        })

        it('should pass the value to the native chrome method',function(){
            store.get('key');
            expect(chrome.storage.local.get)
                .toHaveBeenCalledWith('key', jasmine.any(Function));

        })

        it('should return a promise', function(){
            expect(store.get({}).then).toBeDefined();
        })

        it('should reject the promise if the key cannot be found',
            inject(function($rootScope){
                var successSpy = jasmine.createSpy('success');
                var errorSpy = jasmine.createSpy('error');
                store.get('error key').then(successSpy, errorSpy);
                $rootScope.$apply();
                expect(successSpy).not.toHaveBeenCalled();
                expect(errorSpy).toHaveBeenCalled();
            })
        )

        it('should return the data if the key is found',
            inject(function($rootScope){
                var successSpy = jasmine.createSpy('success');
                var errorSpy = jasmine.createSpy('error');
                store.get('key').then(successSpy, errorSpy);
                $rootScope.$apply();
                expect(successSpy).toHaveBeenCalledWith('keyValue');
                expect(errorSpy).not.toHaveBeenCalled();
            })
        )
    })
})