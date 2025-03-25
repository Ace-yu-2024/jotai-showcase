'use client';

import {
    atom,
    createStore,
    Provider,
    useAtom,
} from 'jotai';

const outerStore = createStore();
const innerStore = createStore();
const commonAtom = atom(0);
const ownAtom = atom(0);
export default function ProviderCommonMistakeWorkaround1() {
    return <Provider store={outerStore}>
        <Content />
    </Provider>;
}

function Content() {
    const [commonAtomValue, setCommonAtomValue] = useAtom(commonAtom);
    const [ownAtomValue, setOwnAtomValue] = useAtom(ownAtom);
    return <div>
        <p>commonAtom's value: {commonAtomValue}</p>
        <button onClick={() => setCommonAtomValue(commonAtomValue + 1)}>+</button>
        <p>ownAtom's value: {ownAtomValue}</p>
        <button onClick={() => setOwnAtomValue(ownAtomValue + 1)}>+</button>
        <Provider store={innerStore}>
            <ChildComponent />
        </Provider>
    </div>;
}

function ChildComponent() {
    const [commonAtomValue, setCommonAtomValue] = useAtom(commonAtom, { store: outerStore });
    const [ownAtomValue, setOwnAtomValue] = useAtom(ownAtom);
    return <div>
        <p>commonAtom's value: {commonAtomValue}</p>
        <button onClick={() => setCommonAtomValue(commonAtomValue + 1)}>+</button>
        <p>ownAtom's value: {ownAtomValue}</p>
        <button onClick={() => setOwnAtomValue(ownAtomValue + 1)}>+</button>
    </div>;
}