import { FC } from "react";

interface Props {
  sortFunc: ({ type: SortType }) => void;
}

export type SortType = "ascendingDue" | "descendingDue" | "ascendingCreated" | "descendingCreated";

const Dropdown: FC<Props> = ({
  sortFunc,
}) => {

  const sortOptions: Record<string, SortType> = {
    "Created Ascending": "ascendingCreated",
    "Created Descending": "descendingCreated",
    "Due Date Ascending": "ascendingDue",
    "Due Date Descending": "descendingDue",
  }

  return (
    <ul className="" >
      {Object.entries(sortOptions).map(([name, type], idx) => 
        <li
          key={idx}
          className="p-2 bg-slate-50 hover:bg-slate-100 hover:cursor-pointer"
          onClick={() => sortFunc({ type })}
        >
          {name}
        </li>
      )}
    </ul>
  )
}

export default Dropdown;