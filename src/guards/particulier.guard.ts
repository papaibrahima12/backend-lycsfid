import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { secretKey } from 'src/config/config';

@Injectable()
export class ParticulierGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secret = this.configService.get<string>('key.access');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Token invalide ou inexistant !");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });
      if (payload.role !== 'client') {
        throw new UnauthorizedException('Seuls les clients peuvent accéder à cette ressource');
      }
      if (payload.sub) {
        request['userId'] = payload.sub;
      } else {
      throw new UnauthorizedException("Les informations sur le client sont introuvables");
    }
      request['user'] = payload;
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
