'use client';

import {
    useEffect,
    useRef,
} from 'react';

import {
    atom,
    useAtom,
} from 'jotai';
import {
    useAtomsSnapshot,
    useGotoAtomsSnapshot,
} from 'jotai-devtools';

// 创建原子
const nameAtom = atom('张三');
nameAtom.debugLabel = '姓名';

const ageAtom = atom(25);
ageAtom.debugLabel = '年龄';

// 显示所有原子状态的组件
const RegisteredAtoms = () => {
    const atoms = useAtomsSnapshot();

    return (
        <div className="border p-4 my-4 rounded">
            <h3>当前原子状态：</h3>
            <p>原子数量：{atoms.values.size}</p>
            <div>
                {Array.from(atoms.values).map(([atom, value]) => (
                    <p key={`${atom.debugLabel}`}>
                        {`${atom.debugLabel}: ${value}`}
                    </p>
                ))}
            </div>
        </div>
    );
};

// 状态快照控制组件
const SnapshotController = () => {
    const snapshot = useAtomsSnapshot();

    useEffect(() => {
        if (snapshot.values.size > 0 && !ref.current) {
            ref.current = snapshot.values;
        }

    }, [snapshot.values])

    const ref = useRef();
    const goToSnapshot = useGotoAtomsSnapshot();

    const handleReset = () => {

        goToSnapshot({ values: ref.current, dependents: snapshot.dependents });
    };


    return (
        <div className="space-x-4">
            <button onClick={handleReset} className="px-4 py-2 bg-gray-200 rounded">
                重置状态
            </button>

        </div>
    );
};

// 用户信息编辑组件
const UserInfo = () => {
    const [name, setName] = useAtom(nameAtom);
    const [age, setAge] = useAtom(ageAtom);

    return (
        <div className="space-y-4">
            <div>
                <label>姓名：</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border px-2 py-1 ml-2"
                />
            </div>
            <div>
                <label>年龄：</label>
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="border px-2 py-1 ml-2"
                />
            </div>
        </div>
    );
};

export default function AtomsSnapshot() {
    return (
        <div className="p-4">
            <h1>原子状态快照示例</h1>
            <UserInfo />
            <RegisteredAtoms />
            <SnapshotController />
        </div>
    );
}