# 用户内容创作功能说明

## 功能概述

用户内容创作系统允许用户创作新的文化模板、事件和结局，并与社区分享。所有用户创作的内容都需要经过审核才能发布。

## 功能模块

### 1. 用户身份系统

#### 登录方式
- 点击右上角"登录"按钮
- 输入用户名
- 可选择"以管理员身份登录"（用于测试审核功能）
- 用户信息保存在浏览器 localStorage 中

#### 用户类型
- **普通用户**：可以创作内容、查看自己的创作、评价其他用户的作品
- **管理员**：除普通用户权限外，还可以审核待审核的内容

### 2. 创作中心（/create）

#### 创作类型
1. **文化模板**
   - 文化名称、描述
   - 时代、地区
   - 特殊属性（可添加多个）

2. **事件**（待实现）
   - 事件标题、描述
   - 所属文化、人生阶段
   - 选择项（2-3个）
   - 属性影响和触发条件

3. **结局**（待实现）
   - 结局标题、描述
   - 所属文化
   - 成就等级
   - 触发条件

### 3. 我的创作（/my-creations）

#### 功能
- 查看自己的所有创作
- 按类型分类展示（文化、事件、结局）
- 显示审核状态（待审核、已通过、已拒绝）
- 删除自己的创作
- 查看创作统计数据

#### 审核状态
- **待审核（pending）**：刚提交的内容，等待管理员审核
- **已通过（approved）**：审核通过，对所有用户可见
- **已拒绝（rejected）**：审核未通过，仅创作者可见

### 4. 社区创作（待实现）

#### 功能
- 浏览其他用户已通过审核的创作
- 按类型筛选
- 查看创作者信息
- 评价和评论

### 5. 审核系统（待实现）

#### 管理员功能
- 查看所有待审核内容
- 批准或拒绝创作
- 查看创作详情

## 数据库设计

### 表结构

#### culture_templates（文化模板）
- `id`: UUID
- `name`: 文化名称
- `description`: 描述
- `era`: 时代
- `region`: 地区
- `special_attributes`: JSONB，特殊属性
- `is_official`: 是否官方内容
- `creator_id`: 创作者ID
- `status`: 审核状态（pending/approved/rejected）

#### events（事件）
- `id`: UUID
- `culture_id`: 所属文化
- `title`: 标题
- `description`: 描述
- `stage`: 人生阶段
- `choices`: JSONB，选择项
- `requirements`: JSONB，触发条件
- `is_official`: 是否官方内容
- `creator_id`: 创作者ID
- `status`: 审核状态

#### endings（结局）
- `id`: UUID
- `culture_id`: 所属文化
- `title`: 标题
- `description`: 描述
- `conditions`: JSONB，触发条件
- `achievement_level`: 成就等级
- `is_official`: 是否官方内容
- `creator_id`: 创作者ID
- `status`: 审核状态

#### creation_ratings（评价）
- `id`: UUID
- `content_type`: 内容类型（culture/event/ending）
- `content_id`: 内容ID
- `user_id`: 用户ID
- `rating`: 评分（1-5）
- `comment`: 评论

## API 接口

### 创作相关
- `createCultureTemplate()`: 创建文化模板
- `createEvent()`: 创建事件
- `createEnding()`: 创建结局

### 查询相关
- `getUserCreations(userId)`: 获取用户的创作
- `getCommunityCreations()`: 获取社区创作（已审核）
- `getPendingCreations()`: 获取待审核内容（管理员）
- `getUserCreationStats(userId)`: 获取用户创作统计

### 审核相关
- `reviewContent(type, id, status)`: 审核内容
- `deleteCreation(type, id)`: 删除创作

### 评价相关
- `addRating(rating)`: 添加评价
- `getRatings(contentType, contentId)`: 获取评价列表
- `getAverageRating(contentType, contentId)`: 获取平均评分

## 使用流程

### 创作流程
1. 用户登录
2. 进入创作中心
3. 选择创作类型
4. 填写表单
5. 提交创作
6. 等待审核

### 审核流程（管理员）
1. 以管理员身份登录
2. 查看待审核内容
3. 审核每个创作
4. 批准或拒绝

### 浏览流程
1. 进入社区创作页面
2. 浏览已通过审核的内容
3. 查看详情
4. 评价和评论

## 已实现功能

- ✅ 用户身份系统（localStorage模拟）
- ✅ 创作中心页面
- ✅ 文化模板创作表单
- ✅ 我的创作页面
- ✅ 创作统计展示
- ✅ 删除创作功能
- ✅ 审核状态显示
- ✅ 数据库API层
- ✅ 国际化支持

## 待实现功能

- ⏳ 事件创作表单
- ⏳ 结局创作表单
- ⏳ 社区创作页面
- ⏳ 内容详情页面
- ⏳ 评价和评论功能
- ⏳ 管理员审核页面
- ⏳ 内容搜索和筛选
- ⏳ 创作者主页

## 技术实现

### 前端
- React + TypeScript
- shadcn/ui 组件库
- React Router 路由
- localStorage 用户身份管理

### 后端
- Supabase 数据库
- PostgreSQL
- Row Level Security (RLS) 权限控制

### 状态管理
- React Hooks
- Context API（国际化）
- localStorage（用户信息）

## 注意事项

1. **用户身份**：当前使用 localStorage 模拟，生产环境需要实现真正的认证系统
2. **审核机制**：当前为简化版，生产环境需要完善的审核工作流
3. **权限控制**：需要在数据库层面实现 RLS 策略
4. **内容安全**：需要添加内容审查和过滤机制
5. **性能优化**：大量内容时需要实现分页和缓存

## 未来改进

1. 实现真正的用户认证系统（Supabase Auth）
2. 完善审核工作流（多级审核、审核日志）
3. 添加内容举报功能
4. 实现内容推荐算法
5. 添加创作者激励机制
6. 支持内容版本管理
7. 实现协作创作功能

---

© 2026 文化人生模拟器
