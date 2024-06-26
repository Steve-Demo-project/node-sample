// Environment variables to setup connection
const fs = require('fs');
const envPath = './.env';

try{
    fs.accessSync(envPath, fs.R_OK);
    require('dotenv-safe').config({
        example: envPath
    });    
}
catch(e){
}
module.exports = {
    env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: parseInt(process.env.PORT),
        CIRCLE_API_ROOT_URL: process.env.CIRCLE_API_ROOT_URL
    },
    mysql: {
        database: process.env.MYSQL_DATABASE,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        host: process.env.MYSQL_HOST,
        pool: {
            max_connections: parseInt(process.env.MYSQL_MAX_CONNECTIONS),
            min_connections: parseInt(process.env.MYSQL_MIN_CONNECTIONS),
            connection_acquire_time: parseInt(process.env.MYSQL_CONNECTION_ACQUIRE_TIME),
            connection_idle_time: parseInt(process.env.MYSQL_CONNECTION_IDLE_TIME)
        }
    },
    mongo: {
        MONGO_URI: process.env.MONGO_URI
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL,
        port: parseInt(process.env.RABBITMQ_PORT),
        username: process.env.RABBITMQ_USER_NAME,
        password: process.env.RABBITMQ_PASSWORD,
        ORDERQUEUE: process.env.ORDERQUEUE,
        CARTQUEUE: process.env.CARTQUEUE,
        STOCK_URL: process.env.STOCK_URL,
        CIRCLE_URL: process.env.CIRCLE_URL
    },
    minio: {
        BUCKET_NAME: process.env.MINIO_BUCKET_NAME,
        MINIO_URL: process.env.MINIO_URL,
        MINIO_PORT: parseInt(process.env.MINIO_PORT),
        MINIO_USE_SSL: process.env.MINIO_USE_SSL == 'true',
        MINIO_ACCESSKEY: process.env.MINIO_ACCESSKEY,
        MINIO_SECRETKEY: process.env.MINIO_SECRETKEY
    },
    algolia :{
        ADMINAPIKEY: process.env.ADMINAPIKEY,
        APPLICATIONID: process.env.APPLICATIONID,
        INDEX : process.env.INDEX
    }
}