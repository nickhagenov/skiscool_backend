/**
 * Created by baebae on 5/3/16.
 */
import socketIO from 'socket.io';
import {removeObject} from '../utils/utils';
import Client from '../db/ClientsModel';
import checkAuth from '../actions/account/checkAuth';
import _ from 'lodash';

let adminSockets = [];
let onlineSockets = [];

const updateAdmin = (socket, data) => {
  socket.emit('show_devices', {
    devices: data,
    online: onlineSockets
  });
};

const updateAllAdmin = () => {
  Client.find({ location: { $exists: true } }, {name: 1, location: 1, email: 1}, function(err, data) {
    _.forEach(adminSockets, (adminSocket) => {
      if (err) {
        adminSocket.socket.emit('error', err);
      } else {
        updateAdmin(adminSocket.socket, data)
      }
    });
  });
}

const registerDevice = (user, data, socket) => {
  if (data.username =="admin_root_123") {
    //if admin registered
    console.info("admin user logged in", data);

    //update admin sockets
    adminSockets.push({
      socket: socket,
      socketId: socket.id
    });

    //return current device information
    Client.find({ location: { $exists: true } }, {name: 1, location: 1, email: 1}, function(err, data) {
      updateAdmin(socket, data);
    });
  } else {
    console.info("device is registered:", data);

    //check device is registered
    Client.findOne({ device_uuid: data.device_uuid }, function (err, user) {

      //if no devices from database
      if (user != null) {
        //update device username, location
        let updateData = {
          device_uuid: data.device_uuid,
          name: user.name,
          location: data.location,
        };
        Client.update({device_uuid: data.device_uuid}, updateData, function(err, user) {
          if (!err && device) {
            console.log('User location updated ', user);
            onlineSockets.push({
              socketId: socket.id,
              device_uuid: user.device_uuid
            });
            socket.emit('register response', "");
            updateAllAdmin();
          }
        })
      }
    });
  }
};

const socket = (server) => {
  let socketServer = socketIO.listen(server);

  let mainRoom = 'skiscool_room';

  // Initiate socket to handle all connection
  socketServer.sockets.on('connection', function (socket) {
    let socketID = socket.id;
    socket.join(mainRoom);

    // Listen for register action
    console.info("connected", socketID);

    socket.on('registerDevice', function (data) {
      //check user is logged in.
      checkAuth(data.token, true)
        .then((user) => {
          registerDevice(user, data, socket);
        });
    });

    // Listen for disconnect event
    socket.on('disconnect', function () {
      // Update device  online status
      console.info("disconnected");

      //remove disconnected socket from online, admin sockets array;
      removeObject(onlineSockets, socketID, "socketId");
      removeObject(adminSockets, socketID, "socketId");
    });
  });
}

export default socket;