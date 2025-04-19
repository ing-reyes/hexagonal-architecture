import mongoose from "mongoose";

interface Options {
    mongoUrl: string,
    dbName: string,
}
export class MongoDB {
    async connect(options: Options){
        const { dbName, mongoUrl } = options;
        try {
            await mongoose.connect(mongoUrl, {dbName});
            console.log('Mongo Database Connected')
            return true;
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}