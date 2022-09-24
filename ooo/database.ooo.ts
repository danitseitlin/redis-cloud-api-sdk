import { Client } from "../api/api.base";
import { Database } from "../api/database";
import { DatabaseCreationParameters, DatabaseUpdateParameters } from "../types/parameters/database";
import { DatabaseResponse } from "../types/responses/database";
import { TaskResponse } from "../types/task";
import { DatabaseParser } from "./parser/database.parser";

class DatabaseOOO {
    subscriptionId = -1;
    isDeleted = false;
    parser: DatabaseParser = new DatabaseParser();
    api: Database
    constructor(subscriptionId: number, protected client: Client) {
        this.subscriptionId = subscriptionId;
        this.api = new Database(this.client);
    }
    async create(createParameters: DatabaseCreationParameters): Promise<this> {
        const response = await this.api.createDatabase(this.subscriptionId, createParameters);
        this.parser.databaseId = response.resourceId;
        return this;
    }
    async update(updateParameters: DatabaseUpdateParameters): Promise<this> {
        await this.api.updateDatabase(this.subscriptionId, this.parser.databaseId, updateParameters);
        await this.get();
        return this;
    }
    async delete(): Promise<this> {
        await this.api.deleteDatabase(this.subscriptionId, this.parser.databaseId);
        await this.api.waitForDatabaseStatus(this.subscriptionId, this.parser.databaseId, 404);
        this.isDeleted = true;
        return this
    }
    async get(): Promise<this> {
        if(this.parser.databaseId === -1) {
            this.databaseDoesNotExistError("DatabaseOOO", "get");
        }
        const response = await this.api.getDatabase(this.subscriptionId, this.parser.databaseId);
        this.parser.load(response);
        return this;
    }

    databaseIsDeletedError(className: string, functionName: string) {
        throw new Error(`${className}: ${functionName}: Cannot perform action on deleted database.`)
    }

    databaseDoesNotExistError(className: string, functionName: string) {
        throw new Error(`${className}: ${functionName}: Cannot perform get database information before it was created. Please use the 'create' function beforehead.`)
    }

}