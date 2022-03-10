import { FC, useState, useEffect } from 'react'
import { TaskList, TaskPostRequest } from 'types'
import Alert from './Alert';
import Todo from './Todo';

interface Props {
  taskList: TaskList;
}


const TodoList: FC<Props> = ({ taskList }) => {
  const [todos, setTodos] = useState(taskList.tasks)
  const [newTask, setNewTask] = useState<TaskPostRequest>({ name: "" })
  const [errorText, setError] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
  }

  const addTodo = async (taskText) => {
  }

  const deleteTodo = async (id) => {
  }

  return (
    <div className="w-full">
      <h1 className="font-bold">{taskList.name}</h1>
      <div className="flex gap-2 my-2">
        <input
          className="rounded w-full p-2"
          type="text"
          placeholder="make coffee"
          value={newTask.name}
          onChange={(e) => {
            setError('')
            setNewTask(task => ({...task, name: e.target.value}))
          }}
        />
        <input
          className="rounded w-fit p-2"
          type="date"
          onChange={(e) => {
            setError('')
            setNewTask(task => ({...task, dueDate: e.target.value }))
          }}
        />
        <button className="btn-black hover:bg-slate-100 p-1 rounded-md" onClick={() => addTodo(newTask)}>
          Add
        </button>
      </div>
      {!!errorText && <Alert text={errorText} />}
      <div className="bg-white shadow overflow-hidden rounded-md mb-10">
        <ul>
          {todos.map((todo) => (
            <Todo key={todo.id} todo={todo} onDelete={() => deleteTodo(todo.id)} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TodoList;