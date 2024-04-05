import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class RefreshtokenprticulierGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}
 
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const refresh_secret = this.configService.get<string>('key.refresh');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Accès non authorisé ! ');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: refresh_secret,
      });
      if (payload.role == 'client') {
        if (payload.sub) {
         request['userId'] = payload.sub;
         } else {
         throw new UnauthorizedException("Les informations sur cet utilisateur sont introuvables");
         }
      }
      else throw new UnauthorizedException('Vous ne pouvez accéder à cette ressource');
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
}
