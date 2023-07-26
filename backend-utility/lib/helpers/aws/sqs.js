/**
 * Implementation of helper class related to SQS
 */

const aws = require('aws-sdk');
// const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { defaults } = require('../../configs');
const { chunkArray, isValid } = require('../function');

const { REGION } = process.env;
const { QueueBatchSize } = defaults;

class SQS {
  constructor(queueUrl, region = REGION) {
    this.sqs = new aws.SQS({ region });
    this.queueUrl = queueUrl;
    this.receiptHandle = null;
  }

  /**
   * Send single message to sqs queue
   * @param {*} message
   * @returns
   */
  async sendMessage(message) {
    const params = {
      MessageBody: message,
      QueueUrl: this.queueUrl,
    };

    const response = await this.sqs.sendMessage(params).promise();
    return response;
  }

  /**
   * Send messages in batch to sqs
   * @param {Number} messageGroupId
   * @param {Array} messages
   * @param {String} messageIdKey
   * @returns
   */
  async sendBatchMessages(messageGroupId, messages, messageIdKey) {
    // Creating batches of 10 messages due to the SQS service enforced limitation
    const batchMessages = chunkArray(messages, QueueBatchSize);
    const promises = [];

    batchMessages.forEach(batchMessage => {
      const entries = [];
      const params = {
        QueueUrl: this.queueUrl,
      };

      batchMessage.forEach(message => {
        const batchParams = this.generateSqsMessageParams(message, messageGroupId, messageIdKey);
        entries.push(batchParams);
      });
      params.Entries = entries;
      const response = this.sqs.sendMessageBatch(params).promise();
      promises.push(response);
    });
    const responses = await Promise.all(promises);
    return responses;
  }

  /**
   * Delete message from sqs
   * @param {String} receiptHandle
   * @returns
   */
  async deleteMessage(receiptHandle) {
    const params = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    };
    const response = await this.sqs.deleteMessage(params).promise();
    return response;
  }

  /**
   * Receive messages from sqs
   * @param {Number} messageCount
   * @returns
   */
  async readMessage(messageCount, visibilityTimeout, setRecieptHandle = true) {
    const params = {
      QueueUrl: this.queueUrl,
      AttributeNames: ['All'],
      MaxNumberOfMessages: messageCount,
      VisibilityTimeout: visibilityTimeout, // for how much time it should be invisible so no one else can read
      WaitTimeSeconds: 'NUMBER_VALUE', // if there is no message in queue then it will wait for this amount of time
    };
    const response = await this.sqs.receiveMessage(params).promise();
    if (setRecieptHandle === true) {
      this.receiptHandle = response;
    }
    return response;
  }

  /**
   * change the visibility of message in sqs
   * @param {Number} messageCount
   * @returns
   */
  async changeMessageVisibility(receiptHandle = null) {
    const params = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: isValid(receiptHandle) ? receiptHandle : this.receiptHandle,
      VisibilityTimeout: 'NUMBER_VALUE', // for how much time it should be invisible so no one else can read
    };
    const response = await this.sqs.changeMessageVisibility(params).promise();
    return response;
  }

  /**
   * Generates message params
   * @param {Array} message
   * @param {Number} messageGroupId
   * @param {Number} messageIdKey
   * @returns
   */
  generateSqsMessageParams(message, messageGroupId, messageIdKey) {
    return {
      Id: message[messageIdKey].toString(),
      MessageGroupId: messageGroupId.toString(),
      MessageBody: JSON.stringify(message),
      MessageDeduplicationId: message[messageIdKey].toString(),
    };
  }
}

module.exports = SQS;
