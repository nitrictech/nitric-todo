import { FC } from 'react';

interface Props {
  text: string;
}

const Alert: FC<Props> = ({ text }) => (
  <div className="rounded-md bg-red-100 p-4 my-3">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
)

export default Alert;