const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = 'test';  // Choose a verification token
const PAGE_ACCESS_TOKEN = 'EAAXvu8ZCxwPMBO7OHAqLRZBi0SLZAvXV6SZAbAZCKfEy73PGEmZAOKvNWKzAfzVmJ2ErlYQ2EDfUJp8HS0qCVTpriAuAHIZCcvFjOmBy3koIlawWZC8iSKIJnlg3BMO44RLIKuwk9TzG2J0mZBwmY16YpDFaBAZCj7jdp62cBdGBqJyzVNbHwbQGkqgUI3UWcAjuZBZA9CGpKfXg1r2Gq7qxLAZDZD'; // Paste the Page Access Token here

// Webhook verification endpoint
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Webhook for messages
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      const messagingEvent = entry.messaging[0];
      const senderId = messagingEvent.sender.id;
      const message = messagingEvent.message.text;

      // Send a reply message to the user
      axios.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
        recipient: { id: senderId },
        message: { text: `You said: ${message}` },
      });
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Webhook server is listening on port 5000');
});
