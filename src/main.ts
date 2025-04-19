import { envs } from './common/config';
import { appServer, mongoDB } from './dependencies';

async function boostrap() {
    await mongoDB.connect({
        mongoUrl: envs.MONGO_DB_URL,
        dbName: envs.MONGO_DB_NAME,
    });

    appServer.start();
}

boostrap();