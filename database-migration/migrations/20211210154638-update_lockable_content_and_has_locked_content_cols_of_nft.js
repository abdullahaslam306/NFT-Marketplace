/**
 * Migration to rename column lockable_content and has_lockable_content to unloackable_content and has_unloackable_content
 */

const up = async queryInterface => {
  await queryInterface.renameColumn('nfts', 'lockable_content', 'unlockable_content');
  await queryInterface.renameColumn('nfts', 'has_lockable_content', 'has_unlockable_content');
};

const down = async queryInterface => {
  await queryInterface.renameColumn('nfts', 'unlockable_content', 'lockable_content');
  await queryInterface.renameColumn('nfts', 'has_unlockable_content', 'has_lockable_content');
};

module.exports = {
  up,
  down,
};
