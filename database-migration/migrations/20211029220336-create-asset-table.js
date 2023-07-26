/**
 * Migration to create assets table
 */

const { configs } = require('backend-utility');

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
  JPG, PNG, GIF, SVG,
} = IMAGE_EXTENTIONS;

const { DRAFT, PROCESSED } = enums.AssetStatus;

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('assets', {
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
      },
      'user_id': {
        type: sequelizeDataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
          deferrable: sequelizeDataTypes.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      'name': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
      },
      'type': {
        type: sequelizeDataTypes.ENUM,
        values: [THREED_MODEL, AUDIO, IMAGE, VIDEO],
        allowNull: false,
      },
      'file_extension': {
        type: sequelizeDataTypes.ENUM,
        values: [GIF, GLB, GLTF, JPG, MP3, MP4, MOV, PNG, SVG, WAV, WEBM],
        allowNull: true,
        defaultValue: null,
      },
      'size': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: false,
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
      'created_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: false,
      },
      'updated_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('assets');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_asset_type;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_asset_status;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_asset_file_extension;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
