/**
 *  Implementation of helper methods related AWS S3
 */

const aws = require('aws-sdk');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { isValid } = require('../function');

const { REGION } = process.env;

const s3 = new aws.S3({
  region: REGION,
  signatureVersion: 'v4',
  apiVersion: '2006-03-01',
});

/**
 * Helper function for deleting s3 object
 * @param {String} bucket
 * @param {String} key
 * @returns boolean
 */
async function deleteS3Object(bucket, key) {
  let status = false;
  if (isValid(key) === true) {
    try {
      const params = {
        Bucket: bucket,
        Key: key,
      };
      await s3.deleteObject(params).promise();
      status = true;
    } catch (exp) {
      pino.error(exp, 'Failed to delete s3 object');
    }
  }
  return status;
}

/**
 * Helper function for deleting s3 directory
 * @param {String} bucket
 * @param {String} dir
 * @returns
 */
async function deleteDirectory(bucket, dir) {
  let status = false;
  if (isValid(dir) === true) {
    try {
      const listParams = {
        Bucket: bucket,
        Prefix: dir,
      };
      const listedObjects = await s3.listObjectsV2(listParams).promise();

      const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] },
      };

      if (listedObjects.Contents.length > 0) {
        listedObjects.Contents.forEach(({ Key }) => {
          deleteParams.Delete.Objects.push({ Key });
        });
      }

      await s3.deleteObjects(deleteParams).promise();
      await deleteS3Object(bucket, dir).promise();
      status = true;
    } catch (exp) {
      pino.error(exp, 'Failed to delete s3 dir');
    }
  }
  return status;
}
/**
 * Copy content from source s3 bucket to destination
 * @param {String} sourceBucket
 * @param {String} sourcePath
 * @param {String} destinationBucket
 * @param {String} destinantionPath
 * @returns
 */
const copyContent = async (sourceBucket, sourcePath, destinationBucket, destinantionPath) => {
  let response = {};
  try {
    const params = {
      Bucket: destinationBucket,
      CopySource: encodeURIComponent(`${sourceBucket}/${sourcePath}`),
      Key: destinantionPath,
    };
    response = await s3.copyObject(params).promise();
  } catch (exp) {
    pino.error(exp);
    throw exp;
  }
  return response;
};

/**
 * Helper function to check if a s3 object exists
 * @param {String} bucket
 * @param {String} key
 * @returns {Boolean}
 */
async function isObjectExists(bucket, key) {
  let response;
  const params = {
    Bucket: bucket,
    Key: key,
  };
  try {
    await s3.headObject(params).promise();
    response = true;
  } catch (error) {
    response = false;
  }
  return response;
}

/**
 * Helper function to get s3 object
 * @param {String} bucket
 * @param {String} key
 */
async function getObject(bucket, key) {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  return s3.getObject(params).promise();
}

/**
 * Helper function to put s3 object
 * @param {String} bucket
 * @param {String} key
 * @param {String} body
 */
async function putObject(bucket, key, body, contentType) {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  };

  return s3.putObject(params).promise();
}

module.exports = {
  getObject,
  putObject,
  copyContent,
  deleteS3Object,
  isObjectExists,
  deleteDirectory,
};
