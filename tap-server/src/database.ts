import {
    addPouchPlugin,
    addRxPlugin,
    createRxDatabase,
    getRxStoragePouch,
    RxDatabase,
} from 'rxdb'
import {RxDBServerPlugin} from 'rxdb/plugins/server'
import * as LeveldownAdapter from 'pouchdb-adapter-leveldb';
import leveldown from 'leveldown';

addRxPlugin(RxDBServerPlugin)
addPouchPlugin(LeveldownAdapter)

export class Database {

    private static db: RxDatabase;

    static async createDB(): Promise<RxDatabase> {
        this.db = await createRxDatabase({
            name: 'server-db',
            storage: getRxStoragePouch(leveldown),
            ignoreDuplicate: true,
        });

        await this.db.waitForLeadership();
        console.log('isLeader now');

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
