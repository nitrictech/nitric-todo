export interface Task {
  id: string;
  name: string;
  complete: boolean;
  description?: string;
  dueDate?: Date;
}

export interface TaskListResponse {
  tasks: Task[];
}

export type Filters = Partial<Task>;

export type TaskListRequest = Filters

export type TaskPostRequest = Omit<Task, "id" | "complete">;
