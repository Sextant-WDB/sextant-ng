'use strict';

var Domains = require('../../models/domain-model');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, io, jwtDecode) {

  io.sockets.on('connection', function (socket) {
    // Verify socket is authorized for domain
    socket.on('join', function(data) {

      // Get the users ID
      var userID = jwtDecode(data.jwt).iss;

      // Check that the userID is authorized for the selected domain
      Domains.findOne({ _id: data.domainID, authorizedUsers: { $all: [userID] }},
        function(err, domain) {
        if (err)  {
          socket.emit('message', '401 Unauthorized.');
          return;
        }

        // List clients in the domains room
        var socketRooms = socket.rooms;

        console.log(socketRooms);

        // If the socket is joined into any rooms besides the default
        if (socketRooms.length > 1) {
          // Leave those rooms
          for(var i = 1; i < socketRooms.length; i++) {
            socket.leave(socketRooms[i]);
          }
        }

        var domainName = domain.host;

        // If the domain has an existing room
        if(app.get(domainName)) {
          // Join the socket
          console.log('joining existing room for: ' + domainName);
          socket.join(app.get(domainName));
        } else {
          // Otherwise create the room
          app.set(domainName, bcrypt.hashSync(domainName, bcrypt.genSaltSync(4), null));

          // Join the socket
          socket.join(app.get(domainName));
        }
      });

    });
  });
};
