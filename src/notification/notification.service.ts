import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as firebase from 'firebase-admin';
import * as admin from 'firebase-admin';
import path from 'path';
import { Particulier } from 'src/entities/Particulier.entity';
import { Repository } from 'typeorm';


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
});

@Injectable()
export class NotificationService {
    constructor(
      @InjectRepository(Particulier) private particulierRepository: Repository<Particulier>,
    ) {}

      async sendingNotificationOneUser(title:string, description:string, token:string ) {
        const client = await this.particulierRepository.findOne({where: {deviceId: token}})
        const payload= {
          token: client.deviceId,
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
