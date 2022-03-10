import { Task } from "types";

type CreatedAtData = Pick<Task, "createdAt">;

export const sortByCreatedAt = (a: CreatedAtData, b: CreatedAtData) => {
  return a.createdAt < b.createdAt ? 1 : -1;
};
