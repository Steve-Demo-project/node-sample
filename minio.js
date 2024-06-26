var Minio = require("minio");
const {minio} = require('../env');

exports.minioClient = new Minio.Client({
    endPoint: minio.MINIO_URL,
    port: minio.MINIO_PORT,
    useSSL: minio.MINIO_USE_SSL,
    accessKey: minio.MINIO_ACCESSKEY,
    secretKey: minio.MINIO_SECRETKEY
});

