import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { secretKey } from './auth/config';

@Injectable()
export class ParticulierGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJWTFromCookie(request);
    if (!token) {
      throw new UnauthorizedException("Session expirée, veuillez vous connecter !");
    }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretKey.secret,
      });
      if (payload.role !== 'client') {
        throw new UnauthorizedException('Seuls les clients peuvent accéder à cette ressource');
      }
      console.log(payload);
      if (payload.userId) {
      request['userId'] = payload.userId;
    } else {
      throw new UnauthorizedException("Les informations sur le client sont introuvables");
    }
      request['user'] = payload;
      console.log('test',request['user'].userId)
    return true;
  }

  private extractTokenFromHeader(request: { headers: { authorization?: string } }): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

   private extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  }
}
