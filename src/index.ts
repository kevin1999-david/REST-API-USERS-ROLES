import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";

import { User } from "./entity/User";

import * as cors from 'cors';
import * as helmet from 'helmet';

import routes from "./routes";


const PORT = process.env.PORT || 3000;

createConnection().then(async connection => {

    // create express app
    const app = express();

    // Middleware

    app.use(cors());
    app.use(helmet());

    app.use(bodyParser.json());

    //Routes

    app.use('/', routes);

    // register express routes from defined application routes
    // Routes.forEach(route => {
    //     (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
    //         const result = (new (route.controller as any))[route.action](req, res, next);
    //         if (result instanceof Promise) {
    //             result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

    //         } else if (result !== null && result !== undefined) {
    //             res.json(result);
    //         }
    //     });
    // });

    // setup express app here
    // ...

    // start express server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    });



}).catch(error => console.log(error));
