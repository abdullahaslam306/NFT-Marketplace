/**
 * Handler to get nft info
 */
import * as Vandium from 'vandium';
import { Serializer } from 'jsonapi-serializer';
import { helpers } from 'backend-utility';
import { repositories } from 'data-access-utility';

import { logger } from '../../common/utils/logger';
import validationMessages from '../../common/validation-code/en';
import { ApiSuccessResponse } from 'src/common/types';

const { functions, responses } = helpers;
const { getUserId, isValidArray } = functions;
const { error: errorResponse, success: successResponse } = responses;

/**
 * Get nft info handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @param {dbconnection} connection
 */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
  // eslint-disable-next-line no-useless-escape 
  context.callbackWaitsForEmptyEventLoop = false;

  let response: ApiSuccessResponse;
  let owner: Record<string, unknown> = {};
  let assets: Array<Record<string, unknown>> = [];
  const collaborators: Array<Record<string, unknown>> = [];
  const nftUid: string = event?.pathParameters?.uid;
  const nftRepo = new repositories.Nft(connection);
  const userRepo = new repositories.User(connection);

  try {
    // eslint-disable-next-line prefer-const
    let userId: number = parseInt(getUserId(context));
    const nft: Record<string, unknown> = await nftRepo.getByUid(nftUid, userId, true, true, true, true, null, true);
    const nftCollaborators: Array<Record<string, unknown>> = nftRepo.getNftCollaborators(nft);
    const nftAssets: Array<Record<string, unknown>> = nftRepo.getNftAssets(nft);
    const nftSmartContracts: Array<Record<string, unknown>> = nftRepo.getNftSmartContracts(nft);

    const collaboratorIds: Array<number> = nftCollaborators.map(collaborator => collaborator.dataValues.user_id);
    userId = nftRepo.getNftUserId(nft);
    const userIds: Array<number> = [userId, ...collaboratorIds];

    if (isValidArray(userIds) === true && userIds.includes(null) === false) {
      const users: Array<Record<string, unknown>> = await userRepo.getByIds(userIds);

      users.forEach(user => {
        const id: number = userRepo.getId(user);
        if (id === userId) {
          owner = user;
        } else {
          collaborators.push(user);
        }
      });
    }

    if (isValidArray(nftAssets) === true) {
      assets = nftAssets.map(nftAsset => {
        const updatedAsset = nftAsset.asset;
        updatedAsset['asset_type'] = nftAsset.asset_type;
        return updatedAsset;
      });
    }

    nft['owner'] = owner;
    nft['assets'] = assets;
    nft['collaborators'] = collaborators;
    nft['smartContracts'] = nftSmartContracts;

    response = await successResponse('Nft', serialize(nft));
  } catch (exp) {
    logger.error(exp);
    response = await errorResponse(exp);
  }
  return response;
};

/**
* Serialize nfts response
* @param {Object} data
*/
const serialize = (data: Record<string, any>) => {
  const serializerSchema = ({
    id: 'uid',
    attributes: [
      'tags',
      'owner',
      'title',
      'assets',
      'signature',
      'status',
      'createdAt',
      'properties',
      'description',
      'collaborators',
      'smartContracts',
      'total_editions',
      'lockable_content',
      'has_lockable_content',
    ],
    assets: {
      ref: 'uid',
      attributes: [
        'type',
        'asset_type',
        'bucket_name',
        'original_path',
        'thumbnail_path',
        'compressed_path',
      ],
    },
    collaborators: {
      ref: 'uid',
      attributes: ['username', 'picture', 'bio', 'twitter', 'facebook', 'instagram'],
    },
    owner: {
      ref: 'uid',
      attributes: ['username', 'picture', 'bio', 'twitter', 'facebook', 'instagram'],
    },
    smartContracts: {
      ref: 'uid',
      attributes: [
        'type',
        'address',
        'platform_name',
        'platform_logo',
        'token_protocol',
      ],
    },
    keyForAttribute: 'camelCase',
  });

  return new Serializer('Nft', serializerSchema).serialize(data);
}

/**
 * Request validation schema
 */
export const validationSchema = () =>
// eslint-disable-next-line no-useless-escape
({
  pathParameters: {
    uid: Vandium.types.string().trim().guid({ version: ['uuidv4'] }).required()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_info')),
  }
});
