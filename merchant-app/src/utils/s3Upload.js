import AWS from "aws-sdk";
import { Uint8ToBase64 } from "./uint8ToBase64";

export async function s3upload(file, s3Credentials) {
  try {
    const filePath = s3Credentials?.s3?.prefix + "/" + file.name;
    const { accessKeyId, secretAccessKey, sessionToken } =
      s3Credentials?.credentials;

    AWS.config.update({
      region: process.env.COGNITO_REGION,
      accessKeyId,
      secretAccessKey,
      sessionToken,
    });

    var s3 = new AWS.S3({
      params: { Bucket: s3Credentials?.s3?.bucketName },
    });

    const res = await s3
      .upload({
        Key: filePath,
        Body: file,
        ContentType: file.type,
      })
      .promise();
    return res;
  } catch (err) {
    throw err;
  }
}

export async function downloadS3Base64(
  filePath,
  s3Credentials,
  extension,
  bucketName
) {
  try {
    const { accessKeyId, secretAccessKey, sessionToken } =
      s3Credentials?.credentials;

    AWS.config.update({
      region: process.env.COGNITO_REGION,
      accessKeyId,
      secretAccessKey,
      sessionToken,
    });

    var s3 = new AWS.S3({
      params: {
        Bucket: bucketName ? bucketName : s3Credentials?.s3?.bucketName,
      },
    });

    const res = await s3
      .getObject({
        Key: filePath,
      })
      .promise();
    const imageSrc =
      `data:image/${extension};base64,` + Uint8ToBase64(res.Body);
    return imageSrc;
  } catch (err) {
    console.error({ err });
  }
}

export async function downloadS3SignedURL(s3Credentials, filePath, bucketName) {
  try {
    const { accessKeyId, secretAccessKey, sessionToken } =
      (s3Credentials && s3Credentials.credentials) || {};
    if (accessKeyId && secretAccessKey) {
      AWS.config.update({
        region: process.env.COGNITO_REGION,
        accessKeyId,
        secretAccessKey,
        sessionToken,
      });

      var s3 = new AWS.S3({
        params: {
          Bucket: bucketName ? bucketName : s3Credentials?.s3?.bucketName,
        },
      });

      const url = s3.getSignedUrl("getObject", {
        Bucket: bucketName ? bucketName : s3Credentials?.s3?.bucketName,
        Key: filePath,
      });
      return url;
    } else {
      return "";
    }
  } catch (err) {
    console.log(err);
    return "";
  }
}

export function downloadS3SignedURLThumbnail(
  s3Credentials,
  filePath,
  bucketName
) {
  try {
    const { accessKeyId, secretAccessKey, sessionToken } =
      (s3Credentials && s3Credentials.credentials) || {};
    if (accessKeyId && secretAccessKey) {
      AWS.config.update({
        region: process.env.COGNITO_REGION,
        accessKeyId,
        secretAccessKey,
        sessionToken,
      });

      var s3 = new AWS.S3({
        params: {
          Bucket: bucketName ? bucketName : s3Credentials?.s3?.bucketName,
        },
      });

      const url = s3.getSignedUrl("getObject", {
        Bucket: bucketName ? bucketName : s3Credentials?.s3?.bucketName,
        Key: filePath,
      });
      return url;
    } else {
      return "";
    }
  } catch (err) {
    console.log(err);
    return "";
  }
}
