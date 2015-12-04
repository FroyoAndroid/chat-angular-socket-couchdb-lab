'use strict';

angular.module('chat.directives').directive('newMessageField', function() {
  return {
    restrict: 'C',
    link: function(scope, elem, attrs) {
      $(elem).on('keyup', function(ev) {
        if (ev.keyCode == 13) {
          $('.send-message').click();
        }
      });
    }
  };
});