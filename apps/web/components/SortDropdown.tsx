import { FC, useState } from "react";

interface Props {
  sortFunc: ({ type: SortType }) => void;
}

export type SortType = "ascendingDue" | "descendingDue" | "ascendingCreated" | "descendingCreated";

const Dropdown: FC<Props> = ({
  sortFunc,
}) => {
  const [hidden, setHidden] = useState(false)

  const sortOptions: Record<string, SortType> = {
    "Created Ascending": "ascendingCreated",
    "Created Descending": "descendingCreated",
    "Due Date Ascending": "ascendingDue",
    "Due Date Descending": "descendingDue",
  }

  return (
    <div className="flex flex-row items-start">
      <p className="p-2 text-md b-orange-500 mb-2 text-center inline-flex items-center justify-center cursor-pointer">
        Sort by   <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
      </p>
      <div className={`flex items-center ${hidden ? "hidden" : ""}`}>
        {Object.entries(sortOptions).map(([name, type], idx) =>
          <p
            key={idx}
            className="p-2 text-slate-400 hover:bg-slate-50 hover:cursor-pointer rounded-full"
            onClick={() => sortFunc({ type })}
          >
            {name}
          </p>
        )}
      </div>
    </div>
  )
}

export default Dropdown;