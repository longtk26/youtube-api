import {
  SQSClient,
  ReceiveMessageCommand,
  ListQueuesCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({
  region: process.env.SQS_REGION,
  credentials: {
    accessKeyId: process.env.SQS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SQS_SECRET_ACCESS_KEY,
  },
});

export {
  sqsClient,
  ReceiveMessageCommand,
  ListQueuesCommand,
  DeleteMessageCommand,
};
