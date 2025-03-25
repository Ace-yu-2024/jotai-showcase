'use client';

import {
    atom,
    useAtom,
} from 'jotai';
import { useAtomsDebugValue } from 'jotai-devtools/utils';

// 创建原子并添加调试标签
const textAtom = atom('你好');
textAtom.debugLabel = 'textAtom';

const lenAtom = atom((get) => get(textAtom).length);
lenAtom.debugLabel = 'lenAtom';

// 调试组件
const DebugAtoms = () => {
    useAtomsDebugValue();
    return null;
};

// 文本输入组件
const TextBox = () => {
    const [text, setText] = useAtom(textAtom);
    const [len] = useAtom(lenAtom);

    return (
        <div>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="请输入文本"
            />
            <span>（长度：{len}）</span>
        </div>
    );
};

export default function UseAtomsDebugValue() {
    return (
        <div>
            <h1>useAtomsDebugValue 示例</h1>
            <DebugAtoms />
            <TextBox />
        </div>
    );
}