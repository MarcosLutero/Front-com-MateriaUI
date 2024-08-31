import { Client } from 'minio';

type StorageConfig = {
    STORAGE_ENDPOINT: string;
    STORAGE_PORT: number;
    STORAGE_USE_SSL: boolean;
    STORAGE_ACCESS_KEY: string;
    STORAGE_SECRET_KEY: string;
};

export const storage = (config: StorageConfig) => {    
    return new Client({
        endPoint: config.STORAGE_ENDPOINT,
        port: config.STORAGE_PORT,
        useSSL: config.STORAGE_USE_SSL,
        accessKey: config.STORAGE_ACCESS_KEY,
        secretKey: config.STORAGE_SECRET_KEY
    });
};

export default storage;
