'use strict';

if (!window.console) {
    window.console = {};
    window.console.log = function(){};
}

var app =  angular.module('app',['angular-notify-bar']);

app.controller('MainCtrl', ['$scope', 'NotifyBar', function($scope, NotifyBar) {
		
     $scope.notifyWithTimeout = function(){   
       NotifyBar({
            message: "Hello",
            timeout: 6,
            backdrop: false
        });
     };
     
    $scope.notifyWithoutTimeout = function(){   
       NotifyBar({
            message: "Hello",            
            timeout: 0,
            backdrop: false
        });
     };
        
     $scope.notifyWithBlack = function(){
       NotifyBar({
            message: "Hello",      
            timeout: 0,      
            backdrop: true
        });         
     }   
        
}]);
