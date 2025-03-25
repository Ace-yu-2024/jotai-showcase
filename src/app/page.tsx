import { join } from 'path';

import { Directory } from './components/Directory';
import { generateDirectory } from './utils/directory';

export default function Home() {
    // 生成目录结构
    const directory = generateDirectory(join(process.cwd(), 'src/app'));

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">欢迎来到 Jotai 示例</h1>
            <Directory items={directory} />
        </div>
    );
}
