import Client from '../../db/ClientsModel';
import Instructor from '../../db/InstructorsModel';

import config from '../../config';
import jwt from 'jsonwebtoken';
import {findUser} from './common';
import statusCodeMessage from '../statusCodeMessage';

export default function signIn(req) {
  return new Promise((resolve, reject) => {
    let {username, password, fromSocial, age, languages, gender, email, userType} = req.body;

    if (fromSocial === 'default') {
      let statusCode = 0;
      if (!username) {
        statusCode = 1000;
      }

      if (!email) {
        statusCode = 1001;
      }

      if (!password) {
        statusCode = 1002;
      }

      if (!age && parseInt(age)) {
        age = parseInt(age);
        statusCode = 1003;
      }

      if (!languages) {
        statusCode = 1004;
      }

      if (!gender) {
        statusCode = 1005;
      }

      if (!userType) {
        statusCode = 1006;
      }

      if (statusCode != 0) {
        // email address is absolutely necessary for user creation
        return reject({
          success: false,
          msg: statusCodeMessage[statusCode],
          statusCode,
        });
      }
    }


    if (fromSocial === 'fb') {
      if (!req.body.fb_token) {
        let statusCode = 1007;
        return reject({
          success: false,
          msg: statusCodeMessage[statusCode],
          statusCode,
        });
      } else {
        findUser(UserModel, email).then((code, users) => {
          //db error
          if (code == 2000) {
            let statusCode = 1010;
            return reject({
              success: false,
              msg: statusCodeMessage[statusCode],
              statusCode,
            });
          //user found using email
          } else if (code == 2001) {
            let statusCode = 1011;
            return reject({
              success: false,
              msg: statusCodeMessage[statusCode],
              statusCode,
            });
          //user not found
          } else if (code == 2002) {
            let user = null;
            if (userType == 'player') {
              user = new Client();
            } else if (userType == 'instructor') {
              user = new Instructor();
            }

            user.name = username;
            user.password = password;
            user.email = email;
            user.gender = gender;
            user.age = age;
            user.age_range = 'J0';
            if (user.age < 30 && user.age_range > 20) {
              user.age_range = 'J1';
            }
            user.save(function(err) {
              if (err) {
                let statusCode = 1010;
                return reject({
                  success: false,
                  msg: statusCodeMessage[statusCode],
                  statusCode,
                });
              }
              let payload = {
                'username': user.username,
                'email': user.email,
                'expire': new Date().getTime() + 3600000 * 24 //one day
              };
              let token = jwt.sign(payload, config.jwt.secret);
              req.session.token = token;

              return resolve({
                success: true,
                message: 'User added/created successfully',
                statusCode: 0,
                data: {
                  'token': token,
                  'user': {
                    'username': user.username
                  }
                }
              });
            });
          }
        })
      }
    } else if (fromSocial == 'default') {

    }
  });
}
