import nodemailer from 'nodemailer'

export const emailSender = function({email,subject,text}){

    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.PASSWORD
        }
      });
    
    let mailOptions = {
      from: 'test@test.com',
      to:  `${email}`,
      subject: `${subject}`,
      text: `${text}`
    };
    
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}