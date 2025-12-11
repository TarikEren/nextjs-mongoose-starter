# NextJS Mongoose Starter
NOTE: This repository is meant to be used as boilerplate, not as a full fledged app.

Prerequisites:
    - Create a `.env` or `.env.local` file at the root of your project and add a `DB_URL` field that contains your
connection string.
    - Run ```bash
    npm i
    ```
    to install the required packages.

Run:
```bash
npm run dev
```
to start

## Models
The codebase requires interfaces that extend the class `mongoose.Document` that will be used in the creation of the model
and the generic base classes.

Take for example, a to-do app, in which we need to define a to-do interface that extends `mongoose.Document`
and a `mongoose.Schema` to create our model.

We can create the interface and the model as such:

```typescript
    interface ITodoModel extends mongoose.Document {
        // Fields
    }

    const todoSchema = new mongoose.Schema<ITodoModel>({
        // Fields
    })

    const Todo = mongoose.models.Todo // In case the model already exists, use the existing one
        || mongoose.Model<ITodoModel>("Todo", todoSchema); // Else, create a new one
```

- The backend is comprised of repository and service layers, each containing a `base` class.

## Repository Layer
The codebase contains a generic `baseRepository` class that is to be extended by other, specific repositories.

Using our to-do app example, the `baseRepository` class would be extended as such to create a to-do repository:

```typescript
    class todoRepository extends baseRepository<ITodoModel> // We created ITodoModel above, refer to section `Models`
    {
        // Additional operations in case it's necessary
    }
```

## Service Layer
The codebase also contains a generic `baseService` class that is to be extended by other, specific services.

Using the same example, the `baseService` class would be extended as such to create a to-do service:

```typescript
    class todoService extends baseService<ITodoModel> // The interface created above
    {
        // Additional operations in case it's necessary
    }
```

## Custom Errors
The codebase contains custom error classes that extend the standard `Error` class. There are 2 main error types:
`AppError` and `HTTPError`.

`AppError` refers to errors that are raised in case of an internal error (Invalid configuration, couldn't connect to DB etc.)

`HTTPError` refers to errors that the client should see. The `HTTPError` class contains an extra `statusCode` field.
