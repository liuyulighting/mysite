#!/usr/bin/env python3
"""
多语言词条更新脚本
用于快速更新profile.json中的多语言内容
"""

import json
import sys
import os

def load_profile():
    """加载profile.json文件"""
    try:
        with open('data/profile.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ 错误：找不到 data/profile.json 文件")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ 错误：JSON格式错误 - {e}")
        sys.exit(1)

def save_profile(data):
    """保存profile.json文件"""
    try:
        with open('data/profile.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("✅ 文件保存成功")
    except Exception as e:
        print(f"❌ 保存失败：{e}")
        sys.exit(1)

def update_profile_info(data):
    """更新个人信息"""
    print("\n📝 更新个人信息")
    
    # 姓名
    name_zh = input("请输入中文姓名 (当前: {}): ".format(data['profile'].get('nameZh', '')))
    if name_zh:
        data['profile']['nameZh'] = name_zh
    
    name_en = input("请输入英文姓名 (当前: {}): ".format(data['profile'].get('name', '')))
    if name_en:
        data['profile']['name'] = name_en
    
    name_ja = input("请输入日文姓名 (当前: {}): ".format(data['profile'].get('nameJa', '')))
    if name_ja:
        data['profile']['nameJa'] = name_ja
    
    # 职位
    title_zh = input("请输入中文职位 (当前: {}): ".format(data['profile'].get('titleZh', '')))
    if title_zh:
        data['profile']['titleZh'] = title_zh
    
    title_en = input("请输入英文职位 (当前: {}): ".format(data['profile'].get('title', '')))
    if title_en:
        data['profile']['title'] = title_en
    
    title_ja = input("请输入日文职位 (当前: {}): ".format(data['profile'].get('titleJa', '')))
    if title_ja:
        data['profile']['titleJa'] = title_ja

def update_cartridge_names(data):
    """更新卡带名称"""
    print("\n🎮 更新卡带名称")
    
    for cartridge in data['cartridges']:
        print(f"\n卡带: {cartridge['id']}")
        
        name_zh = input(f"请输入中文名称 (当前: {cartridge.get('nameZh', '')}): ")
        if name_zh:
            cartridge['nameZh'] = name_zh
        
        name_en = input(f"请输入英文名称 (当前: {cartridge.get('name', '')}): ")
        if name_en:
            cartridge['name'] = name_en
        
        name_ja = input(f"请输入日文名称 (当前: {cartridge.get('nameJa', '')}): ")
        if name_ja:
            cartridge['nameJa'] = name_ja

def update_ui_texts(data):
    """更新UI文本"""
    print("\n🖥️ 更新UI文本")
    
    if 'ui' not in data:
        data['ui'] = {}
    
    # 更新tabs文本
    if 'tabs' not in data['ui']:
        data['ui']['tabs'] = {}
    
    print("\n标签页文本:")
    tab_keys = ['skills', 'achievements', 'education']
    for key in tab_keys:
        if key not in data['ui']['tabs']:
            data['ui']['tabs'][key] = {}
        
        zh_text = input(f"{key} 中文 (当前: {data['ui']['tabs'][key].get('zh', '')}): ")
        if zh_text:
            data['ui']['tabs'][key]['zh'] = zh_text
        
        en_text = input(f"{key} 英文 (当前: {data['ui']['tabs'][key].get('en', '')}): ")
        if en_text:
            data['ui']['tabs'][key]['en'] = en_text
        
        ja_text = input(f"{key} 日文 (当前: {data['ui']['tabs'][key].get('ja', '')}): ")
        if ja_text:
            data['ui']['tabs'][key]['ja'] = ja_text
    
    # 更新projects文本
    if 'projects' not in data['ui']:
        data['ui']['projects'] = {}
    
    print("\n项目文本:")
    project_keys = ['d5Title', 'd5Desc', 'kujialeTitle', 'kujialeDesc', 'officeTitle', 'officeDesc', 'diverseshotTitle', 'diverseshotDesc']
    for key in project_keys:
        if key not in data['ui']['projects']:
            data['ui']['projects'][key] = {}
        
        zh_text = input(f"{key} 中文 (当前: {data['ui']['projects'][key].get('zh', '')}): ")
        if zh_text:
            data['ui']['projects'][key]['zh'] = zh_text
        
        en_text = input(f"{key} 英文 (当前: {data['ui']['projects'][key].get('en', '')}): ")
        if en_text:
            data['ui']['projects'][key]['en'] = en_text
        
        ja_text = input(f"{key} 日文 (当前: {data['ui']['projects'][key].get('ja', '')}): ")
        if ja_text:
            data['ui']['projects'][key]['ja'] = ja_text
    
    # 更新基础UI文本
    ui_keys = ['start', 'exit', 'welcome', 'welcomeDesc', 'cartridge', 'level', 'cards']
    for key in ui_keys:
        if key not in data['ui']:
            data['ui'][key] = {}
        
        zh_text = input(f"{key} 中文 (当前: {data['ui'][key].get('zh', '')}): ")
        if zh_text:
            data['ui'][key]['zh'] = zh_text
        
        en_text = input(f"{key} 英文 (当前: {data['ui'][key].get('en', '')}): ")
        if en_text:
            data['ui'][key]['en'] = en_text
        
        ja_text = input(f"{key} 日文 (当前: {data['ui'][key].get('ja', '')}): ")
        if ja_text:
            data['ui'][key]['ja'] = ja_text

def update_skills_texts(data):
    """更新技能文本"""
    print("\n🎯 更新技能文本")
    
    if 'skills' not in data:
        data['skills'] = {}
    
    skill_keys = ['productPlanning', 'interactionDesign', 'dataAI']
    for skill_key in skill_keys:
        if skill_key not in data['skills']:
            data['skills'][skill_key] = {}
        
        print(f"\n{skill_key}:")
        for field in ['name', 'description', 'cooldown']:
            if field not in data['skills'][skill_key]:
                data['skills'][skill_key][field] = {}
            
            zh_text = input(f"  {field} 中文 (当前: {data['skills'][skill_key][field].get('zh', '')}): ")
            if zh_text:
                data['skills'][skill_key][field]['zh'] = zh_text
            
            en_text = input(f"  {field} 英文 (当前: {data['skills'][skill_key][field].get('en', '')}): ")
            if en_text:
                data['skills'][skill_key][field]['en'] = en_text
            
            ja_text = input(f"  {field} 日文 (当前: {data['skills'][skill_key][field].get('ja', '')}): ")
            if ja_text:
                data['skills'][skill_key][field]['ja'] = ja_text

def update_achievements_texts(data):
    """更新成就文本"""
    print("\n🏆 更新成就文本")
    
    if 'achievements' not in data:
        data['achievements'] = {}
    
    achievement_keys = ['arr', 'patents', 'awards']
    for achievement_key in achievement_keys:
        if achievement_key not in data['achievements']:
            data['achievements'][achievement_key] = {}
        
        print(f"\n{achievement_key}:")
        for field in ['title', 'description']:
            if field not in data['achievements'][achievement_key]:
                data['achievements'][achievement_key][field] = {}
            
            zh_text = input(f"  {field} 中文 (当前: {data['achievements'][achievement_key][field].get('zh', '')}): ")
            if zh_text:
                data['achievements'][achievement_key][field]['zh'] = zh_text
            
            en_text = input(f"  {field} 英文 (当前: {data['achievements'][achievement_key][field].get('en', '')}): ")
            if en_text:
                data['achievements'][achievement_key][field]['en'] = en_text
            
            ja_text = input(f"  {field} 日文 (当前: {data['achievements'][achievement_key][field].get('ja', '')}): ")
            if ja_text:
                data['achievements'][achievement_key][field]['ja'] = ja_text

def update_education_texts(data):
    """更新教育文本"""
    print("\n🎓 更新教育文本")
    
    if 'education' not in data:
        data['education'] = {}
    
    education_keys = ['zju', 'dlnu']
    for education_key in education_keys:
        if education_key not in data['education']:
            data['education'][education_key] = {}
        
        print(f"\n{education_key}:")
        for field in ['period', 'school', 'degree']:
            if field not in data['education'][education_key]:
                data['education'][education_key][field] = {}
            
            zh_text = input(f"  {field} 中文 (当前: {data['education'][education_key][field].get('zh', '')}): ")
            if zh_text:
                data['education'][education_key][field]['zh'] = zh_text
            
            en_text = input(f"  {field} 英文 (当前: {data['education'][education_key][field].get('en', '')}): ")
            if en_text:
                data['education'][education_key][field]['en'] = en_text
            
            ja_text = input(f"  {field} 日文 (当前: {data['education'][education_key][field].get('ja', '')}): ")
            if ja_text:
                data['education'][education_key][field]['ja'] = ja_text

def main():
    """主函数"""
    print("🌐 多语言词条更新工具")
    print("=" * 40)
    
    # 加载数据
    data = load_profile()
    print("✅ 成功加载 profile.json")
    
    while True:
        print("\n请选择要更新的内容:")
        print("1. 个人信息 (姓名、职位等)")
        print("2. 卡带名称")
        print("3. UI文本")
        print("4. 技能文本")
        print("5. 成就文本")
        print("6. 教育文本")
        print("7. 保存并退出")
        print("8. 退出不保存")
        
        choice = input("\n请输入选择 (1-8): ").strip()
        
        if choice == '1':
            update_profile_info(data)
        elif choice == '2':
            update_cartridge_names(data)
        elif choice == '3':
            update_ui_texts(data)
        elif choice == '4':
            update_skills_texts(data)
        elif choice == '5':
            update_achievements_texts(data)
        elif choice == '6':
            update_education_texts(data)
        elif choice == '7':
            save_profile(data)
            print("🎉 更新完成！")
            break
        elif choice == '8':
            print("👋 退出，未保存更改")
            break
        else:
            print("❌ 无效选择，请重新输入")

if __name__ == "__main__":
    main()
