'use strict';

module.exports = {
  default: {
    redis: {
      config: {
        connections: {
          default: {
            connection: {
              host: '127.0.0.1',
              port: 6379,
              db: 0,
              username: 'default',
              password: '',
              unixSocket: '',
            },
            settings: {
              prefix: '',
            },
          },
        },
      },
    },
  },
  validator() {},
};
