const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: 'fastcampuscar@gmail.com',
        pass: 'mcoadjpriihdnaef'
    },
},(err) =>{
    console.log(err)
}
);

// send email
const sendEmail = async (to, subject, body) => {
    try {
        const mailOptions = {
            from: 'campus car <fastcampuscar@gmail.com>',
            to:to,
            subject:subject,
            html: body
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`Message sent: ${result.messageId}`);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = {sendEmail};