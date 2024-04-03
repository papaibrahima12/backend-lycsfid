import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { secretKey } from '../config/config';
import { Request } from 'express';

@Injectable()
export class AgentGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Token invalide ou inexistant !");
    }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretKey.secret,
      });
      if (payload.role !== 'caissier') {
        throw new UnauthorizedException('Seuls les agents peuvent accéder à cette ressource');
      }
      console.log(payload);
      if (payload.sub) {
      request['userId'] = payload.sub;
    } else {
      throw new UnauthorizedException("Les informations sur l'entreprise sont introuvables");
    }
      request['user'] = payload;
      console.log('test',request['user'].sub)
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
