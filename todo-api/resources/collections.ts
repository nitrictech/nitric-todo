import { collection } from '@nitric/sdk';
import { TaskList } from 'types';

type TaskCollection = Omit<TaskList, "tasks">;

export const taskListCol = collection<TaskCollection>("task-collection");