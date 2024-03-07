import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SendMessageServiceService {
    private tokenUrlGen = 'https://api.orange.com/oauth/v3/token';
    
    async generateToken(value:string): Promise<string> {   
        const username = process.env.SMS_USERNAME;
        const password = process.env.SMS_PASSWORD; 
        try {
          const response = await axios.post(`${this.tokenUrlGen}`,
            { name: 'Authentication' },
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${process.env.TOKEN_AUTH}`
              },
              auth: {
                username,
                password,
              },
              data: {
                grant_type: value,
              },
            },
          );
          console.log('response', response);
    
          return response.data;
        } catch (error) {
            console.log('error', error);
          throw new Error('Erreur lors de la génération du token.');
        }
      }
}
