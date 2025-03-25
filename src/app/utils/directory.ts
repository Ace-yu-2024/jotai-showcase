import {
  readdirSync,
  statSync,
} from 'fs';
import { join } from 'path';

interface DirectoryItem {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: DirectoryItem[];
}

export function generateDirectory(path: string): DirectoryItem[] {
  const items = readdirSync(path);
  const result: DirectoryItem[] = [];

  for (const item of items) {
    // 忽略以下划线或点开头的文件/目录
    if (item.startsWith("_") || item.startsWith(".")) continue;

    const fullPath = join(path, item);
    const stats = statSync(fullPath);

    // 忽略非目录的系统文件
    if (!stats.isDirectory() && !item.endsWith(".tsx") && !item.endsWith(".ts"))
      continue;

    if (stats.isDirectory()) {
      const children = generateDirectory(fullPath);
      // 只有当目录包含有效的页面组件时才添加
      if (children.length > 0) {
        result.push({
          name: formatName(item),
          path: fullPath.replace(/\\/g, "/"),
          type: "directory",
          children,
        });
      }
    } else if (item === "page.tsx") {
      // 将目录添加为页面
      result.push({
        name: formatName(path.split("/").pop()!),
        path: fullPath.replace(/\\/g, "/"),
        type: "file",
      });
    }
  }

  return result;
}

function formatName(str: string): string {
  // 移除文件扩展名
  str = str.replace(/\.[^/.]+$/, "");
  // 将连字符和下划线转换为空格
  str = str.replace(/[-_]/g, " ");
  // 将首字母大写
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function generateBreadcrumb(path: string): string[] {
  return path
    .split("/")
    .filter((item) => item !== "src" && item !== "app" && item !== "page.tsx")
    .map(formatName);
}
