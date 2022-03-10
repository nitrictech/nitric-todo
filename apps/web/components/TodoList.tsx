import { FC, useState, useEffect, useReducer } from "react";
import { TaskList, Task, TaskPostRequest } from "types";
import { now } from "../lib/dates";
import Alert from "./Alert";
import SortDropdown, { SortType } from "./SortDropdown";
import Todo from "./Todo";

interface Props {
  taskList: TaskList;
}

function todoSort(state: Task[], action): Task[] {
  switch(action.type as SortType) {
    case 'ascendingDue':
      return state.sort((a, b) => b.dueDate - a.dueDate);
    case "descendingDue":
      return state.sort((a, b) => a.dueDate - b.dueDate);
    case "ascendingCreated":
      return state.sort((a, b) => b.createdAt - a.createdAt);
    case "descendingCreated":
      return state.sort((a, b) => a.createdAt - b.createdAt);
    default:
      console.log("Sort type doesn't exist");
  }
};

const TodoList: FC<Props> = ({ taskList }) => {
  const [todos, dispatchTodos] = useReducer(todoSort, taskList.tasks);
  const [newTask, setNewTask] = useState<TaskPostRequest>({
    name: "",
    complete: false,
    createdAt: now(),
  });
  const [errorText, setError] = useState("");

  const addTodo = async (newTask: TaskPostRequest) => {
    await fetch(`/apis/taskList/${taskList.id}`, {
      method: "POST",
      body: JSON.stringify(newTask),
    });
  };

  const deleteTodo = async (listId: string, taskId: string) => {
    await fetch(`/apis/taskList/${listId}/${taskId}`, {
      method: "DELETE",
    });
  };

  return (
    <div className='w-full'>
      <div>
        <h1 className='font-bold'>{taskList.name}</h1>
        <SortDropdown sortFunc={dispatchTodos} />
      </div>
      <button onClick={() => dispatchTodos({ type: "ascendingCreated" })}>
        Click{" "}
      </button>
      <div className='flex gap-2 my-2'>
        <input
          className='rounded w-full p-2'
          type='text'
          placeholder='New task'
          value={newTask.name}
          onChange={(e) => {
            setError("");
            setNewTask((task) => ({ ...task, name: e.target.value }));
          }}
        />
        <input
          className='rounded w-1/4 p-2'
          type='date'
          onChange={(e) => {
            setError("");
            setNewTask((task) => ({
              ...task,
              dueDate: new Date(e.target.value).getTime(),
            }));
          }}
        />
        <button
          className='rounded-full bg-orange-200 hover:bg-orange-300 w-1/6'
          onClick={() => addTodo(newTask)}
        >
          Add
        </button>
      </div>
      {!!errorText && <Alert text={errorText} />}
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
