import { createServerFn } from '@tanstack/react-start';
import nodemailer from 'nodemailer';
import { doc } from '@quanta/agent';

const emailFn = createServerFn().handler(async ({ data }) => {
  const { smtp, email } = data;

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.tls,
    auth: {
      user: smtp.username,
      pass: smtp.password,
    },
  });

  await transporter.sendMail({
    from: smtp.email,
    to: email.to,
    subject: email.subject,
    html: email.body,
  });

  return {
    ok: true,
  };
});

async function send(
  tool: {
    config: {
      host: string;
      port: number;
      username: string;
      password: string;
      tls: boolean;
    };
  },
  to: string,
  subject: string,
  body: string,
) {
  emailFn({
    data: {
      smtp: tool.config,
      email: { to, subject, body },
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
await email.send(tools[3], "recipient@example.com", "Subject", "Email body");`,
  ),
};
