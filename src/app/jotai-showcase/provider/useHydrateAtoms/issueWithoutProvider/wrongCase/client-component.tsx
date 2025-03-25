'use client';

import {
  atom,
  createStore,
  Provider,
  useAtom,
} from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import Cookies from 'js-cookie';

// 创建原子
const countAtom = atom(0);
const userAtom = atom({ name: '', age: 0 });

interface User {
    name: string;
    age: number;
}

interface Props {
    initialCount: number;
    initialUser: User;
}

function ClientComponent({ initialCount, initialUser }: Props) {
    // 使用 useHydrateAtoms 注水服务器数据
    useHydrateAtoms([
        [countAtom, initialCount],
        [userAtom, initialUser]
    ] as const);

    // 使用原子
    const [count, setCount] = useAtom(countAtom);
    const [user, setUser] = useAtom(userAtom);

    // 更新 count 并保存到 cookie
    const handleCountChange = (newCount: number) => {
        console.log('newCount :', newCount);
        setCount(newCount);
        Cookies.set('count', String(newCount));
    };

    // 更新 user 并保存到 cookie
    const handleUserChange = (newUser: User) => {
        setUser(newUser);
        Cookies.set('user', JSON.stringify(newUser));
    };

    return (
        <div className="space-y-4">
            <div className="border p-4 rounded">
                <h2>计数器</h2>
                <p>当前值: {count}</p>
                <div className="space-x-2">
                    <button
                        onClick={() => handleCountChange(count + 1)}
                        className="px-3 py-1 bg-blue-200 rounded"
                    >
                        增加
                    </button>
                    <button
                        onClick={() => handleCountChange(count - 1)}
                        className="px-3 py-1 bg-red-200 rounded"
                    >
                        减少
                    </button>
                </div>
            </div>

            <div className="border p-4 rounded">
                <h2>用户信息</h2>
                <div>
                    <label>姓名：</label>
                    <input
                        value={user.name}
                        onChange={(e) => handleUserChange({ ...user, name: e.target.value })}
                        className="border px-2 py-1 ml-2"
                    />
                </div>
                <div className="mt-2">
                    <label>年龄：</label>
                    <input
                        type="number"
                        value={user.age}
                        onChange={(e) => handleUserChange({ ...user, age: Number(e.target.value) })}
                        className="border px-2 py-1 ml-2"
                    />
                </div>
            </div>

            <div className="mt-4 text-gray-600">
                <p>说明：</p>
                <ul className="list-disc pl-5">
                    <li>初始值从 Cookie 中读取</li>
                    <li>所有修改都会保存到 Cookie 中</li>
                    <li>刷新页面后会保持状态</li>
                </ul>
            </div>
        </div>
    );
}

const store = createStore();

export default function Wrapper(props: Props) {
    return (
        <Provider store={store}>
            <ClientComponent {...props} />
        </Provider>
    );
}
