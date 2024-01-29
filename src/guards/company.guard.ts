import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { secretKey } from './auth/config';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretKey.secret,
      });
      if (payload.role == 'admin' || payload.role == 'client') {
        throw new UnauthorizedException('Seuls les entreprises peuvent accéder à cette ressource');
      }
      console.log(payload);
      if (payload.userId) {
      request['userId'] = payload.userId;
    } else {
      throw new UnauthorizedException("Les informations sur l'entreprise sont introuvables");
    }


      request['user'] = payload;
      console.log('test',request['user'].userId)
    return true;
  }

  private extractTokenFromHeader(request: { headers: { authorization?: string } }): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
