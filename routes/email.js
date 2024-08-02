const express = require('express');
const { createEmail, getScheduledEmails, getScheduledEmailById, deleteScheduledEmail } = require('../controllers/EmailController');
const router = express.Router();

router.route('/')
    .post(createEmail)
    .get(getScheduledEmails);

router.route('/:id')
    .get(getScheduledEmailById)
    .delete(deleteScheduledEmail);

module.exports = router;
