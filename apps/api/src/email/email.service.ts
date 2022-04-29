import { UserParent } from '@lib/prisma';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmationEmail(userParent: UserParent, url: string) {
    await this.mailerService.sendMail({
      to: userParent.email,
      subject: 'Welcome to Pocket! Confirm your Email',
      template: 'confirmation',
      context: {
        name: userParent.firstName,
        url: url,
      },
    });
  }
}
