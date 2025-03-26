'use client';

import Link from 'next/link';

export default function Comparison() {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">Jotai Query 实现对比</h1>

            <div className="space-y-8">
                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">1. 状态管理方式</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded">
                            <h3 className="font-bold text-lg mb-2">✨ Jotai + jotai-tanstack-query</h3>
                            <div className="text-gray-700 space-y-2">
                                <p>将查询逻辑封装在独立的 atom 中，组件通过 useAtom 直接获取数据和状态。这种方式将状态管理和数据查询逻辑紧密结合，提供了一种声明式的状态管理方式。</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <h3 className="font-bold text-lg mb-2">🔄 React Query + Jotai</h3>
                            <div className="text-gray-700 space-y-2">
                                <p>使用 React Query 的 useQuery 和 useInfiniteQuery，将查询逻辑直接嵌入组件中。状态管理主要依赖 React Query 的缓存机制，而 Jotai 仅用于管理简单的 userId 状态。</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">2. 代码组织</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded">
                            <h3 className="font-bold text-lg mb-2">✨ 封装在 atom 中</h3>
                            <div className="space-y-2">
                                <p className="text-gray-700">查询逻辑被封装在 atom 中，组件代码更加简洁：</p>
                                <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-auto">
                                    {`const userAtom = atomWithQuery((get) => ({
    queryKey: ['users', get(userIdAtom)],
    queryFn: async ({ queryKey: [, id] }) => {
        const res = await fetch(
            \`https://jsonplaceholder.typicode.com/users/\${id}\`
        );
        return res.json();
    },
}));`}
                                </pre>
                                <p className="text-green-600 mt-2">✓ 组件只需调用 useAtom(userAtom) 即可获取数据</p>
                                <p className="text-green-600">✓ 逻辑清晰，关注点分离</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <h3 className="font-bold text-lg mb-2">🔄 直接在组件中</h3>
                            <div className="space-y-2">
                                <p className="text-gray-700">查询逻辑直接写在组件中：</p>
                                <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-auto">
                                    {`const { data: user, isPending, isError } = 
    useQuery({
        queryKey: ['users', userId],
        queryFn: async () => {
            const res = await fetch(
                \`https://jsonplaceholder.typicode.com/users/\${userId}\`
            );
            return res.json();
        },
    });`}
                                </pre>
                                <p className="text-red-600 mt-2">⚠️ 组件同时包含 UI 和数据获取逻辑</p>
                                <p className="text-red-600">⚠️ 功能复杂时代码可能臃肿</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">3. 可重用性</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded">
                            <h3 className="font-bold text-lg mb-2">✨ atom 方式的优势</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>atom 是独立的，可在多个组件中重用</li>
                                <li>新组件只需调用 useAtom(userAtom)</li>
                                <li>无需重复编写查询逻辑</li>
                                <li>状态和查询逻辑集中管理</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <h3 className="font-bold text-lg mb-2">🔄 组件内查询的限制</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>查询逻辑与组件绑定</li>
                                <li>其他组件需要重新定义 useQuery</li>
                                <li>增加了代码重复率</li>
                                <li>降低了可重用性</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">4. 性能</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded">
                            <h3 className="font-bold text-lg mb-2">✨ Jotai 的优势</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>支持细粒度的状态更新</li>
                                <li>只有依赖特定 atom 的组件会重渲染</li>
                                <li>在复杂应用中性能更好</li>
                                <li>自动的状态同步机制</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <h3 className="font-bold text-lg mb-2">🔄 React Query 的特点</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>强大的缓存和性能优化</li>
                                <li>自动重试和预取功能</li>
                                <li>更新粒度不如 Jotai 灵活</li>
                                <li>可能导致不必要的组件重渲染</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">5. 实际示例</h2>
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            我们提供了两种实现方式的完整示例，您可以通过对比它们来理解各自的优势：
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="/jotai-showcase/query"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                查看 jotai-tanstack-query 实现
                            </Link>
                            <Link
                                href="/jotai-showcase/query/uncombined"
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                查看普通 React Query 实现
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
} 