import { useState, FC } from "react";
import { Task, TaskList } from "types";

interface Props {
  todo: Task;
  taskList: TaskList;
  onDelete: () => void;
}

const Todo: FC<Props> = ({ todo, taskList }) => {
  const [isCompleted, setIsCompleted] = useState(todo.complete);

  const toggle = async () => {
    setIsCompleted(!isCompleted);
    await fetch(`/${taskList.id}/${todo.id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed: !isCompleted }),
    });
  };

  const formatDate = (date: number) =>
    new Date(date).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div
      className={`w-full block cursor-pointer hover:bg-slate-200 focus:outline-none focus:bg-slate-200 transition duration-150 ease-in-out`}
    >
      <div className='flex items-center px-4 py-4 sm:px-6'>
        <div className='min-w-0 flex-1 flex items-left flex-col'>
          <div className='text-md font-medium truncate'>{todo.name}</div>
          {todo.dueDate && (
            <div className='text-sm font-medium truncate text-slate-400'>
              Due: {formatDate(todo.dueDate)}
            </div>
          )}
        </div>
        <div>
          <input
            className='cursor-pointer hover:border-blue-600 border-r-10 w-5 h-5'
            onChange={(e) => toggle()}
            type='checkbox'
            checked={isCompleted}
          />
        </div>
      </div>
    </div>
  );
};

export default Todo;
