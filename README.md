# Jotai 示例集合

## 📁 目录结构

```ini
src/app/jotai-showcase/
├── family/                 # atomFamily 相关示例
│   └── page.tsx           # - atom 家族和缓存机制
├── query/                  # 查询相关示例
│   ├── page.tsx           # - 基础查询和变更操作
│   └── uncombined/        # - 未组合的查询示例
├── provider/              # Provider 相关示例
│   └── useHydrateAtoms/   # - 原子状态水合
└── devtool/              # 开发工具示例
    ├── atomsSnapshot/     # - 原子状态快照
    ├── jotai-devtool/     # - Jotai 开发者工具
    ├── useAtomDevtools/   # - 单个原子调试
    ├── useAtomsDevtools/  # - 多原子调试
    └── useAtomsDebugValue/# - 原子调试值
```

## 📖 示例说明

### 1. atomFamily 示例 (`/family`)

- 展示 atomFamily 的核心特性：状态复用、内存管理
- 包含自动清理和手动清理示例
- 演示缓存机制和状态共享

### 2. 查询示例 (`/query`)

- 集成 `jotai-tanstack-query`
- 展示基本的查询和变更操作
- 包含乐观更新和错误处理

### 3. Provider 示例 (`/provider`)

- 展示状态提供者的使用
- 包含服务端渲染支持
- 演示状态水合过程

### 4. 开发工具示例 (`/devtool`)

- 展示各种调试工具的使用
- 包含状态快照和时间旅行
- 提供实时状态监控

## 🚀 快速开始

1. 克隆仓库

```bash
git clone <repository-url>
```

2. 安装依赖

```bash
npm install
```

3. 运行开发服务器

```bash
npm run dev
```

4. 访问示例页面

```sh
http://localhost:3333/jotai-showcase
```

## 📝 注意事项

- 每个示例都是独立的，可以单独运行
- 示例中包含了常见错误的提醒
- 查看每个示例页面顶部的说明获取详细信息

## 🔗 相关链接

- [Jotai 官方文档](https://jotai.org)
- [Jotai GitHub](https://github.com/pmndrs/jotai)
- [jotai-tanstack-query](https://jotai.org/docs/integrations/query)
- [jotai-devtools](https://jotai.org/docs/tools/devtools)
