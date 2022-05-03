import { UserChild, UserParent } from '@lib/prisma';
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

  async sendChildSignupEmail(
    userParent: UserParent,
    userChild: UserChild,
    url: string,
  ) {
    await this.mailerService.sendMail({
      to: userChild.email,
      subject: `You've been invited to Pocket by ${userParent.firstName} !`,
      template: 'child_invitation',
      context: {
        name: userChild.firstName,
        url: url,
      },
    });
  }
}
