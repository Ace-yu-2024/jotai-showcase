'use client';

import {
    atom,
    createStore,
    Provider,
    useAtom,
} from 'jotai';

const store = createStore();
const commonAtom = atom(0);
export default function ProviderCommonMistake() {
    const [commonAtomValue, setCommonAtomValue] = useAtom(commonAtom);
    return <div>
        <p>commonAtom's value: {commonAtomValue}</p>
        <button onClick={() => setCommonAtomValue(commonAtomValue + 1)}>+</button>
        <Provider store={store}>
            <ChildComponent />
        </Provider>
    </div>;
}

function ChildComponent() {
    const [commonAtomValue, setCommonAtomValue] = useAtom(commonAtom);
    return <div>
        <p>commonAtom's value: {commonAtomValue}</p>
        <button onClick={() => setCommonAtomValue(commonAtomValue + 1)}>+</button>
    </div>;
}