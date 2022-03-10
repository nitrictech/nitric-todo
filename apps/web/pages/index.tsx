import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";
import type { TaskList } from '../../../packages/types/index';
import fetcher from "../lib/fetcher";
import TodoList from '../components/TodoList';
import { testTasks } from '../lib/testTodos';

export default function Web() {
  const [pagingToken, setPagingToken] = useState(null);
  const data = testTasks;
  // const { data, mutate } = useSWR<TaskList>(`/apis/main/shirts`, fetcher);

  const loading = !data;

  return (
    <div>
      <Head>
        <title>Nitric Todo List</title>
        <meta name='description' content='Nitric Quickstart for Next.js' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='p-10 mx-auto max-w-4xl'>
        <h1 className='text-6xl font-bold mb-4 text-center'>Todo List</h1>
        <p className='mb-20 text-xl text-center'>
        </p>
        {data.map((taskList, idx) => <TodoList key={idx} taskList={taskList}/>)}
      </main>

      <footer></footer>
    </div>
  );
}
