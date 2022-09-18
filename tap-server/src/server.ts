import express from "express";
import {Database} from "./database";
import {v4 as uuidv4} from 'uuid';
import {RoundService} from "./services/round.service";

let server: any;

async function initialize() {
    const mainApp = express();

    console.log('create database');
    await Database.createDB().then(async (db) => {
        const {app} = await db.serverCouchDB({
            path: 'data',
            cors: true,
            port: 5002,
            startServer: false,
        });

        mainApp.use("/chatdb", app);

    }).catch(() => console.log('error'));


    mainApp.use("/import", (req, res) => {

        res.send("importing...")
    });


    server = mainApp.listen(5002, () => console.log(`Server listening on port 5002`));

    return server;
}

initialize().then(async () => {

    console.log('get database')
    let lastObj: any;

    await Database.getDb().then(async db => {
        console.log('subscribing...');
        db.chats.$.subscribe((changeEvent: any) => {
            console.log('client is speaking: ', changeEvent.documentData.message);

            if (!lastObj || (lastObj && lastObj.message_id !== changeEvent.documentData.message_id)) {
                lastObj = {message_id: uuidv4(), message: 'got message ' + changeEvent.documentData.message_id};
                console.log('insert reply to database');
                db.chats.upsert(lastObj);
            }
        });
    });


    console.log('start wf')
    const rs = new RoundService();
    await rs.createWorkflow();
    rs.startWorkflow();
});


