/**
 * User: Kieranties
 * Date: 11/08/13
 */

// stubbed implementation used for testing
angular.module('chrome',[])
    .factory('Chrome', function(){
        return {
            runtime: {
                lastError: function(){}
            },
            storage: {
                local:{
                    get: function(){},
                    set: function(){}
                }
            }
        }
    })