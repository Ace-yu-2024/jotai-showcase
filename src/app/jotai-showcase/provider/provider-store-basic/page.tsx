'use client';

import {
    atom,
    createStore,
    Provider,
    useAtom,
} from 'jotai';

// 创建原子
const countAtom = atom(0);
countAtom.debugLabel = '计数器';

const messageAtom = atom('你好');
messageAtom.debugLabel = '消息';

// 创建两个独立的 store
const store1 = createStore();
const store2 = createStore();

// 子组件，显示计数器和消息
const Counter = () => {
    const [count, setCount] = useAtom(countAtom);
    const [message, setMessage] = useAtom(messageAtom);

    return (
        <div className="p-4 border rounded mb-4">
            <div>
                <p>计数: {count}</p>
                <button
                    onClick={() => setCount(c => c + 1)}
                    className="px-3 py-1 bg-blue-200 rounded mr-2"
                >
                    增加
                </button>
            </div>
            <div className="mt-2">
                <p>消息: {message}</p>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border px-2 py-1"
                />
            </div>
        </div>
    );
};

// 展示不同 Provider 和 Store 的组件
const ProviderDemo = () => {
    return (
        <div className="space-y-8">
            <div>
                <h2>默认 Provider（Provider-less 模式）:</h2>
                <Counter />
            </div>

            <div>
                <h2>Store 1:</h2>
                <Provider store={store1}>
                    <Counter />
                </Provider>
            </div>

            <div>
                <h2>Store 2:</h2>
                <Provider store={store2}>
                    <Counter />
                </Provider>
            </div>

            <div>
                <h2>嵌套 Provider:</h2>
                <Provider store={store1}>
                    <div className="border-l-4 pl-4">
                        <p>外层 Provider (Store 1)</p>
                        <Counter />

                        <Provider store={store2}>
                            <div className="border-l-4 pl-4 mt-4">
                                <p>内层 Provider (Store 2)</p>
                                <Counter />
                            </div>
                        </Provider>
                    </div>
                </Provider>
            </div>
        </div>
    );
};

export default function ProviderStore() {
    return (
        <div className="p-4">
            <h1>Provider 和 Store 示例</h1>
            <ProviderDemo />
            <button onClick={() => {
                store1.set(countAtom, 100);
            }}>
                通过 store1 设置 countAtom 的值
            </button>
            <button onClick={() => {
                store2.set(countAtom, 100);
            }}>
                通过 store2 设置 countAtom 的值
            </button>
        </div>
    );
}