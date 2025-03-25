import ClientComponent from './client-component';

// 模拟从服务器获取数据
async function getServerData() {
    // 模拟API调用
    return {
        count: 42,
        user: { name: '张三', age: 25 }
    };
}

export default async function UseHydrateAtoms() {
    // 在服务器端获取数据
    const serverData = await getServerData();

    return (
        <div className="p-4">
            <h1>useHydrateAtoms 示例</h1>
            <ClientComponent
                initialCount={serverData.count}
                initialUser={serverData.user}
            />
        </div>
    );
}

