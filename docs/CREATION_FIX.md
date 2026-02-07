# 创作功能修复说明

## 问题描述

用户在提交创作时遇到错误：
```
new row violates row-level security policy for table "culture_templates"
```

## 问题原因

数据库表启用了行级安全策略（RLS），但缺少允许用户插入创作内容的策略。

## 解决方案

### 1. 添加 RLS 策略

为以下表添加了完整的 RLS 策略：

#### culture_templates（文化模板）
- ✅ `Anyone can create culture templates` - 允许任何人插入
- ✅ `Creators can view their own cultures` - 创作者可查看自己的创作
- ✅ `Creators can update their own cultures` - 创作者可更新自己的创作
- ✅ `Creators can delete their own cultures` - 创作者可删除自己的创作

#### events（事件）
- ✅ `Anyone can create events` - 允许任何人插入
- ✅ `Creators can view their own events` - 创作者可查看自己的事件
- ✅ `Creators can update their own events` - 创作者可更新自己的事件
- ✅ `Creators can delete their own events` - 创作者可删除自己的事件

#### endings（结局）
- ✅ `Anyone can create endings` - 允许任何人插入
- ✅ `Creators can view their own endings` - 创作者可查看自己的结局
- ✅ `Creators can update their own endings` - 创作者可更新自己的结局
- ✅ `Creators can delete their own endings` - 创作者可删除自己的结局

#### creation_ratings（评价）
- ✅ `Anyone can create ratings` - 允许任何人插入评价
- ✅ `Anyone can view ratings` - 允许任何人查看评价
- ✅ `Users can update their own ratings` - 用户可更新自己的评价
- ✅ `Users can delete their own ratings` - 用户可删除自己的评价

### 2. 更新 Supabase 客户端

创建了 `getSupabaseWithUser()` 函数，在每次请求时自动添加用户 ID 到请求头：

```typescript
export function getSupabaseWithUser() {
  const userStr = localStorage.getItem('cultural_life_user');
  let userId = '';
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userId = user.id || '';
    } catch {
      // 忽略解析错误
    }
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        'x-user-id': userId
      }
    }
  });
}
```

### 3. 更新 API 函数

所有创作相关的 API 函数现在使用 `getSupabaseWithUser()`：
- `createCultureTemplate()`
- `createEvent()`
- `createEnding()`
- `getUserCreations()`
- `reviewContent()`
- `deleteCreation()`

## RLS 策略工作原理

### 用户身份识别
- 用户 ID 存储在 localStorage 中
- 每次请求时，通过请求头 `x-user-id` 传递用户 ID
- RLS 策略通过 `current_setting('request.headers', true)::json->>'x-user-id'` 获取用户 ID

### 权限控制
1. **插入权限**：任何人都可以插入（`WITH CHECK (true)`）
2. **查看权限**：
   - 已批准的内容：所有人可见（原有策略）
   - 自己的创作：创作者可见所有状态（新增策略）
3. **更新权限**：只有创作者可以更新自己的创作
4. **删除权限**：只有创作者可以删除自己的创作

### 策略优先级
- 多个 SELECT 策略之间是 OR 关系
- 用户可以看到：
  - 所有已批准的内容（`status = 'approved'`）
  - 自己的所有创作（包括 pending 和 rejected）

## 测试步骤

### 1. 测试创作提交
1. 登录用户账号
2. 进入创作中心
3. 点击"创作文化模板"
4. 填写表单：
   - 文化名称：测试文化
   - 文化描述：这是一个测试文化
   - 时代：测试时代
   - 地区：测试地区
   - 特殊属性：至少添加一个
5. 点击"提交创作"
6. ✅ 应该看到"创作提交成功，等待审核"提示
7. ✅ 自动跳转到"我的创作"页面
8. ✅ 可以看到刚创建的文化模板，状态为"待审核"

