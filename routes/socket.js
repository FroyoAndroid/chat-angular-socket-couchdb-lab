var db = require('../db');
db = db();

var users = (function() {
  var allUsers = {};

  var addName = function(name) {
    if (allUsers[name]) return false;

    allUsers[name] = name;

    return true;
  };

  return {
    addName: addName,

    all: function() {
      var response = [];
      
      for (user in allUsers) {
        if (user !== undefined) {
          response.push(user);
        }
      }

      return response;
    },

    create: function() {
      var name, 
          nextId = 1;

      do {
        name = 'Guest ' + nextId;
        nextId += 1;
      } while (!addName(name));

      return name;
    },

    remove: function(name) {
      if (allUsers[name]) {
        delete allUsers[name];
      }
    }
  }
})();

module.exports = function(socket) {
  var name = users.create();

  socket.emit('init', {
    name: name,
    users: users.all()
  });

  socket.broadcast.emit('user:join', {
    name: name
  });

  socket.on('send:message', function(data) {
    socket.broadcast.emit('send:message', {
      user: name,
      text: data.message,
      time: data.time
    });
    db.addMessage({message: data.message, user: name});
  });

  socket.on('name:change', function(data, callback) {
    var oldName = name;
    
    if (users.addName(data.name)) {
      users.remove(oldName);
      name = data.name;

      socket.broadcast.emit('name:change', {
        oldName: oldName,
        newName: name
      });

      callback(true);
    } else {
      callback(false);
    }
  });

  socket.on('disconnect', function(data) {
    socket.broadcast.emit('user:leave', {
      name: name
    });

    users.remove(name);
  });
}