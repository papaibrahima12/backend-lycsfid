import { Body, Controller, Get, Post } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { ApiBody } from "@nestjs/swagger";

@Controller("firebase")
export class NotificationController {
  constructor(
    private readonly sendingNotificationService: NotificationService,
  ) {}

  @Get("send-notification/")
  // @ApiBody({
  //   schema: {
  //     type: "object",
  //     properties: {
  //       token: { type: "string" },
  //     },
  //   },
  // })
  async sendNotification() {
    return await this.sendingNotificationService.sendingNotificationOneUser();
  }
}
