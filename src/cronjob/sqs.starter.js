import "dotenv/config";
import {
  sqsClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "../config/sqs.config.js";
import S3Service from "../services/s3.service.js";

// init dbs
import "../database/init.mongodb.js";

class SQSHandler {
  constructor() {
    this.queueUrl = process.env.SQS_QUEUE_URL;
  }

  async receiveMessage(queueUrl) {
    return sqsClient.send(
      new ReceiveMessageCommand({
        AttributeNames: ["SentTimestamp"],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: ["All"],
        QueueUrl: queueUrl,
        WaitTimeSeconds: 10,
        VisibilityTimeout: 10,
      })
    );
  }

  filterMessageBody(message) {
    const {
      Records: [
        {
          s3: {
            object: { key: s3VideoKey },
          },
        },
      ],
    } = JSON.parse(message.Body);

    const {
      Records: [{ eventSource, eventName }],
    } = JSON.parse(message.Body);

    const s3VideoId = s3VideoKey.split("/")[3].split(".")[0]; // get the video ID from the key

    return { eventSource, eventName, s3VideoId, s3VideoKey };
  }

  chooseHandlerOfEventSource({ eventSource, eventName, dataHandle }) {
    const handlers = {
      "aws:s3": {
        "ObjectCreated:Put": S3Service.s3ObjectCreated,
        "ObjectRemoved:Delete": (dataHandle) => {
          console.log("ObjectRemoved:Delete");
          return 1;
        },
      },
    };

    if (handlers[eventSource] && handlers[eventSource][eventName]) {
      handlers[eventSource][eventName](dataHandle);
    } else {
      console.log(`No handler found for ${eventSource}:${eventName}`);
      return 1;
    }
  }

  async handleMessageReceived(listMessages) {
    for (const message of listMessages) {
      const { eventSource, eventName, s3VideoId, s3VideoKey } =
        this.filterMessageBody(message);

      this.chooseHandlerOfEventSource({
        eventSource,
        eventName,
        dataHandle: { s3VideoId, s3VideoKey },
      });
    }

    await Promise.all(
      listMessages.map((message) => this.deleteMessage(message.ReceiptHandle))
    );
  }

  async deleteMessage(messageReceiptHandle) {
    try {
      await sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: this.queueUrl,
          ReceiptHandle: messageReceiptHandle,
        })
      );

      return true;
    } catch (error) {
      console.error("Error deleting message", error);
    }
  }

  async start() {
    try {
      while (true) {
        const { Messages } = await this.receiveMessage(this.queueUrl);

        if (!Messages) {
          console.log("No messages in the queue");
          continue;
        }

        await this.handleMessageReceived(Messages);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const sqsHandler = new SQSHandler();

sqsHandler.start();
