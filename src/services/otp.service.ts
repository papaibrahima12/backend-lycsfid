import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
    private otpMap = new Map<string, { otp: string; expiresAt: number }>();

  generateOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Générer un OTP à six chiffres
    return otp;
  }

  storeOtp(phoneNumber: string, otp: string, expiresInMinutes: number = 4): void {
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
    this.otpMap.set(phoneNumber, { otp, expiresAt });
    console.log('map: ', this.otpMap);
  }

  getOtp(phoneNumber: string): string | null {
    const storedOtp = this.otpMap.get(phoneNumber);
    if (storedOtp && storedOtp.expiresAt > Date.now()) {
      return storedOtp.otp;
    } else {
      this.otpMap.delete(phoneNumber);
      return null;
    }
  }

  cleanupExpiredOtps(): void {
    const currentTime = Date.now();
    for (const [phoneNumber, otpData] of this.otpMap.entries()) {
        if (otpData.expiresAt < currentTime) {
            this.otpMap.delete(phoneNumber);
        }
    }
  }

  verifyOtp(phoneNumber: string, enteredOtp: string): boolean {
    const storedOtpData = this.otpMap.get(phoneNumber);
    if (!storedOtpData || storedOtpData.expiresAt < Date.now()) {
        return false;
    }

    return storedOtpData.otp === enteredOtp;
  }
}
