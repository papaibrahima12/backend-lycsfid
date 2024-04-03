import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { secretKey } from '../config/config';
import { Request } from 'express';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Token invalide ou inexistant !");
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretKey.secret,
      });
      if (payload.role !== 'entreprise') {
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
    } catch (error) {
      if (error instanceof JsonWebTokenError && error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token invalide, verifiez le token !');
      } else if (error instanceof TokenExpiredError && error.name === 'TokenExpiredError') {
       throw new UnauthorizedException('Token expiré');
      } else {
        throw error;
      }
    }
      
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
