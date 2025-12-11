import { CreateDTO } from "@/lib/definitions/types";
import { MongoServerError } from "mongodb";
import mongoose, { UpdateQuery, Document, Model, QueryFilter, QueryOptions } from "mongoose";

export interface IBaseRepository<T extends Document> {
    create(data: CreateDTO<T>): Promise<T | null>;
    findAll(filter: QueryFilter<T>, options: QueryOptions): Promise<T[]>;
    findById(id: String): Promise<T | null>;
    findOne(filter: QueryFilter<T>, options: QueryOptions): Promise<T | null>;
    update(id: String, data: UpdateQuery<T>): Promise<T | null>;
    delete(id: String): Promise<Boolean>;
}

export abstract class BaseRepository<T extends mongoose.Document> implements IBaseRepository<T> {
    protected readonly _model: Model<T>;

    constructor(model: Model<T>) {
        this._model = model
    }

    protected async handler<TResult>(
        operation: () => Promise<TResult>,
        operationName: String
    ): Promise<TResult> {
        try {
            return await operation();
        } catch (error) {
            console.error(`[${this._model.modelName}Repository] Error: ${error} in operation ${operationName}`);
            if (error instanceof MongoServerError && error.code === 11000) {
                throw new DuplicateKeyError()
            }
            throw new DatabaseError();
        }
    }

    async create(data: CreateDTO<T>): Promise<T | null> {
        return this.handler(
            async () => {
                const todo = new this._model(data);
                return await todo.save();
            }, "create");
    }

    async findById(id: String): Promise<T | null> {
        return this.handler(
            () => this._model.findById(id).exec(),
            "findById");
    }

    async findOne(filter: mongoose.QueryFilter<T>, options: QueryOptions): Promise<T | null> {
        return this.handler(
            () => this._model.findOne(filter, options).exec(),
            "findOne");
    }

    async findAll(filter: QueryFilter<T> = {}, options: QueryOptions = {}): Promise<T[]> {
        return this.handler(
            () => this._model.find(filter, null, options).exec(),
            "findAll");
    }

    async update(id: String, data: mongoose.UpdateQuery<T>): Promise<T | null> {
        return this.handler(() =>
            this._model.findByIdAndUpdate(id, data, { new: true }).exec(),
            "update");
    }

    async delete(id: String): Promise<boolean> {
        return this.handler(async () => {
            const result = await this._model.findByIdAndDelete(id).exec();
            return !!result;
        }, "delete");
    }
}
