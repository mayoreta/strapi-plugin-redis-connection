'use strict';

module.exports = async ({ strapi }) => {
  // Load plugin Config
  const coreConfig = strapi.config.get('plugin.redis');

  // Construct Redis API
  strapi.redis = {
    config: coreConfig,
    prefix: '',
    connections: {},
    client: {},
  };

  await strapi.plugin('redis').service('connection').init(coreConfig);

  await strapi.plugin('redis').service('client').init();
};
