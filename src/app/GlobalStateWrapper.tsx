'use client';

import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';

import { globalAtom } from '../atoms';

export function GlobalStateWrapper() {
    const [global, setGlobal] = useAtom(globalAtom);
    const pathname = usePathname();
    if (!pathname?.startsWith('/jotai-showcase/devtool')) return null;
    return <div style={{
        marginTop: '100px',
    }}>
        <div>global atom value: {global}</div>
        <button onClick={() => setGlobal('new value')}>set global</button>
    </div>;
} 