'use strict';

angular.module('chat.services', [])
  .factory('Socket', function($rootScope) {
    var socket = io.connect();

    return {
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;

          $rootScope.$apply(function() {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      },

      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments;

          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      }
    }
  })