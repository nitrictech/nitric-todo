# To-do List

This is a [Next.js](https://nextjs.org/) project that uses a [Nitric API](https://nitric.io/docs/apis) with [Nitric Collections](https://nitric.io/docs/collections) to store and display data. It also uses [Tailwind CSS](https://tailwindcss.com/) for styling and [Turborepo](https://turborepo.org/) for the build system.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Nitric CLI](/docs/installation.mdx)

## Set up the Next.js app

Clone the [Nitric To-do](https://github.com/nitrictech/nitric-todo) repository.

```bash
git clone https://github.com/nitrictech/nitric-todo
```

Install the dependencies:

```text
cd nitric-todo
yarn install
```

## Project structure

This project is split into three main area:

- **apis** - This is where nitric APIs are stored
- **apps** - This is where your web applications are stored
- **packages** - This is where shared common code is stored (such as types and configuration)

## Whats in our API

### Routing

There are a number of endpoints set up to retrieve and update tasks from the frontend.

```typescript
import { api } from '@nitric/sdk';

const taskListApi = api("taskList");

taskListApi.get("/:listid/:id", async (ctx) => {});      // Get task with [id]
taskListApi.get("/:id", async (ctx) => {);               // Get task list with [id]
taskListApi.get("/", async (ctx) => {});                 // Get all task lists
taskListApi.post("/:id", async (ctx) => {});             // Post new task for task list
taskListApi.post("/", async (ctx) => {});                // Post new task list
taskListApi.patch("/:listid/:id", async (ctx) => {});    // Update task
taskListApi.delete("/:id", async (ctx) => {});           // Delete task list
taskListApi.delete("/:listid/:id", async (ctx) => {});   // Delete task
```

We create a new collection resource that has permissions to read, write and delete

```typescript
import { api, collection } from '@nitric/sdk';
import { TaskList } from "types";

type TaskCollection = Omit<TaskList, "tasks">

const taskListCol = collection<TaskCollection>("taskLists").for(
  "reading",
  "writing",
  "deleting",
);
```

Now that we have the collection, we can start adding tasks and task lists. We use subcollections for each of our task lists and documents for each of our tasks.

We can put a new task to a task list by adding a new document to the task list subcollection.

```typescript
taskListApi.post("/:id", async (ctx) => {
  const { id } = ctx.req.params;
  const task = ctx.req.json() as TaskPostRequest;

  const taskId = uuid.generate();

  await taskListCol
    .doc(id)
    .collection<Omit<Task, "id">>("tasks")
    .doc(taskId)
    .set({
      ...task,
      complete: false,
      createdAt: new Date().getTime(),
    });

  ...
```

Within our `/:listid/:id` endpoint we can start retrieving tasks.

```typescript
// Get a task from a task list
taskListApi.get("/:listid/:id", async (ctx) => {
  const { listid: listId, id } = ctx.req.params;

  try {
    // Get our task list with id [listId]
    const taskListRef = taskListCol.doc(listId); 
    // Get all tasks from the collection with id [id]
    const task = await taskListRef.collection<Task>("tasks").doc(id).get();

    ctx.res.json(task);
  } catch (err) {
    console.log(err);
    ctx.res.body = "Failed to retrieve tasks";
    ctx.res.status = 400;
  }

  return ctx;
});

```

### Set up API proxy

Next, you'll want to run your application locally. Start by create your `.env` file by renaming the `.env.example` file:

```
mv web/apps/.env.example web/apps/.env
```

This holds your `API_BASE_URL` variable, which is used to proxy between your universal Next.js API route (configured under rewrites in next.config.js) and your Nitric APIs.

## Run the App

Run the app with the following command:

```bash
yarn dev
```

> This will use turbo repo to run both your nextjs app and the nitric todo api

Open your browser at `localhost:3000` to see the running application.

If you make any changes to the API or App, hot reloading is enabled so the API will rebuild.

## Deploying

### Deploy the Nitric API

Setup your credentials and any other cloud specific configuration:

- [AWS](/docs/reference/aws)
- [Azure](/docs/reference/azure)

Run the appropriate deployment command

> Warning: Publishing services to the cloud may incur costs.
> AWS

```bash
nitric stack up functions/*.ts --provider aws
```

Azure

```bash
nitric stack up functions/*.ts --provider azure
```

When the deployment is complete, go to the relevant cloud console and you'll be able to see and interact with your API.

To undeploy run the following command.

```bash
nitric stack down
```

### Deploy the Next.js App

Choose one of the following deploy buttons and make sure to update the `API_BASE_URL` variable during this setup process.

#### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nitrictech/nextjs-starter&env=DATABASE_URL)

#### Deploy on Netlify

\*Note: The `Netlify.toml` file in this repository includes the configuration for you to customize the `API_BASE_URL` property on the initial deploy.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/nitrictech/nextjs-starter)

## Learn more

To learn more about Nitric, take a look at our [docs website](https://nitric.io/docs) which contains quick start guides and reference documentation.

## Need help?

Get help from [Nitric's support team](https://nitric.io/docs/support), or join our [GitHub Discussion board](https://github.com/nitrictech/nitric/discussions) to see how others are using Nitric.

