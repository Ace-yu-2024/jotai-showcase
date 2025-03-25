'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DirectoryItemProps {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: DirectoryItemProps[];
    level?: number;
}

export function Directory({ items }: { items: DirectoryItemProps[] }) {
    const pathname = usePathname();

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">站点目录</h2>
            <div className="space-y-2">
                {items.map((item, index) => (
                    <DirectoryItem
                        key={index}
                        {...item}
                        level={0}
                        currentPath={pathname}
                    />
                ))}
            </div>
        </div>
    );
}

function DirectoryItem({
    name,
    path,
    type,
    children,
    level = 0,
    currentPath
}: DirectoryItemProps & { currentPath: string }) {
    const [isOpen, setIsOpen] = useState(true);
    const pagePath = path.split('/app')[1]?.replace('/page.tsx', '') || '/';
    const isActive = currentPath === pagePath;

    return (
        <div style={{ marginLeft: `${level * 20}px` }}>
            <div className="flex items-center">
                {type === 'directory' && children?.length ? (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-4 text-gray-500 focus:outline-none"
                    >
                        {isOpen ? '▼' : '▶'}
                    </button>
                ) : (
                    <span className="w-4" />
                )}

                {type === 'file' ? (
                    <Link
                        href={pagePath}
                        className={`ml-2 hover:text-blue-500 ${isActive ? 'text-blue-600 font-bold' : ''}`}
                    >
                        {name}
                    </Link>
                ) : (
                    <span className="ml-2 font-semibold">{name}</span>
                )}
            </div>

            {isOpen && children && (
                <div className="mt-1">
                    {children.map((child, index) => (
                        <DirectoryItem
                            key={index}
                            {...child}
                            level={level + 1}
                            currentPath={currentPath}
                        />
                    ))}
                </div>
            )}
        </div>
    );
} 