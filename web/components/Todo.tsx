import { useState, FC, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Task, TaskList } from "../types";
import {
  CheckIcon,
  ChevronDownIcon,
  DocumentRemoveIcon,
  FolderRemoveIcon,
  MenuIcon,
  TrashIcon,
  UserRemoveIcon,
} from "@heroicons/react/solid";

interface Props {
  todo: Task;
  taskList: TaskList;
  onDelete: () => void;
}

const TaskMenu = ({ onDelete }) => {
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button className='max-w-xs justify-center w-5 h-5 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'>
          <MenuIcon className='w-5 h-5' aria-hidden='true' />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute z-50 right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='px-1 py-1 '>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onDelete}
                  className={`${
                    active ? "bg-slate-400 text-white" : "text-gray-900"
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  <TrashIcon className='w-5 h-5 mr-2' aria-hidden='true' />
                  Delete Task
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const Todo: FC<Props> = ({ todo, taskList, onDelete }) => {
  const [isCompleted, setIsCompleted] = useState(todo.complete);

  const toggle = async () => {
    setIsCompleted(!isCompleted);
    await fetch(`/apis/${taskList.id}/${todo.id}`, {
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
        <div className='flex gap-4'>
          <input
            className='cursor-pointer hover:border-blue-600 border-r-10 w-5 h-5'
            onChange={(e) => toggle()}
            type='checkbox'
            checked={isCompleted}
          />
          <TaskMenu onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default Todo;
