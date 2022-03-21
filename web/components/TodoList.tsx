import { FC, useState, useEffect } from "react";
import { TaskList, Task, TaskPostRequest } from "types";
import { now } from "../lib/dates";
import Todo from "./Todo";

interface Props {
  taskList: TaskList;
  updateTaskList: () => void;
}

const TodoList: FC<Props> = ({ taskList, updateTaskList }) => {
  const [todos, setTodos] = useState<Task[]>(taskList.tasks);
  const [newTask, setNewTask] = useState<TaskPostRequest>({
    name: "",
    complete: false,
    createdAt: now(),
  });

  useEffect(() => {
    if (taskList) {
      setTodos(taskList.tasks);
    }
  }, [taskList]);

  const addTodo = async (newTask: TaskPostRequest) => {
    await fetch(`/apis/${taskList.id}`, {
      method: "POST",
      body: JSON.stringify(newTask),
    });
    updateTaskList();
  };

  const deleteTodo = async (listId: string, taskId: string) => {
    await fetch(`/apis/${listId}/${taskId}`, {
      method: "DELETE",
    });
    updateTaskList();
  };

  return (
    <div className='w-full'>
      <div>
        <h2 className='font-bold'>{taskList.name}</h2>
      </div>
      <div className='flex gap-2 my-2 sm:flex-row flex-col'>
        <input
          className='rounded w-full p-2'
          type='text'
          placeholder='Enter New task'
          value={newTask.name}
          onChange={(e) => {
            setNewTask((task) => ({ ...task, name: e.target.value }));
          }}
        />
        <input
          className='rounded w-full sm:w-72 p-2'
          type='date'
          onChange={(e) => {
            setNewTask((task) => ({
              ...task,
              dueDate: new Date(e.target.value).getTime(),
            }));
          }}
        />
        <button
          className='rounded-xl disabled:bg-slate-300 w-full sm:w-48 text-white bg-orange-600 hover:bg-orange-500 p-2'
          disabled={!newTask.name}
          onClick={() => addTodo(newTask)}
        >
          Add
        </button>
      </div>
      <div className='bg-white shadow overflow-hidden rounded-md mb-10'>
        <ul>
          {todos.map((todo) => (
            <Todo
              taskList={taskList}
              key={todo.id}
              todo={todo}
              onDelete={() => deleteTodo(taskList.id, todo.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
