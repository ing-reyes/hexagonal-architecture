import { appServer, mongoDB } from './container';
import { envs } from './shared/config';

async function boostrap() {
    await mongoDB.connect({
        mongoUrl: envs.MONGO_DB_URL,
        dbName: envs.MONGO_DB_NAME,
    });

    appServer.start();
}

boostrap();