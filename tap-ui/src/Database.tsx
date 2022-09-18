import {createRxDatabase, } from "rxdb";
import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb';
import { addRxPlugin } from 'rxdb';
import { RxDBReplicationCouchDBPlugin } from 'rxdb/plugins/replication-couchdb';
import pouchdb_adapter_http from "pouchdb-adapter-http";
import pouchdb_adapter_idb from "pouchdb-adapter-idb";
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';

addPouchPlugin(pouchdb_adapter_http);
addRxPlugin(RxDBReplicationCouchDBPlugin);
addPouchPlugin(pouchdb_adapter_idb);
addRxPlugin(RxDBLeaderElectionPlugin)

let dbPromise: any = null

async function _create() {
    const db = await createRxDatabase({
        name: 'clientdb',
        storage: getRxStoragePouch('idb'),
        ignoreDuplicate: true,
    });

    await db.addCollections({
        chats: {
            schema: {
                title: 'chat data',
                description: 'Database schema for realtime-chat',
                version: 0,
                primaryKey: 'message_id',
                type: 'object',
                properties: {
                    message_id: {
                        type: 'string',
                        final: true,
                        maxLength: 255,
                    },
                    message: {
                        type: 'string',
                    },
                }
            }
        }
    });

    const repState = db.chats.syncCouchDB({
        remote: 'http://localhost:5002/chatdb/chats',
        waitForLeadership: true,              // (optional) [default=true] to save performance, the sync starts on leader-instance only
        direction: {                          // direction (optional) to specify sync-directions
            pull: true, // default=true
            push: true  // default=true
        },
        options: {                             // sync-options (optional) from https://pouchdb.com/api.html#replication
            live: true,
            retry: true
        },
    });

    console.log('synced? ', repState);
    repState.active$.subscribe(value => console.log('sync active ', value));
    repState.alive$.subscribe(value => console.log('sync alive ', value));
    repState.change$.subscribe(value => console.log('sync change ', value));
    repState.denied$.subscribe(value => console.log('sync denied ', value));
    repState.error$.subscribe(value => console.log('sync error ', value));

    return db;
}

export async function getDb() {
    if (!dbPromise) dbPromise = await _create()
    return dbPromise
}
