'use client';

import {
  atom,
  Provider,
  useAtom,
} from 'jotai';

import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// 创建 QueryClient 实例
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5000, // 5秒后数据过期
        },
    },
});
export default function Query() {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider>
                <div className="p-4 max-w-4xl mx-auto space-y-4">
                    <h1 className="text-2xl font-bold mb-6">React Query 示例</h1>
                    <UserInfo />
                    <PostsList />
                </div>
            </Provider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}

// 用户 ID 的 Jotai Atom
const userIdAtom = atom(1);

// 用户信息组件
function UserInfo() {
    const [userId, setUserId] = useAtom(userIdAtom);

    // 使用 useQuery 获取用户信息
    const { data: user, isPending, isError } = useQuery({
        queryKey: ['users', userId],
        queryFn: async () => {
            const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
            if (!res.ok) throw new Error('获取用户失败');
            return res.json();
        },
    });

    if (isPending) return <div className="text-gray-600">加载中...</div>;
    if (isError) return <div className="text-red-500">加载失败</div>;

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">用户信息</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => setUserId((id) => Math.max(1, id - 1))}
                        className="px-3 py-1 bg-gray-100 rounded"
                    >
                        上一个
                    </button>
                    <button
                        onClick={() => setUserId((id) => id + 1)}
                        className="px-3 py-1 bg-gray-100 rounded"
                    >
                        下一个
                    </button>
                </div>
            </div>
            <div>
                <p>姓名: {user.name}</p>
                <p>邮箱: {user.email}</p>
                <p>电话: {user.phone}</p>
            </div>
        </div>
    );
}

// 帖子列表组件
function PostsList() {
    // 使用 useInfiniteQuery 获取帖子列表
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=5`
            );
            return res.json();
        },
        getNextPageParam: (_, allPages) => allPages.length + 1,
        initialPageParam: 1,
    });

    // 使用 useMutation 创建帖子
    const { mutate: createPost, isPending: isCreating } = useMutation({
        mutationKey: ['createPost'],
        mutationFn: async (newPost: { title: string; body: string }) => {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify({
                    ...newPost,
                    userId: 1,
                }),
                headers: {
                    'Content-type': 'application/json',
                },
            });
            return res.json();
        },
        // 可选：成功后刷新帖子列表
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const handleCreatePost = () => {
        createPost({
            title: '新帖子',
            body: '这是一个新帖子的内容',
        });
    };

    return (
        <div className=" p-4 rounded-lg shadow">
            < div className="flex justify-between items-center mb-4" >
                <h2 className="text-xl font-bold">帖子列表</h2>
                <button
                    onClick={handleCreatePost}
                    disabled={isCreating}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    {isCreating ? '创建中...' : '创建帖子'}
                </button>
            </div >
            <div className="space-y-4">
                {data?.pages.map((page, i) => (
                    <div key={i}>
                        {page.map((post) => (
                            <div key={post.id} className="p-3 border-b">
                                <h3 className="font-bold">{post.title}</h3>
                                <p className="text-gray-600">{post.body}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                className="mt-4 px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
                {isFetchingNextPage
                    ? '加载中...'
                    : hasNextPage
                        ? '加载更多'
                        : '没有更多数据'}
            </button>
        </div >
    );
}