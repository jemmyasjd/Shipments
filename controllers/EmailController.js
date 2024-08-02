// const Email = require('../models/emailSchema');
// const schedule = require('node-schedule');
// const nodemailer = require('nodemailer');

// // Code to schedule an email

// async function scheduleEmail(email) {
//     const { scheduleTime, recurrence } = email;

//     const job = schedule.scheduleJob(scheduleTime, async () => {
//         await sendEmail(email);
//         email.status = 'sent';
//         await email.save();

//         if (recurrence !== 'none') {
//             rescheduleEmail(email);
//         }
//     });

//     email.jobId = job.id;
// }

// // Code to send an email

// async function sendEmail(email) {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         host : 'smtp.gmail.com',
//         port : 587,
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: "wiaqetvlohqouquj",
//         },
//     });

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email.recipient,
//         subject: email.subject,
//         text: email.body,
//         attachments: email.attachments,
//     };

//     await transporter.sendMail(mailOptions);
// }

// // Code to reschedule an email based on recurrence

// function rescheduleEmail(email) {
//     const { recurrence } = email;
//     let nextScheduleTime;

//     switch (recurrence) {
//         case 'daily':
//             nextScheduleTime = new Date(email.scheduleTime);
//             nextScheduleTime.setDate(nextScheduleTime.getDate() + 1);
//             break;
//         case 'weekly':
//             nextScheduleTime = new Date(email.scheduleTime);
//             nextScheduleTime.setDate(nextScheduleTime.getDate() + 7);
//             break;
//         case 'monthly':
//             nextScheduleTime = new Date(email.scheduleTime);
//             nextScheduleTime.setMonth(nextScheduleTime.getMonth() + 1);
//             break;
//         case 'quarterly':
//             nextScheduleTime = new Date(email.scheduleTime);
//             nextScheduleTime.setMonth(nextScheduleTime.getMonth() + 3);
//             break;
//     }

//     email.scheduleTime = nextScheduleTime;
//     scheduleEmail(email);
// }

// // Code to create and schedule an email

// async function createEmail(req, res) {
//     try {
//         const email = new Email(req.body);
//         await email.save();
//         scheduleEmail(email);
//         // sendEmail(email);
//         res.status(201).json({ message: 'Email scheduled successfully', email });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// // Code to retrieve all scheduled emails

// async function getScheduledEmails(req, res) {
//     try {
//         const emails = await Email.find();
//         res.json(emails);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// // Code to retrieve a specific scheduled email by ID

// async function getScheduledEmailById(req, res) {
//     try {
//         const email = await Email.findById(req.params.id);
//         if (!email) return res.status(404).json({ message: 'Email not found' });
//         res.json(email);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// // Code to delete a scheduled email by ID

// async function deleteScheduledEmail(req, res) {
//     try {
//         const email = await Email.findByIdAndDelete(req.params.id);
//         if (!email) return res.status(404).json({ message: 'Email not found' });
//         res.json({ message: 'Email cancelled successfully', email });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// module.exports = { createEmail, getScheduledEmails, getScheduledEmailById, deleteScheduledEmail };

// second

const Email = require('../models/emailSchema');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');

// Function to schedule an email
async function scheduleEmail(email) {
    const { scheduleTime, recurrence } = email;
    console.log(`Scheduling email for ${scheduleTime}`);

    const job = schedule.scheduleJob(scheduleTime, async () => {
        console.log(`Job triggered for ${email.recipient} at ${new Date()}`);
        await sendEmail(email);
        email.status = 'sent';
        await email.save();

        if (recurrence !== 'none') {
            rescheduleEmail(email);
        }
    });

    email.jobId = job.id;
}

// Function to send an email
async function sendEmail(email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email.recipient,
        subject: email.subject,
        text: email.body,
        attachments: email.attachments,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email.recipient}`);
    } catch (error) {
        console.error(`Failed to send email to ${email.recipient}:`, error);
    }
}

// Function to reschedule an email based on recurrence
function rescheduleEmail(email) {
    const { recurrence } = email;
    let nextScheduleTime;

    switch (recurrence) {
        case 'daily':
            nextScheduleTime = new Date(email.scheduleTime);
            nextScheduleTime.setDate(nextScheduleTime.getDate() + 1);
            break;
        case 'weekly':
            nextScheduleTime = new Date(email.scheduleTime);
            nextScheduleTime.setDate(nextScheduleTime.getDate() + 7);
            break;
        case 'monthly':
            nextScheduleTime = new Date(email.scheduleTime);
            nextScheduleTime.setMonth(nextScheduleTime.getMonth() + 1);
            break;
        case 'quarterly':
            nextScheduleTime = new Date(email.scheduleTime);
            nextScheduleTime.setMonth(nextScheduleTime.getMonth() + 3);
            break;
        default:
            console.error('Invalid recurrence value:', recurrence);
            return;
    }

    email.scheduleTime = nextScheduleTime;
    scheduleEmail(email);
}

// Controller function to create and schedule an email
async function createEmail(req, res) {
    try {
        const email = new Email(req.body);
        await email.save();
        await scheduleEmail(email);
        // await sendEmail(email);
        res.status(201).json({ message: 'Email scheduled successfully', email });
    } catch (err) {
        console.error('Error scheduling email:', err);
        res.status(500).json({ message: err.message });
    }
}

// Controller function to retrieve all scheduled emails
async function getScheduledEmails(req, res) {
    try {
        const emails = await Email.find();
        res.json(emails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Controller function to retrieve a specific scheduled email by ID
async function getScheduledEmailById(req, res) {
    try {
        const email = await Email.findById(req.params.id);
        if (!email) return res.status(404).json({ message: 'Email not found' });
        res.json(email);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Controller function to delete a scheduled email by ID
async function deleteScheduledEmail(req, res) {
    try {
        const email = await Email.findByIdAndDelete(req.params.id);
        if (!email) return res.status(404).json({ message: 'Email not found' });
        res.json({ message: 'Email cancelled successfully', email });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { createEmail, getScheduledEmails, getScheduledEmailById, deleteScheduledEmail };


