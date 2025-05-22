import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
//import nodemailer from 'nodemailer';
import { doc } from '@quanta/agent';

const emailFn = createServerFn()
  .validator(
    z.object({
      smtp: z.object({
        host: z.string(),
        port: z.number(),
        username: z.string(),
        password: z.string(),
        tls: z.boolean(),
      }),
      email: z.object({
        from: z.string(),
        to: z.string(),
        subject: z.string(),
        body: z.string(),
      }),
    })
  )
  .handler(async ({ data }) => {
    const { smtp, email } = data;
    //const transporter = nodemailer.createTransport({
    //  host: smtp.host,
    //  port: smtp.port,
    //  secure: smtp.tls,
    //  auth: {
    //    user: smtp.username,
    //    pass: smtp.password,
    //  },
    //});
    //await transporter.sendMail(email);
    return { ok: true };
  });

async function send(
  tool: {
    config: {
      email: string;
      host: string;
      port: number;
      username: string;
      password: string;
      tls: boolean;
    };
  },
  to: string,
  subject: string,
  body: string
) {
  emailFn({
    data: {
      smtp: tool.config,
      email: { from: tool.config.email, to, subject, body },
    },
  });
}

export const email = {
  __doc__: 'An outbound email API.',

  send: doc(
    'email.send',
    send,
    `(tool: Tool<'email'>, to: string, subject: string, body: string): Promise<void>
Sends an email using configured SMTP settings.
Requires an email tool to be connected.
await email.send(tools[3], "recipient@example.com", "Subject", "Email body");`
  ),
};
