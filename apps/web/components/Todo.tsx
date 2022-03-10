import { useState, FC } from 'react';
import { Task } from '../../../packages/types/index';
import { dayFromNow, now } from '../lib/dates';

interface Props { 
  todo: Task;
  onDelete: () => void;
}

const Todo: FC<Props> = ({ todo, onDelete }) => {
  const [isCompleted, setIsCompleted] = useState(todo.complete)

  const toggle = async () => {
  }

  const withinTimeRange = (timeRange: number): boolean => dayFromNow(timeRange).getTime() - now().getTime() < 0

  const backgroundColor = withinTimeRange(1) ? "bg-amber-200" : withinTimeRange(3) ? "bg-amber-200" : "bg-gray-200"

  const formatDate = (date: Date) => date.toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
  return (
    <li
      onClick={(e) => {
        e.preventDefault()
        toggle()
      }}
      className={`w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:${backgroundColor} transition duration-150 ease-in-out`}
    >
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex items-left flex-col">
          <div className="text-sm leading-5 font-medium truncate">{todo.name}</div>
          <div className="text-sm leading-6 font-medium truncate text-slate-400">Due: {formatDate(todo.dueDate)}</div>
        </div>
        <div>
          <input
            className="cursor-pointer border-r-10"
            onChange={(e) => toggle()}
            type="checkbox"
            checked={isCompleted}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
          className="w-4 h-4 ml-2 border-2 hover:border-black rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="gray">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  )
}

export default Todo;