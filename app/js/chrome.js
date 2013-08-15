/**
 * User: Kieranties
 * Date: 11/08/13
 */

// Abstracted factory for chrome API to aid in testing
angular.module('chrome',[])
    .factory('Chrome', function(){
        return chrome;
    })