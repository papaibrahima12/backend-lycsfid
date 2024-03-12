import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OtpService } from 'src/services/otp.service';

@Injectable()
export class OtpCleanupJob {
  constructor(private readonly otpService: OtpService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  cleanupExpiredOtps() {
    this.otpService.cleanupExpiredOtps();
  }
}
