import type { TaskList, Task } from "types";
import { dayFromNow, now, weekFromNow } from "./dates";

export const testTasks: TaskList[] = [
  {
    id: "1000",
    name: "Daily Tasks",
    createdAt: now(),
    tasks: [
      {
        id: "1001",
        name: "Walk the dog",
        description: "Walk the dog around the block",
        complete: false,
        createdAt: now(),
        dueDate: dayFromNow(),
      }
    ]
  },
  {
    id: "2000",
    name: "Work Tasks",
    createdAt: now(),
    tasks: [
      {
        id: "2001",
        name: "Write some code",
        description: "Writing a really cool serverless framework",
        complete: false,
        createdAt: now(),
        dueDate: weekFromNow(),
      },
      {
        id: "2002",
        name: "Test some code",
        description: "Testing a really cool serverless framework",
        complete: false,
        createdAt: now(),
        dueDate: dayFromNow(2),
      },
      {
        id: "2003",
        name: "Test some code",
        description: "Testing a really cool serverless framework",
        complete: false,
        createdAt: now(),
        dueDate: weekFromNow(3),
      },
      {
        id: "2004",
        name: "Test some code",
        description: "Testing a really cool serverless framework",
        complete: false,
        createdAt: now(),
        dueDate: weekFromNow(4),
      },
      {
        id: "2005",
        name: "Test some code",
        description: "Testing a really cool serverless framework",
        complete: false,
        createdAt: now(),
        dueDate: weekFromNow(5),
      },
    ]
  },
]