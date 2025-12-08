import nodemailer from 'nodemailer'
import { Address } from 'nodemailer/lib/mailer'
type MailType = {
  service: string
  host: string
  from: string
  senderName: string
  to: string
  pass: string
  port: number
  subject: string
  template: string
  context: any // dynamic data
  attachments?: any
  html: string
}

export async function sendMailToUser(data: MailType) {
  const { service, host, from, senderName, to, pass, port, subject, template, context, attachments, html } = data
  try {
    if (
      !service ||
      !host ||
      !from ||
      !senderName ||
      !to ||
      !pass ||
      !port ||
      !subject ||
      !template ||
      !context ||
      !html
    ) {
      throw new Error('Missing parameters send mail')
    }
    let transporter = nodemailer.createTransport({
      service: service,
      host: host,
      auth: {
        user: from,
        pass: pass,
      },
      port: port,
      secure: port === 465 ? true : false,
    })
    // transporter.use('compile', hbs(hbsOption))
    var mailOptions = {
      from: {
        senderName: senderName as string | undefined | Address,
        adress: from,
      },
      to: to,
      subject: subject,
      html: html,
      // context: context,
    }

    return await transporter.sendMail(mailOptions as any)
  } catch (error) {
    throw new Error('Error in getConfigMail' + error)
  }
}
