import { cookies } from 'next/headers';

import ClientComponent from './client-component';

// 模拟从服务器获取数据
async function getServerData() {
    const cookieStore = cookies();

    // 从 cookie 中获取数据，如果没有则使用默认值
    const count = Number(cookieStore.get('count')?.value || '0');
    const userStr = cookieStore.get('user')?.value;
    const user = userStr
        ? JSON.parse(userStr)
        : { name: '张三', age: 25 };

    return {
        count,
        user
    };
}

export default async function IssueWithoutProvider() {
    const serverData = await getServerData();

    return (
        <div className="p-4">
            <h1>useHydrateAtoms 示例 (带 Cookie)</h1>
            <ClientComponent
                initialCount={serverData.count}
                initialUser={serverData.user}
            />
        </div>
    );
}

