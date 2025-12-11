/*
 * Simple custom error classes
 * `AppError` refers to errors that occur in the backend, they aren't supposed to be directly shown to the end user.
 *      They are designed to be used in tandem with errors that inherit the HTTPError class
 * `HTTPError` errors are to be used in API responses.
 */

class AppError extends Error {
    constructor(message: string) {
        super(message)
    }
}

class DatabaseError extends AppError {
    // Internal database errors
    // If caught, throw an InternalServerError
    constructor() {
        super(`Internal database error`);
    }
}

class DuplicateKeyError extends AppError {
    // MongoDB 11000 error (Duplicate key)
    // Catch this and throw a ConflictError instead for the client to see
    constructor() {
        super(`Duplicate key`);
    }
}

class HTTPError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

class InternalServerError extends HTTPError {
    constructor() {
        super("Internal server error", 500);
    }
}

class ValidationError extends HTTPError {
    constructor(field: string) {
        super(`Validation error on field ${field}`, 400);
    }
}

class UnauthorizedError extends HTTPError {
    constructor() {
        super("Unauthorized", 401);
    }
}

class ForbiddenError extends HTTPError {
    constructor() {
        super("Forbidden", 403);
    }
}

class NotFoundError extends HTTPError {
    constructor(target: string) {
        super(`${target} not found`, 404);
    }
}

class ConflictError extends HTTPError {
    constructor() {
        super("Conflict", 409);
    }
}
