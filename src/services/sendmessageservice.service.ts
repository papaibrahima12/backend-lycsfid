import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SendMessageServiceService {
    private readonly baseUrl = 'https://api.orange.com/oauth/v3/token';
    private readonly clientId = process.env.SMS_USERNAME;
    private readonly clientSecret = process.env.SMS_PASSWORD;
    private readonly devNumber = process.env.DEV_NUMBER;
    private readonly sendMessUrl = `https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B${this.devNumber}/requests`;
    
    async generateToken(): Promise<string> {  
        try{ 
        const credentials = `${this.clientId}:${this.clientSecret}`;
        const base64Credentials = Buffer.from(credentials).toString('base64');

        const headers = {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        };

        const data = 'grant_type=client_credentials';

        const response = await axios.post(this.baseUrl, data, { headers });

        return response.data.access_token;
        } catch (error) {
            console.error('error', error);
            throw new Error('Erreur lors de la génération du token.');
        }
    }

    async sendSMS(receiver: string,message){
        try {
            const data = {
                "outboundSMSMessageRequest": {
                    "address": receiver,
                    "senderAddress":this.devNumber,
                    "outboundSMSTextMessage": {
                        "message": message
                    }
                }
            };
            const headers = {
                Authorization: `Bearer ${this.generateToken()}`,
                'Content-Type': 'application/json',
                };
            const response = await axios.post(this.sendMessUrl, data, { headers });

            return response;   
        } catch (error) {
            console.error('error', error);
            throw new Error("Erreur lors de l'envoie du SMS au destinataire !");
        }
    }
}
