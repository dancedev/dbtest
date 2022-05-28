import express from "express";
import { Database } from "./database";

let server: any;

async function initialize() {
    const mainApp = express();

    await Database.createDB().then(async (db) => {
        const {app} = await db.server({
            startServer: false,
            cors: true,
        });

        mainApp.use("/chatdb", app);

    }).catch(() => console.log('error'));


    mainApp.use("/import", (req, res) => {

        res.send("importing...")
    });


    server = mainApp.listen(5002, () => console.log(`Server listening on port 5002`));

    await Database.getDb().then(async db => {
        console.log('subscribing...')
        db.$.subscribe((changeEvent: any) => {
            console.log('server is speaking: ', changeEvent);
        });
        db.$.subscribe(event => console.log('event: ', event));
    });
}

initialize();
