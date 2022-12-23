const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const publisher = require('./publisher');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

const projectId = process.env.GOOGLE_PUBSUB_PROJECT_ID;
const clientEmail = process.env.GOOGLE_PUBSUB_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PUBSUB_CLIENT_PRIVATE_KEY.replace(/\\n/g, '\n');
const client = publisher.createClient(projectId, clientEmail, privateKey);

app.post('/publish', async (req, res) => {
    try {
        console.log(`Request with body: ${JSON.stringify(req.body)}`);
        const topic = await publisher.createTopic(client, process.env.GOOGLE_PUBSUB_TOPIC_NAME);
        const messageId = await publisher.publish(topic, JSON.stringify(req.body));

        res.status(200).json({ status: 'success', messageId });
    }
    catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});