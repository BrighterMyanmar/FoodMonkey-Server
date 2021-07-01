const AsyncRedis = require('async-redis');
const RedisDB = AsyncRedis.createClient();

module.exports = {
    setObj: async (id, body) => await RedisDB.set(id.toString(), JSON.stringify(body)),
    getObj: async (id) => JSON.parse(await RedisDB.get(id.toString())),
    dropObj: async (id) => await RedisDB.del(id.toString()),
    publish: async (channel, value) => await RedisDB.publish(channel.toString, JSON.stringify(value))
}