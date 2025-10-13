# 🎯 Tab Content 多语言迁移指南

## 📋 概述

本文档说明了如何将`js/game-dashboard.js`中`profiles-section`模块下的`tab-content`信息迁移到`data/profile.json`中，实现完整的多语言支持。

## 🔄 主要修改

### 1. Profile.json 数据结构扩展

**新增翻译结构：**

```json
{
  "skills": {
    "productPlanning": {
      "name": {
        "zh": "产品策划 Lv.10",
        "en": "Product Planning Lv.10",
        "ja": "プロダクト企画 Lv.10"
      },
      "description": {
        "zh": "端到端负责订阅制渲染器客户端/服务端产品设计与商业化落地",
        "en": "End-to-end responsibility for subscription-based renderer client/server product design and commercialization",
        "ja": "サブスクリプション型レンダラーのクライアント/サーバー製品設計と商業化のエンドツーエンド責任"
      },
      "cooldown": {
        "zh": "主动 • CD: 持续",
        "en": "Active • CD: Continuous",
        "ja": "アクティブ • CD: 継続"
      }
    },
    "interactionDesign": {
      "name": {
        "zh": "交互设计 Lv.9",
        "en": "Interaction Design Lv.9",
        "ja": "インタラクションデザイン Lv.9"
      },
      "description": {
        "zh": "复杂业务的信息架构与流程重设计，提升交付效率与数据透明度",
        "en": "Information architecture and process redesign for complex business, improving delivery efficiency and data transparency",
        "ja": "複雑なビジネスの情報アーキテクチャとプロセス再設計、配信効率とデータ透明性の向上"
      },
      "cooldown": {
        "zh": "主动 • CD: 持续",
        "en": "Active • CD: Continuous",
        "ja": "アクティブ • CD: 継続"
      }
    },
    "dataAI": {
      "name": {
        "zh": "数据与AI工具 Lv.8",
        "en": "Data & AI Tools Lv.8",
        "ja": "データ・AIツール Lv.8"
      },
      "description": {
        "zh": "Tableau/GA/SQL + AI工作流，驱动产品增长与功能优化",
        "en": "Tableau/GA/SQL + AI workflow, driving product growth and feature optimization",
        "ja": "Tableau/GA/SQL + AIワークフロー、製品成長と機能最適化の推進"
      },
      "cooldown": {
        "zh": "主动 • CD: 持续",
        "en": "Active • CD: Continuous",
        "ja": "アクティブ • CD: 継続"
      }
    }
  },
  "achievements": {
    "arr": {
      "title": {
        "zh": "ARR 1500万+",
        "en": "ARR 15M+ RMB",
        "ja": "ARR 1500万+"
      },
      "description": {
        "zh": "团队版从0到1，实现订阅制收入与留存双增长",
        "en": "Team edition from 0 to 1, achieving dual growth in subscription revenue and retention",
        "ja": "チーム版を0から1へ、サブスクリプション収益とリテンションの二重成長を実現"
      }
    },
    "patents": {
      "title": {
        "zh": "两项国家发明专利（第一发明人）",
        "en": "Two National Invention Patents (First Inventor)",
        "ja": "国家発明特許2件（第一発明者）"
      },
      "description": {
        "zh": "CN112767099A、CN112801547A",
        "en": "CN112767099A, CN112801547A",
        "ja": "CN112767099A、CN112801547A"
      }
    },
    "awards": {
      "title": {
        "zh": "IDEA 银奖 & 红点奖",
        "en": "IDEA Silver Award & Red Dot Award",
        "ja": "IDEA銀賞 & レッドドット賞"
      },
      "description": {
        "zh": "国际工业设计大奖",
        "en": "International Industrial Design Awards",
        "ja": "国際工業デザイン賞"
      }
    }
  },
  "education": {
    "zju": {
      "period": {
        "zh": "2017.09 – 2020.03",
        "en": "2017.09 – 2020.03",
        "ja": "2017.09 – 2020.03"
      },
      "school": {
        "zh": "浙江大学 / 计算机科学与技术学院",
        "en": "Zhejiang University / College of Computer Science and Technology",
        "ja": "浙江大学 / コンピュータ科学技術学院"
      },
      "degree": {
        "zh": "工业设计工程 • 工学硕士",
        "en": "Industrial Design Engineering • Master of Engineering",
        "ja": "工業デザイン工学 • 工学修士"
      }
    },
    "dlnu": {
      "period": {
        "zh": "2013.07 – 2017.09",
        "en": "2013.07 – 2017.09",
        "ja": "2013.07 – 2017.09"
      },
      "school": {
        "zh": "大连民族大学 / 设计学院",
        "en": "Dalian Minzu University / School of Design",
        "ja": "大連民族大学 / デザイン学院"
      },
      "degree": {
        "zh": "工业设计 • 工学学士",
        "en": "Industrial Design • Bachelor of Engineering",
        "ja": "工業デザイン • 工学学士"
      }
    }
  }
}
```

### 2. JavaScript 代码修改

**文件：** `js/game-dashboard.js`

**新增方法：**

1. **`updateSkillsContent()`** - 更新技能标签页内容
2. **`updateAchievementsContent()`** - 更新成就标签页内容  
3. **`updateEducationContent()`** - 更新教育标签页内容

