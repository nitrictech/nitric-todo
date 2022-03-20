import uuid from "short-uuid";
import {
  Filters,
  Task,
  TaskList,
  TaskListPostRequest,
  TaskPostRequest,
  ToggleRequest,
} from "types";
import { sortByCreatedAt } from "../common/utils";
import { taskListApi } from "../resources/apis";
import { taskListCol } from "../resources/collections";

const taskLists = taskListCol.for("reading", "writing", "deleting");

// Get a task from a task list
taskListApi.get("/:listid/:id", async (ctx) => {
  const { listid: listId, id } = ctx.req.params;

  try {
    const taskListRef = taskLists.doc(listId);
    const task = await taskListRef.collection<Task>("tasks").doc(id).get();

    ctx.res.json(task);
  } catch (err) {
    console.log(err);
    ctx.res.body = "Failed to retrieve tasks";
    ctx.res.status = 400;
  }

  return ctx;
});

// Get all tasks from a task list, with filters
taskListApi.get("/:listid", async (ctx) => {
  const { listid } = ctx.req.params;
  const filters = ctx.req.query as Filters;

  try {
    const taskListRef = taskLists.doc(listid);
    let query = taskListRef.collection<Task>("tasks").query();

    // Apply filters to query before executing query;
    Object.entries(filters).forEach(([k, v]) => {
      switch (k) {
        case "complete": {
          query = query.where(k, "==", v === "true");
          break;
        }

        case "dueDate": {
          query = query.where(k, ">=", v);
          break;
        }

        default: {
          query = query.where(k, "startsWith", v as string);
          break;
        }
      }
    });

    const taskList = await taskListRef.get();
    const tasks = await query.fetch();

    ctx.res.json({
      ...taskList,
      tasks: tasks.documents
        .map((doc) => ({ id: doc.id, ...doc.content }))
        .sort(sortByCreatedAt),
    });
  } catch (err) {
    console.log(err);
    ctx.res.body = "Failed to retrieve tasks";
    ctx.res.status = 400;
  }

  return ctx;
});

// Get all task lists and their tasks
taskListApi.get("/", async (ctx) => {
  try {
    const taskList = await taskLists.query().fetch();

    const taskListsWithTasks = await Promise.all(
      taskList.documents.map(async (doc) => {
        const { documents: tasks } = await taskLists
          .doc(doc.id)
          .collection<Task>("tasks")
          .query()
          .fetch();

        return {
          id: doc.id,
          ...doc.content,
          tasks: tasks
            .map(({ id, content }) => ({ id, ...content }))
            .sort(sortByCreatedAt),
        };
      })
    );

    ctx.res.json(taskListsWithTasks.sort(sortByCreatedAt));
  } catch (err) {
    console.log(err);
    ctx.res.body = "Failed to retrieve taskList list";
    ctx.res.status = 400;
  }

  return ctx;
});

// Make new task list, with optional tasks
taskListApi.post("/", async (ctx) => {
  const { name, tasks } = ctx.req.json() as TaskListPostRequest;

  try {
    if (!name) {
      ctx.res.body = "A new task list requires a name";
      ctx.res.status = 400;
      return;
    }

    const id = uuid.generate();

    await taskLists.doc(id).set({
      id,
      name,
      createdAt: new Date().getTime(),
    });

    // add any tasks if supplied
    if (tasks) {
      for (const task of tasks) {
        const taskId = uuid.generate();
        await taskLists
          .doc(id)
          .collection<Task>("tasks")
          .doc(taskId)
          .set({
            ...task,
            complete: false,
            createdAt: new Date().getTime(),
          });
      }
    }

    ctx.res.body = "Successfully added task list!";
  } catch (err) {
    console.log(err);
    ctx.res.body = "Failed to add task list";
    ctx.res.status = 400;
  }

  return ctx;
});

// Make new task for a task list
taskListApi.post("/:listid", async (ctx) => {
  const { listid } = ctx.req.params;
  const task = ctx.req.json() as TaskPostRequest;

  try {
    if (!listid) {
      ctx.res.body = "A task list id is required";
      ctx.res.status = 400;
      return;
    }

    if (!task || !task.name) {
      ctx.res.body = "A task with a name is required";
      ctx.res.status = 400;
      return;
    }

    const taskId = uuid.generate();

    await taskLists
      .doc(listid)
      .collection<Omit<Task, "id">>("tasks")
      .doc(taskId)
      .set({
        ...task,
        complete: false,
        createdAt: new Date().getTime(),
      });

    ctx.res.body = "Successfully added task!";
  } catch (err) {
    console.log(err);
    ctx.res.body = "Failed to add task list";
    ctx.res.status = 400;
  }

  return ctx;
});

// Update task as complete
taskListApi.patch("/:listid/:id", async (ctx) => {
  const { listid: listId, id } = ctx.req.params;
  const { completed } = ctx.req.json() as ToggleRequest;

  try {
    const taskListRef = taskLists.doc(listId);
    const taskRef = taskListRef.collection<Task>("tasks").doc(id);
    const originalTask = await taskRef.get();

    await taskListRef
      .collection<Task>("tasks")
      .doc(id)
      .set({
        ...originalTask,
        complete: completed,
      });

    ctx.res.body = "Successfully updated task";
  } catch (err) {
    console.log(err);
    ctx.res.body = "Failed to retrieve tasks";
    ctx.res.status = 400;
  }

  return ctx;
});

// Delete a task list with specified id
taskListApi.delete("/:id", async (ctx) => {
  const { id } = ctx.req.params;

  try {
    await taskLists.doc(id).delete();
    ctx.res.body = "Successfully deleted task list";
  } catch (err) {
    console.log(err);
    ctx.res.body = "Failed to delete task list";
    ctx.res.status = 400;
  }

  return ctx;
});

// Delete a task with specified id
taskListApi.delete("/:listid/:id", async (ctx) => {
  const { listid: listId, id } = ctx.req.params;

  try {
    const taskListRef = taskLists.doc(listId);
    await taskListRef.collection("tasks").doc(id).delete();
    ctx.res.body = "Successfully deleted task";
  } catch (err) {
    console.log(err);
    ctx.res.body = "Failed to delete task";
    ctx.res.status = 400;
  }

  return ctx;
});
