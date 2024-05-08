import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as admin from 'firebase-admin';
import path from 'path';


// firebase.initializeApp({
//     credential: firebase.credential.cert(
//       {
//         "projectId": "lycs-fid-customer",
//         "clientEmail": process.env.clientFirebaseEmail,
//         "privateKey": process.env.privateFirebaseKey
//       }
//     ),
//   });
// firebase.messaging(app);
// const messagingTest =  getMessaging();
// const tokenFCM= getToken(messagingTest);

const serviceAccount = require('../../src/firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
}, 'test');

@Injectable()
export class NotificationService {
    constructor() {}

      async sendingNotificationOneUser(title:string, description:string) {
        const token = process.env.tokenFCM;
        const payload= {
          token: token,
          notification: {
            title: title,
            body: description
          }
          }
        return admin.messaging().send(payload).then((res)=>{
          return {
              success:true
          }
        }).catch((error)=>{
            console.log('error', error)
            return {
                success:false
            }
        })
      }
}