**修改的方法：**

- **`convertProfileToGameText()`** - 添加了skills、achievements、education的翻译数据读取
- **`updateUITexts()`** - 添加了对新内容更新方法的调用

### 3. Python 脚本更新

**文件：** `update_translations.py`

**新增方法：**

- **`update_skills_texts()`** - 更新技能文本
- **`update_achievements_texts()`** - 更新成就文本
- **`update_education_texts()`** - 更新教育文本

**更新的菜单：**

```
1. 个人信息 (姓名、职位等)
2. 卡带名称
3. UI文本
4. 技能文本        ← 新增
5. 成就文本        ← 新增
6. 教育文本        ← 新增
7. 保存并退出
8. 退出不保存
```

## 🎯 支持的翻译字段

### 技能标签页 (Skills)
- **productPlanning** - 产品策划技能
  - `name` - 技能名称
  - `description` - 技能描述
  - `cooldown` - 冷却时间
- **interactionDesign** - 交互设计技能
  - `name` - 技能名称
  - `description` - 技能描述
  - `cooldown` - 冷却时间
- **dataAI** - 数据与AI工具技能
  - `name` - 技能名称
  - `description` - 技能描述
  - `cooldown` - 冷却时间

### 成就标签页 (Achievements)
- **arr** - ARR成就
  - `title` - 成就标题
  - `description` - 成就描述
- **patents** - 专利成就
  - `title` - 成就标题
  - `description` - 成就描述
- **awards** - 奖项成就
  - `title` - 成就标题
  - `description` - 成就描述

### 教育标签页 (Education)
- **zju** - 浙江大学教育经历
  - `period` - 时间期间
  - `school` - 学校名称
  - `degree` - 学位信息
- **dlnu** - 大连民族大学教育经历
  - `period` - 时间期间
  - `school` - 学校名称
  - `degree` - 学位信息

## 🛠️ 使用方法

### 方法一：直接编辑profile.json

1. 打开 `data/profile.json` 文件
2. 找到 `skills`、`achievements`、`education` 部分
3. 修改对应的翻译文本
4. 保存文件并刷新浏览器

**示例：**
```json
"skills": {
  "productPlanning": {
    "name": {
      "zh": "高级产品策划 Lv.10",
      "en": "Senior Product Planning Lv.10",
      "ja": "シニアプロダクト企画 Lv.10"
    }
  }
}
```

### 方法二：使用Python脚本

```bash
python3 update_translations.py
```

选择对应的选项来修改翻译：
- 选项4：技能文本
- 选项5：成就文本
- 选项6：教育文本

### 方法三：使用文本编辑器

访问 `game-text-editor.html` 进行可视化编辑

## 🔍 验证修改

### 测试页面
访问 `test_translations.html` 验证翻译功能

### 手动验证
1. 打开 `game-dashboard.html`
2. 切换语言按钮
3. 检查各个标签页的内容是否正确显示

## 📝 技术实现细节

### 动态内容更新
JavaScript代码现在会：
1. 从`profile.json`中读取翻译数据
2. 根据当前语言动态更新DOM元素
3. 支持实时语言切换

### 数据结构映射
```javascript
// 技能数据映射
skills.productPlanning.name → .skill-name
skills.productPlanning.description → .skill-description
skills.productPlanning.cooldown → .skill-cooldown

// 成就数据映射
achievements.arr.title → .achievement-title
achievements.arr.description → .achievement-desc

// 教育数据映射
education.zju.school → .education-school
education.zju.degree → .education-title
education.zju.period → .education-year
```

## 🚀 优势

### 1. 完整的多语言支持
- 所有tab-content内容都支持中文、英文、日文
- 动态语言切换，无需刷新页面

### 2. 集中管理
- 所有翻译文本集中在profile.json中
- 便于维护和更新

### 3. 扩展性
- 易于添加新的技能、成就、教育经历
- 支持添加新的语言

### 4. 工具支持
- 提供多种编辑方式
- 完整的测试和验证工具

## 🔧 故障排除

### 内容不显示
1. 检查JSON格式是否正确
2. 确认键名拼写无误
3. 验证语言代码 (zh/en/ja)

### 部分内容缺失
1. 检查profile.json中是否有对应字段
2. 确认默认值是否存在
3. 查看浏览器控制台错误信息

### 语言切换无效
1. 检查JavaScript文件是否正确加载
2. 确认语言切换逻辑正常
3. 验证事件监听器是否绑定

## 📚 相关文件

- `js/game-dashboard.js` - 主要JavaScript逻辑
- `data/profile.json` - 翻译数据文件
- `update_translations.py` - 翻译更新脚本
- `test_translations.html` - 翻译测试页面
- `game-text-editor.html` - 可视化编辑器

## 🎉 完成状态

✅ 所有tab-content硬编码词条已迁移到profile.json  
✅ 支持中文、英文、日文三种语言  
✅ 动态内容更新功能正常  
✅ 提供多种编辑和测试工具  
✅ 保持向后兼容性  
✅ 完整的文档和指南  

现在您可以通过修改`data/profile.json`文件来更新所有tab-content翻译，无需修改JavaScript代码！
