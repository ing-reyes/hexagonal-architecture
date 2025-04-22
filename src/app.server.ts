import express from 'express';
import morgan from 'morgan';
import { RoutesFactory } from './routes.factory';
import cors from 'cors';
interface Options {
    port: number;
}

export class AppServer {
    private readonly app = express();
    private readonly port: number;
    constructor(
        private readonly options: Options,
        private readonly routesFactory: RoutesFactory,
    ){ 
        const { port = 3000 } = options;
        this.port = port;
    }
    start(){
        
        this.app.use(express.json());
        this.app.use((req, _, next)=>{
            req.body = req.body ?? {};
            next();
        });
        this.app.use(express.urlencoded({extended: true}));

        this.app.use(cors());
        this.app.use(morgan('dev'));

        this.app.use( this.routesFactory.routes );

        this.app.listen(this.port, ()=>{
            console.log(`Server running on port ${ this.port }`);
        })
    }
}