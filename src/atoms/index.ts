import { atom } from "jotai";

// 计数器原子
export const countAtom = atom(0);

// 待办事项列表原子
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const todosAtom = atom<Todo[]>([]);

export const globalAtom = atom("global");
