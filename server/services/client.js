'use strict';

module.exports = ({ strapi }) => ({
  init() {
    const redis = strapi.redis.connections.default.client;

    const setRedisData = async ({ key, data, expiredInSeconds = 0 }) => {
      const newKey = `${strapi.redis.prefix}:${key}`;
      if (expiredInSeconds > 0) {
        return redis.setex(newKey, timeout, data);
      }
      return redis.set(newKey, data);
    };
    
    const getRedisData = async (key) => new Promise((resolve, reject) => {
      const newKey = `${strapi.redis.prefix}:${key}`;
      redis.get(newKey, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      })
    });
    
    const deleteRedisData = async (key) => {
      const newKey = `${strapi.redis.prefix}:${key}`;
      return redis.del(newKey)
    };
    
    const increment = async ({ key, expiredInSeconds = 0 }) => new Promise((resolve, reject) => {
      const newKey = `${strapi.redis.prefix}:${key}`;
    
      redis.incr(newKey, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        if (expiredInSeconds > 0) {
          redis.expire(newKey, expiredInSeconds);
        }

        resolve(data);
      })
    });
    
    const getTimeoutIncrementKey = async (key) => new Promise((resolve, reject) => {
      const newKey = `${strapi.redis.prefix}:${key}`;
      redis.ttl(newKey, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      })
    });
    
    const getUniqueProcess = async ({ key, expiredInSeconds = 0 }) => new Promise((resolve, reject) => {
      const newKey = `${strapi.redis.prefix}:${key}`;
    
      redis.incr(newKey, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        if (data === 1 && expiredInSeconds > 0) {
          redis.expire(newKey, expiredInSeconds);
        }

        resolve(data === 1);
      });
    });

    strapi.redis.client = {
      set: setRedisData,
      get: getRedisData,
      del: deleteRedisData,
      incr: increment,
      unique: getUniqueProcess,
      ttl: getTimeoutIncrementKey,
    };
  },
});
