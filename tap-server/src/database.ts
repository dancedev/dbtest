import {addRxPlugin, createRxDatabase, RxDatabase,} from 'rxdb'
import pouchdb_adapter_leveldb from "pouchdb-adapter-leveldb";
import {addPouchPlugin, getRxStoragePouch} from "rxdb/plugins/pouchdb";
import { RxDBServerPlugin } from 'rxdb/plugins/server';
import leveldown from 'leveldown';

addPouchPlugin(pouchdb_adapter_leveldb); // leveldown adapters need the leveldb plugin to work
addRxPlugin(RxDBServerPlugin);

export class Database {

    private static db: RxDatabase;

    static async createDB(): Promise<RxDatabase> {
        this.db = await createRxDatabase({
            name: 'data/server-db',
            storage: getRxStoragePouch(leveldown),
            ignoreDuplicate: true,
        });

        try {
            await this.db.addCollections({
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
        } catch (e) {
            console.log('error: ', e);
        }

        console.log('server-db initialized.');

        this.db.chats.upsert({message_id: 'init', message: 'bla bla bla'});

        return this.db;
    }

    static async getDb(): Promise<RxDatabase> {
        return this.db;
    }
}