### 2. 测试查看自己的创作
1. 在"我的创作"页面
2. ✅ 可以看到所有自己的创作
3. ✅ 可以看到审核状态（待审核/已通过/已拒绝）
4. ✅ 统计卡片显示正确的数量

### 3. 测试删除创作
1. 在"我的创作"页面
2. 点击某个创作右上角的删除按钮（垃圾桶图标）
3. 确认删除
4. ✅ 应该看到"删除成功"提示
5. ✅ 创作从列表中消失

### 4. 测试权限隔离
1. 登录用户 A，创建一个文化模板
2. 登出，登录用户 B
3. 进入"我的创作"页面
4. ✅ 应该看不到用户 A 的创作
5. ✅ 只能看到用户 B 自己的创作

### 5. 测试未登录状态
1. 登出所有用户
2. 尝试访问 `/create/culture`
3. ✅ 应该看到"请先登录"提示
4. ✅ 有返回按钮

## 数据库查询验证

### 查看所有策略
```sql
SELECT 
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('culture_templates', 'events', 'endings', 'creation_ratings')
ORDER BY tablename, cmd;
```

### 测试插入（应该成功）
```sql
-- 设置用户 ID（模拟请求头）
SET request.headers = '{"x-user-id": "test_user_123"}';

-- 插入测试数据
INSERT INTO culture_templates (name, description, era, region, special_attributes, creator_id, status, is_official)
VALUES ('测试文化', '测试描述', '测试时代', '测试地区', '[]'::jsonb, 'test_user_123', 'pending', false);
```

### 查询自己的创作（应该能看到）
```sql
SET request.headers = '{"x-user-id": "test_user_123"}';

SELECT * FROM culture_templates WHERE creator_id = 'test_user_123';
```

### 查询其他人的创作（应该看不到，除非已批准）
```sql
SET request.headers = '{"x-user-id": "test_user_456"}';

SELECT * FROM culture_templates WHERE creator_id = 'test_user_123';
-- 应该返回空结果（如果状态不是 approved）
```

## 注意事项

1. **用户 ID 格式**：
   - 当前使用 `user_${timestamp}_${random}` 格式
   - 例如：`user_1707318662240_abc123def`

2. **请求头传递**：
   - 每次创作相关的操作都会自动添加 `x-user-id` 请求头
   - 如果用户未登录，请求头为空字符串

3. **策略匹配**：
   - RLS 策略通过 `creator_id = current_setting('request.headers', true)::json->>'x-user-id'` 匹配
   - 必须确保 creator_id 和请求头中的 user-id 完全一致

4. **错误处理**：
   - 如果 RLS 策略拒绝操作，会抛出 `42501` 错误
   - 前端会捕获错误并显示"创作提交失败"

## 常见问题

### Q: 为什么我看不到自己的创作？
A: 检查以下几点：
1. 确认已登录
2. 确认 creator_id 与当前用户 ID 一致
3. 检查浏览器控制台是否有错误

### Q: 为什么删除失败？
A: 可能原因：
1. 未登录
2. 尝试删除其他人的创作
3. 网络错误

### Q: 如何查看数据库中的实际数据？
A: 使用 Supabase 控制台或执行 SQL：
```sql
SELECT id, name, creator_id, status, is_official, created_at 
FROM culture_templates 
ORDER BY created_at DESC 
LIMIT 10;
```

## 后续改进

1. **真正的用户认证**：
   - 使用 Supabase Auth 替代 localStorage
   - 使用 JWT token 进行身份验证

2. **更细粒度的权限**：
   - 管理员可以查看/编辑/删除所有内容
   - 审核员可以审核内容
   - 普通用户只能管理自己的创作

3. **审核工作流**：
   - 添加审核历史记录
   - 添加审核备注
   - 支持批量审核

4. **内容安全**：
   - 添加内容过滤
   - 添加敏感词检测
   - 添加举报功能

---

© 2026 文化人生模拟器
