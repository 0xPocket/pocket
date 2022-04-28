import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendTestEmail(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Pocket! Confirm your Email',
      template: 'confirmation',
    });
  }
}
