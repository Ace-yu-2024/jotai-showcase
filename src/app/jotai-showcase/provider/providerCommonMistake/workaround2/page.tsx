'use client';

import {
    atom,
    useAtom,
} from 'jotai';
import { ScopeProvider } from 'jotai-scope';

const commonAtom = atom(0);
const ownAtom = atom(0);
export default function ProviderCommonMistakeWorkaround1() {
    return <Content />
    // 也可以显示声明外层Provider
    // return <ScopeProvider atoms={[commonAtom]}>
    //     <Content />
    // </ScopeProvider>;
}

function Content() {
    const [commonAtomValue, setCommonAtomValue] = useAtom(commonAtom);
    const [ownAtomValue, setOwnAtomValue] = useAtom(ownAtom);
    return <div>
        <p>commonAtom's value: {commonAtomValue}</p>
        <button onClick={() => setCommonAtomValue(commonAtomValue + 1)}>+</button>
        <p>ownAtom's value: {ownAtomValue}</p>
        <button onClick={() => setOwnAtomValue(ownAtomValue + 1)}>+</button>
        <ScopeProvider atoms={[ownAtom]}>
            <ChildComponent />
        </ScopeProvider>
    </div>;
}

function ChildComponent() {
    const [commonAtomValue, setCommonAtomValue] = useAtom(commonAtom);
    const [ownAtomValue, setOwnAtomValue] = useAtom(ownAtom);
    return <div>
        <p>commonAtom's value: {commonAtomValue}</p>
        <button onClick={() => setCommonAtomValue(commonAtomValue + 1)}>+</button>
        <p>ownAtom's value: {ownAtomValue}</p>
        <button onClick={() => setOwnAtomValue(ownAtomValue + 1)}>+</button>
    </div>;
}