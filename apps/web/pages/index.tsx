import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";
import type { TaskList } from "types";
import fetcher from "../lib/fetcher";
import TodoList from "../components/TodoList";

export default function Web() {
  const [pagingToken, setPagingToken] = useState(null);
  const { data, mutate } = useSWR<TaskList[]>("/apis/taskList", fetcher);

  const loading = !data;

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
          data.map((taskList) => (
            <TodoList key={taskList.id} taskList={taskList} />
          ))
        )}
      </main>

      <footer></footer>
    </div>
  );
}
