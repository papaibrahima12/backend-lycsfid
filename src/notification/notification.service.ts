import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as admin from 'firebase-admin';
import { getMessaging, getToken } from "firebase/messaging";


const app=firebase.initializeApp({
    credential: firebase.credential.cert(
      {
        "projectId": "lycs-fid-customer",
        "clientEmail": process.env.clientFirebaseEmail,
        "privateKey": process.env.privateFirebaseKey
      }
    ),
  });
firebase.messaging(app);
const messagingTest =  getMessaging();
const tokenFCM= getToken(messagingTest);

@Injectable()
export class NotificationService {
    constructor() {}

      async sendingNotificationOneUser() {
        const token = process.env.tokenFCM;
        console.log('token',tokenFCM);
        const payload= {
          token: token,
          notification: {
            title: "Attribution de points",
            body: "vous venez de gagner 100 points de fidelités !"
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
