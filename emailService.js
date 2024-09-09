const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
    },
});

const sendEmailReminder = (email, bill, isOverdue = false) => {
    const subject = isOverdue ? `Overdue Bill Reminder: ${bill.name}` : `Upcoming Bill Reminder: ${bill.name}`;
    const text = isOverdue
        ? `Your bill ${bill.name} was due on ${bill.due_day} and has not been paid yet. Please pay it as soon as possible.`
        : `Your bill ${bill.name} is due on ${bill.due_day}. Please ensure to pay it on time.`;

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = { sendEmailReminder };
