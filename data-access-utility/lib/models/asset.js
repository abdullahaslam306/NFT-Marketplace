const { configs } = require('backend-utility');
const { Sequelize } = require('sequelize');

const { enums } = configs;
const {
  AUDIO, IMAGE, THREED_MODEL, VIDEO,
} = enums.AssetTypes;

const { DRAFT, PROCESSED } = enums.AssetStatus;

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
  JPG, PNG, GIF, SVG, JPEG,
} = IMAGE_EXTENTIONS;

module.exports = (sequelize, sequelizeDataTypes) => {
  const assets = sequelize.define('asset', {
    'id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    'uid': {
      type: sequelizeDataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: { isUUID: 4 },
      defaultValue: sequelizeDataTypes.UUIDV4,
    },
    'user_id': {
      type: sequelizeDataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    'name': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    'type': {
      type: sequelizeDataTypes.ENUM,
      values: [THREED_MODEL, AUDIO, IMAGE, VIDEO],
      allowNull: true,
      defaultValue: null,
    },
    'file_extension': {
      type: sequelizeDataTypes.ENUM,
      values: [GIF, GLB, GLTF, JPG, JPEG, MP3, MP4, MOV, PNG, SVG, WAV, WEBM],
      allowNull: true,
      defaultValue: null,
    },
    'size': {
      type: sequelizeDataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    'original_path': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'thumbnail_path': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'compressed_path': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'status': {
      type: sequelizeDataTypes.ENUM,
      values: [DRAFT, PROCESSED],
      allowNull: false,
      defaultValue: DRAFT,
    },
    'bucket_name': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    timestamps: true,
    paranoid: false,
  });

  assets.associate = (models) => {
    assets.belongsTo(models.user, { foreignKey: 'user_id' });
  };

  return assets;
};
