import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OtpService } from './otp.service';

@Injectable()
export class SendMessageServiceService {
    private readonly baseUrl = process.env.URL_GEN_TOKEN;
    private readonly clientId = process.env.SMS_USERNAME;
    private readonly clientSecret = process.env.SMS_PASSWORD;
    private readonly devNumber = process.env.DEV_NUMBER;
    private readonly sendMessUrl = `https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B${this.devNumber}/requests`;
    
    constructor(private readonly otpService: OtpService){
        
    }

    async generateToken() {  
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

    async sendSMSOTP(receiver: string){
        try {
            const otp = this.otpService.generateOtp();
            this.otpService.storeOtp(receiver, otp);

            const message = `Votre code OTP est : ${otp}.Il est valide pendant 3 minutes.`;

            const token = await this.generateToken();

            const data = {
                "outboundSMSMessageRequest": {
                    "address": "tel:+221"+receiver,
                    "senderAddress":"tel:+"+this.devNumber,
                    "outboundSMSTextMessage": {
                        "message": message
                    }
                }
            };
            const headers = {
                Authorization: `Bearer ${token}`,
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
