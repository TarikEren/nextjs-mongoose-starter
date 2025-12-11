import mongoose, { QueryFilter, QueryOptions, UpdateQuery } from "mongoose";
import { IBaseRepository } from "../repositories/baseRepository";
import { CreateDTO } from "@/lib/definitions/types";

export interface IBaseService<T extends mongoose.Document> {
    create(data: CreateDTO<T>): Promise<T | null>;
    findOne(filter: QueryFilter<T>, options: QueryOptions): Promise<T | null>;
    findById(id: String): Promise<T | null>;
    findAll(filter: QueryFilter<T>, options: QueryOptions): Promise<T[]>;
    update(id: String, data: UpdateQuery<T>): Promise<T | null>;
    delete(id: String): Promise<Boolean>;
}

export class BaseService<T extends mongoose.Document> implements IBaseService<T> {
    constructor(protected readonly repository: IBaseRepository<T>) { }

    protected async handler<TResult>(operation: () => Promise<TResult>, operationName: String) {
        try {
            return operation();
        } catch (error) {
            console.error(`[Service] Failed operation ${operationName}: ${String(error)}`);
            if (error instanceof DuplicateKeyError) {
                throw new ConflictError();
            }
            throw new InternalServerError();
        }
    }

    async create(data: CreateDTO<T>): Promise<T | null> {
        return this.handler(
            async () => {
                return this.repository.create(data);
            }, "create");
    }

    async findOne(filter: QueryFilter<T>, options: QueryOptions): Promise<T | null> {
        return this.handler(
            async () => {
                return this.repository.findOne(filter, options);
            }, "findOne");
    }

    async findById(id: String): Promise<T | null> {
        return this.handler(
            async () => {
                return this.repository.findById(id);
            }, "findById");
    }

    async findAll(filter: mongoose.QueryFilter<T>, options: QueryOptions): Promise<T[]> {
        return this.handler(
            async () => {
                return this.repository.findAll(filter, options);
            }, "findAll");
    }

    async update(id: String, data: mongoose.UpdateQuery<T>): Promise<T | null> {
        return this.handler(
            async () => {
                return this.repository.update(id, data);
            }, "update");
    }

    async delete(id: String): Promise<Boolean> {
        return this.handler(
            async () => {
                return this.repository.delete(id);
            }, "delete");
    }
}
