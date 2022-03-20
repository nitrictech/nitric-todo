import Head from "next/head";
import useSWR from "swr";
import type { TaskList } from "types";
import fetcher from "../lib/fetcher";
import TodoList from "../components/TodoList";
import { useState } from "react";

export default function Web() {
  const [newListName, setNewListName] = useState("");
  const { data, mutate: updateTaskList } = useSWR<TaskList[]>(
    `https://8ao5gespxc.execute-api.ap-southeast-1.amazonaws.com`,
    fetcher
  );

  const loading = !data;

  const handleAddList = async () => {
    await fetch(`https://8ao5gespxc.execute-api.ap-southeast-1.amazonaws.com`, {
      method: "POST",
      body: JSON.stringify({
        name: newListName,
      }),
    });
    updateTaskList();
  };

  return (
    <div>
      <Head>
        <title>Nitric Todo List</title>
        <meta name='description' content='Nitric Quickstart for Next.js' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='p-10 mx-auto max-w-4xl flex flex-col items-center gap-8'>
        <h1 className='text-6xl font-bold mb-4 text-center'>To-do List</h1>
        {loading ? (
          <div
            className='align-center justify-center flex flex-col w-24 h-24 rounded-full animate-spin
                    border-4 border-dashed border-orange-500 border-t-transparent'
          />
        ) : (
          <>
            {data.map((taskList) => (
              <TodoList
                key={taskList.id}
                taskList={taskList}
                updateTaskList={updateTaskList}
              />
            ))}
            <input
              className='rounded w-full p-2'
              type='text'
              placeholder='Enter New List Name'
              value={newListName}
              onChange={(evt) => setNewListName(evt.target.value)}
            />
            <button
              disabled={!newListName}
              className='rounded-xl disabled:bg-slate-300 text-white bg-orange-600 hover:bg-orange-500 w-full p-4'
              onClick={handleAddList}
            >
              Add List
            </button>
          </>
        )}
      </main>
    </div>
  );
}
