import express from "express";
import {Database} from "./database";
import {v4 as uuidv4} from 'uuid';


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


    return server;
}


async function sub() {

    console.log('lets start');
    let lastobj: any;

    await Database.getDb().then(async db => {
        console.log('subscribing...')
        db.chats.$.subscribe((changeEvent: any) => {
            console.log('client is speaking: ', changeEvent);

            if (!lastobj || (lastobj && lastobj.message_id !== changeEvent.documentData.message_id))
            {
                lastobj = {message_id: uuidv4(), message: 'got message ' + changeEvent.documentData.message_id};
                db.chats.upsert(lastobj);
            }

        });
    });
}

initialize().then(() => {

    console.log('continue');
    sub();
});


