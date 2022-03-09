import { api, collection } from '@nitric/sdk';
import { Task } from 'types';

const taskApi = api('tasks');
const tasksCollection = collection('todo').for('reading', 'writing', 'deleting');

taskApi.get('/task/:id', async (ctx) => {
  const { id } = ctx.req.params; 

  const task: Task = await tasksCollection.doc(id).get();

  ctx.res.body = task
});