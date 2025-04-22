import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendMail(email: string, link: string): Promise<void> {
    console.log('Sending email to:', email);
    console.log('Verification link:', link);
    
    await this.mailerService.sendMail({
      from: '"Support Team" <mo@gmail.com>',
      to: email,
      template: 'login',
      context: {
        email,
        link,
      },
    });
  }
}
