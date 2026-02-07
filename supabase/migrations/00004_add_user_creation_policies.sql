-- 为用户创作功能添加 RLS 策略

-- ==================== culture_templates 表策略 ====================

-- 允许任何人插入文化模板（状态默认为 pending）
CREATE POLICY "Anyone can create culture templates"
ON culture_templates
FOR INSERT
TO public
WITH CHECK (true);

-- 允许创作者查看自己的所有创作（包括 pending 和 rejected）
CREATE POLICY "Creators can view their own cultures"
ON culture_templates
FOR SELECT
TO public
USING (creator_id IS NOT NULL AND creator_id = current_setting('request.headers', true)::json->>'x-user-id');

-- 允许创作者更新自己的创作
CREATE POLICY "Creators can update their own cultures"
ON culture_templates
FOR UPDATE
TO public
USING (creator_id IS NOT NULL AND creator_id = current_setting('request.headers', true)::json->>'x-user-id')
WITH CHECK (creator_id IS NOT NULL AND creator_id = current_setting('request.headers', true)::json->>'x-user-id');

-- 允许创作者删除自己的创作
CREATE POLICY "Creators can delete their own cultures"
ON culture_templates
FOR DELETE
TO public
USING (creator_id IS NOT NULL AND creator_id = current_setting('request.headers', true)::json->>'x-user-id');

-- ==================== events 表策略 ====================

-- 允许任何人插入事件
CREATE POLICY "Anyone can create events"
ON events
FOR INSERT
TO public
WITH CHECK (true);

-- 允许创作者查看自己的所有事件
CREATE POLICY "Creators can view their own events"
ON events
FOR SELECT
TO public
USING (creator_id IS NOT NULL AND creator_id = current_setting('request.headers', true)::json->>'x-user-id');

-- 允许创作者更新自己的事件
CREATE POLICY "Creators can update their own events"
ON events
FOR UPDATE
TO public
USING (creator_id IS NOT NULL AND creator_id = current_setting('request.headers', true)::json->>'x-user-id')
WITH CHECK (creator_id IS NOT NULL AND creator_id = current_setting('request.headers', true)::json->>'x-user-id');

-- 允许创作者删除自己的事件
CREATE POLICY "Creators can delete their own events"
ON events
FOR DELETE
TO public
USING (creator_id IS NOT NULL AND creator_id = current_setting('request.headers', true)::json->>'x-user-id');

-- ==================== endings 表策略 ====================

-- 允许任何人插入结局
CREATE POLICY "Anyone can create endings"
ON endings
FOR INSERT
TO public
WITH CHECK (true);

-- 允许创作者查看自己的所有结局
CREATE POLICY "Creators can view their own endings"
ON endings
FOR SELECT
TO public
USING (creator_id IS NOT NULL AND creator_id = current_setting('request.headers', true)::json->>'x-user-id');

-- 允许创作者更新自己的结局
CREATE POLICY "Creators can update their own endings"
ON endings
FOR UPDATE
TO public
USING (creator_id IS NOT NULL AND creator_id = current_setting('request.headers', true)::json->>'x-user-id')
WITH CHECK (creator_id IS NOT NULL AND creator_id = current_setting('request.headers', true)::json->>'x-user-id');

-- 允许创作者删除自己的结局
CREATE POLICY "Creators can delete their own endings"
ON endings
FOR DELETE
TO public
USING (creator_id IS NOT NULL AND creator_id = current_setting('request.headers', true)::json->>'x-user-id');

-- ==================== creation_ratings 表策略 ====================

-- 允许任何人插入评价
CREATE POLICY "Anyone can create ratings"
ON creation_ratings
FOR INSERT
TO public
WITH CHECK (true);

-- 允许任何人查看评价
CREATE POLICY "Anyone can view ratings"
ON creation_ratings
FOR SELECT
TO public
USING (true);

-- 允许用户更新自己的评价
CREATE POLICY "Users can update their own ratings"
ON creation_ratings
FOR UPDATE
TO public
USING (user_id = current_setting('request.headers', true)::json->>'x-user-id')
WITH CHECK (user_id = current_setting('request.headers', true)::json->>'x-user-id');

-- 允许用户删除自己的评价
CREATE POLICY "Users can delete their own ratings"
ON creation_ratings
FOR DELETE
TO public
USING (user_id = current_setting('request.headers', true)::json->>'x-user-id');