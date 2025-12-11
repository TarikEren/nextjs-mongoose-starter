import mongoose from "mongoose";

export interface PaginatedResult<T> {
    data: T[],
    currentPage: Number,
    totalPages: Number,
    shownResults: Number
}

// Create a DTO by taking the document type and removing its mongoose related keys
export type CreateDTO<T extends mongoose.Document> = Omit<T, keyof mongoose.Document>;
