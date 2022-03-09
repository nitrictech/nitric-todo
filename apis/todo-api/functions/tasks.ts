import { api, collection } from '@nitric/sdk';
import { Task, TaskListRequest, TaskPostRequest } from 'types';
import uuid from 'short-uuid';

const taskApi = api('tasks');
const tasksCollection = collection<Task>('todo').for('reading', 'writing', 'deleting');

// Get a single task via its id
taskApi.get('/task/:id', async (ctx) => {
  const { id } = ctx.req.params; 

  try {
    const task = await tasksCollection.doc(id);

    ctx.res.json(task);
  } catch (err) {
    console.log(err);
    ctx.res.body = "Failed to retrieve task";
    ctx.res.status = 400;
  }

  return ctx;
});

// Get all tasks, with filters
taskApi.get('/tasks', async (ctx) => {
  const filters = ctx.req.json() as TaskListRequest;

  try {
    let query = tasksCollection.query()
    
    // Apply filters to query before executing query;
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        switch (k) {
          case 'complete':
            query.where(k, '==', v as boolean);
          case 'dueDate':
            query.where(k, '>=', v.toString());
          default:
            query.where(k, 'startsWith', v as string)
        }
      });
    }

    const taskList = await query.fetch()

    ctx.res.json(taskList);
  } catch (err) {
    console.log(err);
    ctx.res.body = "Failed to retrieve task list";
    ctx.res.status = 400;
  }

  return ctx;
})

// Make new task
taskApi.post('/task', async (ctx) => {
  const taskData = ctx.req.json() as TaskPostRequest;
  try {
    const id = uuid.generate();

    await tasksCollection.doc(id).set({
      id,
      complete: false,
      ...taskData,
    });

    ctx.res.body = "Successfully added task!";
  } catch (err) {
    console.log(err);
    ctx.res.body = "Failed to add task";
    ctx.res.status = 400;
  }

  return ctx;
});

// Delete a task with specified id
taskApi.delete('/task/:id', async (ctx) => {
  const { id } = ctx.req.params;

  try {
    await tasksCollection.doc(id).delete();
    ctx.res.body = "Successfully delete task";
  } catch (err) {
    console.log(err);
    ctx.res.body = "Failed to delete task";
    ctx.res.status = 400;
  }

  return ctx;
});