import { Injectable, UnauthorizedException } from '@nestjs/common';
    import { PassportStrategy } from '@nestjs/passport';
    import { Strategy } from 'passport-local';
import { AuthService } from 'src/services/auth.service';
    @Injectable()
    export class LocalStrategy extends PassportStrategy(Strategy) {
      constructor(private readonly authService: AuthService) {
        super();
      }
      async validate(email: string, password: string): Promise<any> {
        const emailPartenaire = email.toLowerCase();
        const user = await this.authService.validatePartner(emailPartenaire, password);
        if (!user) {
          throw new UnauthorizedException("Veuillez verifier vos informations !");
        }
        return user;
      }
    }