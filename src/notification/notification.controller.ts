import { Body, Controller, Get, Post } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { ApiBody } from "@nestjs/swagger";

@Controller("firebase")
export class NotificationController {
  constructor(
    private readonly sendingNotificationService: NotificationService,
  ) {}

  @Post("send-notification/")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        token: { type: "string" },
        title: { type: "string" },
        description: { type: "string" }
      },
    },
  })
  async sendNotification(@Body() body: {token: string, title: string; description: string },) {
    return await this.sendingNotificationService.sendingNotificationOneUser(body.token, body.title, body.description);
  }
}
