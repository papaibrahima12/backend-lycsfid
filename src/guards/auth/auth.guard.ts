import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { secretKey } from './config';
import { Request } from 'express';


@Injectable()
export class AuthGuard implements CanActivate {
 constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Accès non authorisé ! ');
    }
    this.jwtService.verify(token, secretKey)
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretKey.secret,
      });
      if (payload.role !== 'admin') {
        throw new UnauthorizedException('Seuls les administrateurs peuvent accéder à cette ressource');
      }
      console.log(payload);
      
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException("Vous n'etes pas autorisé à accéder à cette ressource !");
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
