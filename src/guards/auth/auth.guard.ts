import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';


@Injectable()
export class AuthGuard implements CanActivate {
 constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secret = this.configService.get<string>('key.access');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Accès non authorisé ! ');
    }
    this.jwtService.verify(token, {secret})
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });
      if (payload.role !== 'admin') {
        throw new UnauthorizedException('Seuls les administrateurs peuvent accéder à cette ressource');
      }      
      request['user'] = payload;
    } catch(error) {
      if (error instanceof JsonWebTokenError && error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token invalide, verifiez le token !');
      } else if (error instanceof TokenExpiredError && error.name === 'TokenExpiredError') {
       throw new UnauthorizedException('Token expiré');
      } else {
        throw new UnauthorizedException("Vous n'etes pas autorisé à accéder à cette ressource !");
      }
    }
    return true;
  }
  private extractTokenFromHeader(request: { headers: { authorization?: string } }): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  // private extractJWTFromCookie(req: Request): string | null {
  //   if (req.cookies && req.cookies.token) {
  //     return req.cookies.token;
  //   }
  //   return null;
  // }
}
