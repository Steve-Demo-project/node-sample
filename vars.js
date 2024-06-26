const {env,mongo,minio} = require('../env'); // Environment variables imported

module.exports = {
  env: env.NODE_ENV || 'development',
  port: env.PORT,
  host: env.CIRCLE_API_ROOT_URL,
  mongo: {
    uri:
      env.NODE_ENV === "test"
        ? mongo.MONGO_URI_TESTS
        : mongo.MONGO_URI
  },
  bucketName: minio.BUCKET_NAME
};