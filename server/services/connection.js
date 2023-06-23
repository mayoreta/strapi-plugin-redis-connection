'use strict';

const { createClient } = require('redis');

module.exports = ({ strapi }) => ({
  init(config) {
    const coreConfig = config;

    // Loop through all connections and start building and mounting them
    Object.keys(coreConfig.connections).forEach((name) => {
      let client = {};
      const nameConfig = coreConfig.connections[name];
      strapi.redis.prefix = nameConfig.settings.prefix;

      if (nameConfig.connection.unixSocket) {
        try {
          client = createClient({
            path: nameConfig.connection.unixSocket,
            db: nameConfig.connection.db,
        })
        } catch (e) {
          strapi.log.error(e.error());
        }

      // Check for regular single connection
      } else {
        try {
          client = createClient({
            host: nameConfig.connection.host,
            port: nameConfig.connection.port,
            username: nameConfig.connection.username,
            password: nameConfig.connection.password,
            db: nameConfig.connection.db,
            tls: nameConfig.connection.tls ? {} : null,
          });
        } catch (e) {
          strapi.log.error(e.error());
        }
      }
        
      client.on('connect', () => {
        strapi.log.info('Client connected to redis...');
      });
    
      client.on('ready', () => {
        strapi.log.info('Client ready to redis...');
      });
    
      client.on('error', (err) => {
        strapi.log.error(err);
      });

      strapi.redis.connections[name] = {
        client,
      };
    });
  },
});
