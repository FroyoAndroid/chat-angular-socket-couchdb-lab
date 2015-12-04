'use strict';

angular.module('chat.controllers').controller('ChatCtrl', [
  '$scope',
  'Socket',

  function ($scope, Socket) {
    var changeName = function(oldName, newName) {      
      for (var i = 0, max = $scope.users.length; i < max; i++) {
        if ($scope.users[i] === oldName) {
          $scope.users[i] = newName;
          break;
        }
      }

      $scope.messages.push({
        user: 'server',
        text: oldName + ' is now ' + newName + '.'
      });
    };

    Socket.on('init', function(data) {
      $scope.name = data.name;
      $scope.users = data.users;

      $scope.messages.push({
        user: 'server',
        text: 'This is labs for itirod :)',
        time: +Date.now()
      });

      $scope.messages.push({
        user: 'server',
        text: 'Chat with pleasure!',
        time: +Date.now()
      });

    });

    Socket.on('send:message', function(message) {
      $scope.messages.push(message);
    });

    Socket.on('user:join', function(data) {
      $scope.messages.push({
        user: 'server',
        text: data.name + ' has joined.'
      });

      $scope.users.push(data.name);
    });

    Socket.on('name:change', function(data) {
      changeName(data.oldName, data.newName);
    });

    Socket.on('user:leave', function(data) {
      $scope.messages.push({
        user: 'server',
        text: data.name + ' has left.'
      });
      
      for (var i = 0, max = $scope.users.length; i < max; i++) {
        if ($scope.users[i] === data.name) {
          $scope.users.splice(i, 1);
          break;
        }
      }
    });

    $scope.messages = [];

    $scope.sendMessage = function() {
      Socket.emit('send:message', {
        message: $scope.message
      });

      $scope.messages.push({
        user: $scope.name,
        text: $scope.message,
        time: +Date.now()
      });

      $scope.message = '';
    };

    function getXmlHttp(){
      var xmlhttp;
      try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
          xmlhttp = false;
        }
      }
      if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
        xmlhttp = new XMLHttpRequest();
      }
      return xmlhttp;
    }

    $scope.messagesServer = [];

    $scope.getMessages = function() {
      var xmlhttp = getXmlHttp()
      xmlhttp.open('GET', '/xhr/test.html', false);
      xmlhttp.send(null);
      if(xmlhttp.status == 200) {
        console.log(xmlhttp.responseText);
        $scope.messagesServer = xmlhttp.responseText;
      }
    };

    $scope.showForAdmin = false;

    $scope.changeName = function() {
      var oldName = $scope.name,
          newName = prompt('New name:');

      if (!newName) return;
      if(newName.toLowerCase() === 'admin') {
        $scope.showForAdmin = true;
      } else {
        $scope.showForAdmin = false;
      }
      Socket.emit('name:change', {
        name: newName
      }, function(result) {
        if (!result) {
          alert('Something went wrong. Try again.');
        } else {
          changeName(oldName, newName);

          $scope.name = newName;
        }
      });
    };
  }
]);