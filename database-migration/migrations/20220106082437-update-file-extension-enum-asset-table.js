/**
 *Migration - Adding new enum value jpeg in file_extension column in table.
 */

const { configs } = require('backend-utility');

const { enums } = configs;

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
module.exports = {

  up: (queryInterface, sequelize) => queryInterface.sequelize.query(`ALTER TYPE enum_assets_file_extension RENAME TO enum_assets_file_extension_old;
    CREATE TYPE enum_assets_file_extension AS ENUM('${GIF}', '${GLB}', '${GLTF}','${JPEG}', '${JPG}' ,'${MP3}','${MP4}', '${MOV}', '${PNG}', '${SVG}', '${WAV}','${WEBM}');
    ALTER TABLE assets ALTER COLUMN file_extension TYPE enum_assets_file_extension USING file_extension::text::enum_assets_file_extension;
    DROP TYPE enum_assets_file_extension_old;`),

  down: (queryInterface, sequelize) => queryInterface.sequelize.query(`ALTER TYPE enum_assets_file_extension RENAME TO enum_assets_file_extension_old;
    CREATE TYPE enum_assets_file_extension AS ENUM('${GIF}', '${GLB}', '${GLTF}', '${JPG}', '${MP3}', '${MP4}', '${MOV}', '${PNG}', '${SVG}', '${WAV}','${WEBM}');
    ALTER TABLE assets ALTER COLUMN file_extension TYPE enum_assets_file_extension USING file_extension::text::enum_assets_file_extension;
    DROP TYPE enum_assets_file_extension_old;`),
};
