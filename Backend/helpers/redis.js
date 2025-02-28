const redis = require('redis');
require("dotenv").config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000) 
    }
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
    if (err.code === 'ECONNRESET' || err.code === 'SOCKETCLOSED') {
        console.log('Attempting to reconnect...');
        setTimeout(() => redisClient.connect(), 5000); // Retry after 5 seconds
    }
});

redisClient.on('connect', () => console.log("Connected to Redis")); 

redisClient.on('end', () => console.log("Redis connection closed"));

redisClient.connect().catch((err) => console.error("Redis connection failed:", err));

module.exports = redisClient;
