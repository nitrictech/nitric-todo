export interface Task {
  id: string;
  name: string;
  complete: boolean;
  description?: string;
  dueDate?: Date;
}

export interface TaskList {
  tasks: Task[];
}

export type ShirtsPostRequest = Omit<Task, "id">;
