const { GoogleAuth } = require('google-auth-library');
const { PubSub } = require('@google-cloud/pubsub');
const grpc = require('@grpc/grpc-js');

require('dotenv').config();

async function getTopic(client, topicName) {
    const [topics] = await client.getTopics();
    const topic = topics.find((topic) => topic.name === `projects/${client.projectId}/topics/${topicName}`);

    return topic;
}

async function createTopic(client, topicName) {
    // Check exists
    const exists = await getTopic(client, topicName);
    if (exists) {
        return exists;
    }

    // Create new
    const [ created ] = await client.createTopic(topicName);

    return created;
}

function createClient(projectId, clientEmail, privateKey) {
    try {
        // Create client
        const credentials = { client_email: clientEmail, private_key: privateKey };
        const auth = new GoogleAuth({ credentials });
        const client = new PubSub({ auth, projectId, grpc});

        return client;
    } catch(error) {
        console.error(error);
        throw new Error('Error occurred when authen.');
    }
}

async function publish(topic, message) {
    try {
        // Send a message to the topic
        const messageId = await topic.publish(Buffer.from(message));
        console.log(`Message ${messageId} was published.`);

        return messageId;
    } catch(error) {
        console.error(error);
        throw new Error('Error occurred when publish.');
    }
}

module.exports = { createClient, createTopic, publish };