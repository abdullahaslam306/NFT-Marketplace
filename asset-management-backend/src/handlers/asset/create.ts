/**
 * Handler to create asset
 */

import * as Vandium from 'vandium';
import { helpers, configs } from 'backend-utility';
import { logger } from '../../common/utils/logger';
import { repositories } from 'data-access-utility';
import { Serializer } from 'jsonapi-serializer';
import { validationMessages } from '../../common/validation-code/en';

const { enums } = configs;
const {
  AUDIO, IMAGE, THREED_MODEL, VIDEO,
} = enums.AssetTypes;

const {
  AUDIO: AUDIO_EXTENTIONS,
  IMAGE: IMAGE_EXTENTIONS,
  VIDEO: VIDEO_EXTENTIONS,
  THREED_MODEL: THREED_MODEL_EXTENTIONS,
} = enums.AssetTypeExtensions;

const { MP3, WAV } = AUDIO_EXTENTIONS;
const { MP4, WEBM, MOV } = VIDEO_EXTENTIONS;
const { GLB, GLTF } = THREED_MODEL_EXTENTIONS;
const {
  JPG, PNG, GIF, SVG, JPEG
} = IMAGE_EXTENTIONS;
const { getUserId } = helpers.functions;
const { error: errorResponse, success: successResponse } = helpers.responses;

const { S3_META_DATA_BUCKET_NAME } = process.env;

/**
 * Create asset handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const { type, name, size, extension } = event.body;
  let response: any;
  try {
    let userId = getUserId(context);
    const assetRepo = new repositories.Asset(connection);
    const asset = await assetRepo.create(userId, name, type, extension, size, S3_META_DATA_BUCKET_NAME);
    response = await successResponse('AssetCreated', serialize(asset));
  } catch (exp) {
    logger.error(exp, 'Exception - Create Asset API');
    response = await errorResponse(exp);
  }
  return response;
};

/**
 * Request Validation Schema
 */
export const validationSchema = () => {
  const type = 'type';
  const maxFileSize = 100*1024*1024; // Converting 100 MB to Bytes
  return {
    body: {
      type: Vandium.types.string()
        .allow(AUDIO, IMAGE, THREED_MODEL, VIDEO)
        .only()
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'asset_info')),
      extension: Vandium.types.any().when(type, {
          is: IMAGE,
          then: Vandium.types.string().trim().required().allow(JPG, PNG, SVG, GIF, JPEG).only().required(),
          otherwise:  Vandium.types.any().when(type, {
            is: VIDEO,
            then: Vandium.types.string().trim().required().allow(MP4, MOV, WEBM).only().required(),
            otherwise:  Vandium.types.any().when(type, {
              is: AUDIO,
              then: Vandium.types.string().trim().required().allow(MP3, WAV).only().required(),
              otherwise:  Vandium.types.any().when(type, {
                is: THREED_MODEL,
                then: Vandium.types.string().trim().required().allow(GLB, GLTF).only().required(),
              }),
            }),
          }),
        })
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'asset_info')),
      name: Vandium.types.string().max(255)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'asset_info')),
      size: Vandium.types.number().integer().max(maxFileSize)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'asset_info')),
    }
  };
}

/**
 * Serialize create asset response
 * @param {Object} data
 */
const serialize = (data: Record<string, any>) => {
  const attributes: Array<String> = [
    'status',
  ];
  const serializerSchema: Record<string, any> = ({
    id: 'uid',
    attributes,
    keyForAttribute: 'camelCase',
  });

  return new Serializer('Asset', serializerSchema).serialize(data);
}
