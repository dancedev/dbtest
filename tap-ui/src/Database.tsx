import pouchdb_adapter_memory from "pouchdb-adapter-memory";
import {addRxPlugin, createRxDatabase} from "rxdb";
import {addPouchPlugin, getRxStoragePouch} from "rxdb/plugins/pouchdb";
import { RxDBReplicationCouchDBPlugin } from 'rxdb/plugins/replication-couchdb';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import * as PouchHttpPlugin from 'pouchdb-adapter-http';

addPouchPlugin(pouchdb_adapter_memory);
addPouchPlugin(PouchHttpPlugin);
addRxPlugin(RxDBReplicationCouchDBPlugin);
addRxPlugin(RxDBLeaderElectionPlugin);


let dbPromise: any = null

async function _create() {
    const db = await createRxDatabase({
        name: 'clientdb',
        storage: getRxStoragePouch('memory'),
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
                        final: true
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
        options: {
            live: true,
            retry: true,
        },
    });

    console.log('synced? ', repState)

    return db;
}

export async function getDb() {
    if (!dbPromise) dbPromise = await _create()
    return dbPromise
}

