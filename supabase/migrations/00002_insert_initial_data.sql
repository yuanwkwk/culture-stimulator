-- 插入唐代文人文化模板
INSERT INTO culture_templates (name, description, era, region, special_attributes, is_official, status) VALUES
('唐代文人', '盛唐时期的文人雅士，追求诗词歌赋，向往功名利禄，体验科举、官场、文坛的人生起伏', '唐代（618-907年）', '中国', 
'[{"name": "诗才", "description": "创作诗词的天赋", "initial": 50}, {"name": "仕途", "description": "官场发展潜力", "initial": 30}]'::jsonb, 
true, 'approved');

-- 获取刚插入的文化模板ID
DO $$
DECLARE
  tang_culture_id UUID;
BEGIN
  SELECT id INTO tang_culture_id FROM culture_templates WHERE name = '唐代文人' LIMIT 1;

  -- 插入童年期事件
  INSERT INTO events (culture_id, title, description, stage, choices, requirements, is_official, status) VALUES
  (tang_culture_id, '家世背景', '你出生在一个书香门第，父亲是当地小有名气的秀才。家中藏书颇丰，但家境并不富裕。', 'childhood',
  '[
    {"text": "勤奋读书，立志科举", "effects": {"学识": 15, "技艺": 5, "财富": -5, "声望": 5}},
    {"text": "广交朋友，结识权贵", "effects": {"学识": 5, "技艺": 5, "财富": 5, "声望": 10, "仕途": 10}},
    {"text": "游山玩水，寄情山水", "effects": {"学识": 8, "技艺": 10, "财富": -10, "健康": 10, "诗才": 15}}
  ]'::jsonb, '{}'::jsonb, true, 'approved'),
  
  (tang_culture_id, '启蒙老师', '父亲为你请来了一位老师。这位老师学识渊博，但性格古怪。', 'childhood',
  '[
    {"text": "虚心求教，刻苦学习", "effects": {"学识": 20, "技艺": 5, "健康": -5}},
    {"text": "偷懒贪玩，应付了事", "effects": {"学识": 5, "技艺": 10, "健康": 10, "财富": -5}},
    {"text": "质疑老师，自学成才", "effects": {"学识": 12, "技艺": 8, "诗才": 10, "声望": -5}}
  ]'::jsonb, '{}'::jsonb, true, 'approved'),

  -- 插入青少年期事件
  (tang_culture_id, '初试诗才', '在一次文会上，你有机会展示自己的诗才。众多文人雅士齐聚一堂。', 'youth',
  '[
    {"text": "精心准备，一鸣惊人", "effects": {"学识": 10, "诗才": 20, "声望": 25, "技艺": 5}},
    {"text": "临场发挥，中规中矩", "effects": {"学识": 5, "诗才": 10, "声望": 10, "技艺": 5}},
    {"text": "怯场退缩，默默离开", "effects": {"学识": 5, "健康": -10, "声望": -10}}
  ]'::jsonb, '{"诗才": 30}'::jsonb, true, 'approved'),

  (tang_culture_id, '科举考试', '你参加了乡试，这是你人生的重要转折点。考场上人才济济，竞争激烈。', 'youth',
  '[
    {"text": "金榜题名，高中举人", "effects": {"学识": 15, "声望": 30, "仕途": 25, "财富": 20}},
    {"text": "名落孙山，继续苦读", "effects": {"学识": 10, "健康": -10, "声望": -5}},
    {"text": "放弃科举，寄情诗酒", "effects": {"诗才": 20, "技艺": 15, "声望": 5, "仕途": -20}}
  ]'::jsonb, '{"学识": 40}'::jsonb, true, 'approved'),

  (tang_culture_id, '长安之行', '你决定前往长安，寻求更大的发展机会。长安城繁华无比，机遇与挑战并存。', 'youth',
  '[
    {"text": "拜访权贵，寻求举荐", "effects": {"声望": 15, "仕途": 20, "财富": -10, "学识": 5}},
    {"text": "结交文友，切磋诗文", "effects": {"诗才": 20, "声望": 15, "学识": 10, "技艺": 10}},
    {"text": "游历名胜，增长见识", "effects": {"学识": 15, "诗才": 15, "健康": 10, "财富": -15}}
  ]'::jsonb, '{}'::jsonb, true, 'approved'),

  -- 插入成年期事件
  (tang_culture_id, '入仕为官', '你终于得到了一个官职，开始了仕途生涯。官场复杂，需要谨慎应对。', 'adult',
  '[
    {"text": "清正廉洁，为民请命", "effects": {"声望": 25, "仕途": 15, "财富": 5, "健康": -5}},
    {"text": "圆滑处世，左右逢源", "effects": {"声望": 10, "仕途": 25, "财富": 20, "学识": -5}},
    {"text": "刚正不阿，得罪权贵", "effects": {"声望": 20, "仕途": -15, "财富": -10, "健康": -10}}
  ]'::jsonb, '{"仕途": 40}'::jsonb, true, 'approved'),

  (tang_culture_id, '诗名远扬', '你的诗作在文坛引起轰动，许多人争相传诵。你成为了当代著名诗人。', 'adult',
  '[
    {"text": "继续创作，追求极致", "effects": {"诗才": 25, "声望": 30, "学识": 15, "健康": -10}},
    {"text": "收徒传艺，桃李满天", "effects": {"声望": 25, "学识": 20, "财富": 15, "诗才": 10}},
    {"text": "归隐山林，淡泊名利", "effects": {"健康": 20, "诗才": 20, "声望": -10, "仕途": -20}}
  ]'::jsonb, '{"诗才": 60, "声望": 50}'::jsonb, true, 'approved'),

  (tang_culture_id, '政治风波', '朝廷发生了重大政治变故，你被卷入其中。这是一次危险的考验。', 'adult',
  '[
    {"text": "明哲保身，急流勇退", "effects": {"仕途": -10, "财富": 10, "健康": 10, "声望": -5}},
    {"text": "坚守立场，据理力争", "effects": {"声望": 20, "仕途": -20, "健康": -15, "财富": -15}},
    {"text": "随波逐流，顺应时势", "effects": {"仕途": 15, "财富": 15, "声望": -15, "学识": -10}}
  ]'::jsonb, '{"仕途": 30}'::jsonb, true, 'approved'),

  -- 插入晚年期事件
  (tang_culture_id, '著书立说', '你决定将一生所学著成书籍，传于后世。这是你人生的总结。', 'elder',
  '[
    {"text": "倾尽心血，完成巨著", "effects": {"学识": 20, "声望": 30, "健康": -20}},
    {"text": "量力而行，编纂选集", "effects": {"学识": 10, "声望": 15, "健康": -5}},
    {"text": "口述传承，不留文字", "effects": {"声望": 10, "健康": 5}}
  ]'::jsonb, '{"学识": 60}'::jsonb, true, 'approved'),

  (tang_culture_id, '回首往事', '你在晚年回顾自己的一生，思考人生的意义和价值。', 'elder',
  '[
    {"text": "无怨无悔，心满意足", "effects": {"健康": 10, "声望": 10}},
    {"text": "略有遗憾，但也释然", "effects": {"健康": 5, "学识": 5}},
    {"text": "追悔莫及，郁郁寡欢", "effects": {"健康": -15, "声望": -5}}
  ]'::jsonb, '{}'::jsonb, true, 'approved');

  -- 插入结局
  INSERT INTO endings (culture_id, title, description, conditions, achievement_level, is_official, status) VALUES
  (tang_culture_id, '诗仙传世', '你的诗才冠绝天下，作品流传千古。后世将你与李白、杜甫并称，成为唐诗的代表人物。你的名字永远镌刻在文学史册上。', 
  '{"诗才": 80, "声望": 70, "学识": 60}'::jsonb, 'legendary', true, 'approved'),
  
  (tang_culture_id, '一代名臣', '你在官场上建功立业，政绩卓著，深受百姓爱戴。虽然经历了政治风波，但你始终保持清廉正直，最终位列三公，名垂青史。', 
  '{"仕途": 70, "声望": 65, "学识": 50}'::jsonb, 'legendary', true, 'approved'),
  
  (tang_culture_id, '文坛宗师', '你不仅诗才出众，更培养了众多弟子，形成了独特的文学流派。你的文学理论和创作实践影响了整个时代，被尊为一代宗师。', 
  '{"诗才": 70, "学识": 70, "声望": 60}'::jsonb, 'excellent', true, 'approved'),
  
  (tang_culture_id, '隐逸高士', '你选择了远离官场，归隐山林。在山水之间，你创作了大量优秀诗作，过着清贫但自在的生活。后世称你为隐逸诗人的典范。', 
  '{"诗才": 60, "健康": 60, "学识": 50}'::jsonb, 'excellent', true, 'approved'),
  
  (tang_culture_id, '平凡一生', '你度过了平凡但充实的一生。虽然没有显赫的功名，也没有传世的诗作，但你在自己的位置上尽职尽责，问心无愧。', 
  '{"学识": 40, "声望": 30}'::jsonb, 'good', true, 'approved'),
  
  (tang_culture_id, '怀才不遇', '你虽有才华，但终生未能施展。科举失利，仕途坎坷，诗作也未能得到认可。你在郁郁不得志中度过了一生。', 
  '{"学识": 50, "声望": 20, "仕途": 20}'::jsonb, 'ordinary', true, 'approved'),
  
  (tang_culture_id, '潦倒终生', '你的人生充满了挫折和失败。无论是科举、仕途还是文学创作，都未能如愿。晚年贫病交加，凄凉收场。', 
  '{"财富": 20, "健康": 30, "声望": 20}'::jsonb, 'poor', true, 'approved');

END $$;