export const validationMessages = {
  asset_info: {
    type: {
      'string.base': 'Provide a valid file type.',
      'any.empty': 'Provided file type is empty.',
      'string.empty': 'Provided file type is empty.',
      'any.only': 'Provided file type is not supported.',
      'any.required': 'File type is not provided.',
    },
    uid: {
      'any.empty': 'Provided asset identifier is empty.',
      'any.required': 'Provided asset identifier is invalid.',
      'string.base': 'Provide a valid asset identifier.',
      'string.empty': 'Provided asset identifier is invalid.',
      'string.guid': 'Provided asset identifier is invalid.',
    },
    extension: {
      'string.base': 'Provide a valid file extension.',
      'any.empty': 'Provided file extension is empty.',
      'string.empty': 'Provided file extension is empty.',
      'any.only': 'Provided file extension is not supported.',
      'any.required': 'File extension is not provided.',
    },
    name: {
      'string.base': 'Provide a valid asset name.',
      'any.empty': 'Provided asset name is empty.',
      'string.empty': 'Provided asset name is empty.',
      'any.required': 'Asset name is not provided.',
    },
    size: {
      'number.base': 'Provide a valid file size.',
      'any.empty': 'Provided file size is empty.',
      'number.empty': 'Provided file size is empty.',
      'number.integer': 'Provided file size is not an integer value',
      'number.max': 'Provided file size is greater than allowed limit',
      'any.required': 'File size is not provided.',
    },
    offset: {
      'number.empty': 'Provided offset is empty',
      'number.base': 'Provide a valid offset.',
      'number.integer': 'Provided offset is not an integer value',
      'number.min': 'Provided offset is lesser than allowed limit',
      'any.empty': 'Provided offset is empty',
    },
    limit: {
      'number.empty': 'Provided limit is empty',
      'number.base': 'Provide a valid limit.',
      'number.integer': 'Provided limit is not an integer value',
      'number.min': 'Provided limit is lesser than allowed limit',
      'any.empty': 'Provided limit is empty',
    },
    orderBy: {
      'string.empty': 'Provided orderBy is empty',
      'any.only': 'Provided orderBy value is invalid.',
      'any.empty': 'Provided orderBy is empty',
    },
    status: {
      'string.base': 'Provide a valid status.',
      'any.empty': 'Provided status is empty.',
      'string.empty': 'Provided status is empty.',
      'any.only': 'Provided status is invalid.',
      'any.required': 'Status is not provided.',
    },
    thumbnailPath: {
      'string.base': 'Provide a valid thumbnail path.',
      'string.empty': 'Provided thumbnail path is empty.',
      'any.empty': 'Provided thumbnail path is empty.',
      'any.required': 'Thumbnail path is not provided.',
    },
    originalPath: {
      'string.base': 'Provide a valid asset path.',
      'string.empty': 'Provided asset path is empty.',
      'any.empty': 'Provided asset path is empty.',
      'any.required': 'Asset path is not provided.',
    },
  },
  generic: {
    none: {
      'any.*': 'Provide valid request data.',
    },
  },
};
