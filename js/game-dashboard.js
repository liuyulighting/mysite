// Game Dashboard JavaScript
class GameDashboard {
  constructor() {
    this.currentCartridge = null;
    this.currentLevel = null;
    this.currentProjectIndex = 0;
    this.isModalOpen = false;
    this.isCartridgeSelected = false;
    this.carouselInterval = null;
    this.eventListeners = [];
    this.gameTexts = {
      zh: {},
      en: {},
      ja: {}
    };
    this.currentLanguage = 'zh';
    
    this.init();
  }

  async init() {
    console.log('🚀 GameDashboard init started');
    await this.loadGameTexts();
    console.log('📚 Game texts loaded:', this.gameTexts);
    
    // Load saved language preference
    const savedLang = localStorage.getItem('game-dashboard-language');
    console.log('💾 Saved language from localStorage:', savedLang);
    if (savedLang && ['zh', 'en', 'ja'].includes(savedLang)) {
      this.currentLanguage = savedLang;
    }
    console.log('🌐 Current language set to:', this.currentLanguage);
    
    this.setupEventListeners();
    this.setupTabSwitching();
    this.setupModal();
    this.setupGameControls();
    this.updateUITexts();
    
    // Set initial active language button
    const langButtons = document.querySelectorAll('.lang-btn');
    console.log('🔘 Found language buttons:', langButtons.length);
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
      console.log(`🔘 Button ${btn.dataset.lang} active:`, btn.classList.contains('active'));
    });
    console.log('✅ GameDashboard init completed');
  }

  async loadGameTexts() {
    try {
      // 从profile.json加载数据并转换为游戏文本格式
      const response = await fetch('data/profile.json');
      if (response.ok) {
        const profileData = await response.json();
        this.gameTexts = this.convertProfileToGameText(profileData);
      } else {
        // 使用默认文本
        this.gameTexts = this.getDefaultGameText();
      }
    } catch (error) {
      console.warn('Failed to load game texts, using defaults:', error);
      this.gameTexts = this.getDefaultGameText();
    }
  }

  convertProfileToGameText(profileData) {
    // 从profile.json中读取所有翻译数据
    return {
      zh: {
        profile: {
          name: profileData.profile?.nameZh || profileData.profile?.name || "刘禹",
          title: profileData.profile?.titleZh || profileData.profile?.title || "产品经理",
          location: profileData.profile?.locationZh || profileData.profile?.location || "中国南京",
          email: profileData.profile?.email || "liuyulighting@gmail.com",
          phone: profileData.profile?.phone || "+86 18069860189"
        },
        cartridges: {
          d5: profileData.cartridges?.[0]?.nameZh || "D5 渲染器",
          kujiale: profileData.cartridges?.[1]?.nameZh || "酷家乐",
          projects: profileData.cartridges?.[2]?.nameZh || "个人项目"
        },
        tabs: {
          skills: profileData.ui?.tabs?.skills?.zh || "技能",
          achievements: profileData.ui?.tabs?.achievements?.zh || "成就",
          education: profileData.ui?.tabs?.education?.zh || "教育"
        },
        projects: {
          d5Title: profileData.ui?.projects?.d5Title?.zh || "D5 渲染器团队版",
          d5Desc: profileData.ui?.projects?.d5Desc?.zh || "全球领先的即时渲染器 B 端版本，ARR 超 1500 万",
          kujialeTitle: profileData.ui?.projects?.kujialeTitle?.zh || "前后端一体对接生产方案",
          kujialeDesc: profileData.ui?.projects?.kujialeDesc?.zh || "门店订单直连工厂审核与生产，支撑 100 亿资产流转",
          officeTitle: profileData.ui?.projects?.officeTitle?.zh || "公装参数化设计工具",
          officeDesc: profileData.ui?.projects?.officeDesc?.zh || "参数化装配式办公家具设计，服务震旦/圣奥等品牌",
          diverseshotTitle: profileData.ui?.projects?.diverseshotTitle?.zh || "DiverseShot AI",
          diverseshotDesc: profileData.ui?.projects?.diverseshotDesc?.zh || "将视频转换为 3D 文件的 AI 客户端，简单易用"
        },
        ui: {
          start: profileData.ui?.start?.zh || "START",
          exit: profileData.ui?.exit?.zh || "EXIT",
          welcome: profileData.ui?.welcome?.zh || "欢迎来到我的作品集",
          welcomeDesc: profileData.ui?.welcomeDesc?.zh || "点击 START 按钮开始探索我的作品",
          cartridge: profileData.ui?.cartridge?.zh || "卡带",
          level: profileData.ui?.level?.zh || "关卡",
          cards: profileData.ui?.cards?.zh || "卡片",
          gameConsole: profileData.ui?.gameConsole?.titleZh || "游戏控制台"
        },
        skills: {
          productPlanning: {
            name: profileData.skills?.productPlanning?.name?.zh || "产品策划 Lv.10",
            description: profileData.skills?.productPlanning?.description?.zh || "端到端负责订阅制渲染器客户端/服务端产品设计与商业化落地",
            cooldown: profileData.skills?.productPlanning?.cooldown?.zh || "主动 • CD: 持续"
          },
          interactionDesign: {
            name: profileData.skills?.interactionDesign?.name?.zh || "交互设计 Lv.9",
            description: profileData.skills?.interactionDesign?.description?.zh || "复杂业务的信息架构与流程重设计，提升交付效率与数据透明度",
            cooldown: profileData.skills?.interactionDesign?.cooldown?.zh || "主动 • CD: 持续"
          },
          dataAI: {
            name: profileData.skills?.dataAI?.name?.zh || "数据与AI工具 Lv.8",
            description: profileData.skills?.dataAI?.description?.zh || "Tableau/GA/SQL + AI工作流，驱动产品增长与功能优化",
            cooldown: profileData.skills?.dataAI?.cooldown?.zh || "主动 • CD: 持续"
          }
        },
        achievements: {
          arr: {
            title: profileData.achievements?.arr?.title?.zh || "ARR 1500万+",
            description: profileData.achievements?.arr?.description?.zh || "团队版从0到1，实现订阅制收入与留存双增长"
          },
          patents: {
            title: profileData.achievements?.patents?.title?.zh || "两项国家发明专利（第一发明人）",
            description: profileData.achievements?.patents?.description?.zh || "CN112767099A、CN112801547A"
          },
          awards: {
            title: profileData.achievements?.awards?.title?.zh || "IDEA 银奖 & 红点奖",
            description: profileData.achievements?.awards?.description?.zh || "国际工业设计大奖"
          }
        },
        education: {
          zju: {
            period: profileData.education?.zju?.period?.zh || "2017.09 – 2020.03",
            school: profileData.education?.zju?.school?.zh || "浙江大学 / 计算机科学与技术学院",
            degree: profileData.education?.zju?.degree?.zh || "工业设计工程 • 工学硕士"
          },
          dlnu: {
            period: profileData.education?.dlnu?.period?.zh || "2013.07 – 2017.09",
            school: profileData.education?.dlnu?.school?.zh || "大连民族大学 / 设计学院",
            degree: profileData.education?.dlnu?.degree?.zh || "工业设计 • 工学学士"
          }
        }
      },
      en: {
        profile: {
          name: profileData.profile?.name || "Yu Liu",
          title: profileData.profile?.title || "Product Manager",
          location: profileData.profile?.location || "Nanjing, China",
          email: profileData.profile?.email || "liuyulighting@gmail.com",
          phone: profileData.profile?.phone || "+86 18069860189"
        },
        cartridges: {
          d5: profileData.cartridges?.[0]?.name || "D5 Render",
          kujiale: profileData.cartridges?.[1]?.name || "Kujiale",
          projects: profileData.cartridges?.[2]?.name || "Side Projects"
        },
        tabs: {
          skills: profileData.ui?.tabs?.skills?.en || "Skills",
          achievements: profileData.ui?.tabs?.achievements?.en || "Achievements",
          education: profileData.ui?.tabs?.education?.en || "Education"
        },
        projects: {
          d5Title: profileData.ui?.projects?.d5Title?.en || "D5 Render Team Edition",
          d5Desc: profileData.ui?.projects?.d5Desc?.en || "Leading real-time renderer B2B version with ARR over 15M RMB",
          kujialeTitle: profileData.ui?.projects?.kujialeTitle?.en || "End-to-End Production Solution",
          kujialeDesc: profileData.ui?.projects?.kujialeDesc?.en || "Store orders directly connect to factory review and production, supporting 10B asset flow",
          officeTitle: profileData.ui?.projects?.officeTitle?.en || "Parametric Office Design Tool",
          officeDesc: profileData.ui?.projects?.officeDesc?.en || "Parametric modular office furniture design, serving Aurora/Sunon brands",
          diverseshotTitle: profileData.ui?.projects?.diverseshotTitle?.en || "DiverseShot AI",
          diverseshotDesc: profileData.ui?.projects?.diverseshotDesc?.en || "AI client that converts videos to 3D files, simple and easy to use"
        },
        ui: {
          start: profileData.ui?.start?.en || "START",
          exit: profileData.ui?.exit?.en || "EXIT",
          welcome: profileData.ui?.welcome?.en || "Welcome to My Portfolio",
          welcomeDesc: profileData.ui?.welcomeDesc?.en || "Click START button to explore my works",
          cartridge: profileData.ui?.cartridge?.en || "Cartridge",
          level: profileData.ui?.level?.en || "Level",
          cards: profileData.ui?.cards?.en || "Cards",
          gameConsole: profileData.ui?.gameConsole?.title || "Game Console"
        },
        skills: {
          productPlanning: {
            name: profileData.skills?.productPlanning?.name?.en || "Product Planning Lv.10",
            description: profileData.skills?.productPlanning?.description?.en || "End-to-end responsibility for subscription-based renderer client/server product design and commercialization",
            cooldown: profileData.skills?.productPlanning?.cooldown?.en || "Active • CD: Continuous"
          },
          interactionDesign: {
            name: profileData.skills?.interactionDesign?.name?.en || "Interaction Design Lv.9",
            description: profileData.skills?.interactionDesign?.description?.en || "Information architecture and process redesign for complex business, improving delivery efficiency and data transparency",
            cooldown: profileData.skills?.interactionDesign?.cooldown?.en || "Active • CD: Continuous"
          },
          dataAI: {
            name: profileData.skills?.dataAI?.name?.en || "Data & AI Tools Lv.8",
            description: profileData.skills?.dataAI?.description?.en || "Tableau/GA/SQL + AI workflow, driving product growth and feature optimization",
            cooldown: profileData.skills?.dataAI?.cooldown?.en || "Active • CD: Continuous"
          }
        },
        achievements: {
          arr: {
            title: profileData.achievements?.arr?.title?.en || "ARR 15M+ RMB",
            description: profileData.achievements?.arr?.description?.en || "Team edition from 0 to 1, achieving dual growth in subscription revenue and retention"
          },
          patents: {
            title: profileData.achievements?.patents?.title?.en || "Two National Invention Patents (First Inventor)",
            description: profileData.achievements?.patents?.description?.en || "CN112767099A, CN112801547A"
          },
          awards: {
            title: profileData.achievements?.awards?.title?.en || "IDEA Silver Award & Red Dot Award",
            description: profileData.achievements?.awards?.description?.en || "International Industrial Design Awards"
          }
        },
        education: {
          zju: {
            period: profileData.education?.zju?.period?.en || "2017.09 – 2020.03",
            school: profileData.education?.zju?.school?.en || "Zhejiang University / College of Computer Science and Technology",
            degree: profileData.education?.zju?.degree?.en || "Industrial Design Engineering • Master of Engineering"
          },
          dlnu: {
            period: profileData.education?.dlnu?.period?.en || "2013.07 – 2017.09",
            school: profileData.education?.dlnu?.school?.en || "Dalian Minzu University / School of Design",
            degree: profileData.education?.dlnu?.degree?.en || "Industrial Design • Bachelor of Engineering"
          }
        }
      },
      ja: {
        profile: {
          name: profileData.profile?.nameJa || profileData.profile?.name || "劉禹",
          title: profileData.profile?.titleJa || "プロダクトマネージャー",
          location: profileData.profile?.locationJa || "中国 南京",
          email: profileData.profile?.email || "liuyulighting@gmail.com",
          phone: profileData.profile?.phone || "+86 18069860189"
        },
        cartridges: {
          d5: profileData.cartridges?.[0]?.nameJa || "D5 レンダー",
          kujiale: profileData.cartridges?.[1]?.nameJa || "クージャレ",
          projects: profileData.cartridges?.[2]?.nameJa || "サイドプロジェクト"
        },
        tabs: {
          skills: profileData.ui?.tabs?.skills?.ja || "スキル",
          achievements: profileData.ui?.tabs?.achievements?.ja || "実績",
          education: profileData.ui?.tabs?.education?.ja || "教育"
        },
        projects: {
          d5Title: profileData.ui?.projects?.d5Title?.ja || "D5 レンダーチーム版",
          d5Desc: profileData.ui?.projects?.d5Desc?.ja || "世界トップクラスのリアルタイムレンダラーB2B版、ARR 1500万超",
          kujialeTitle: profileData.ui?.projects?.kujialeTitle?.ja || "フロントエンド・バックエンド一体生産ソリューション",
          kujialeDesc: profileData.ui?.projects?.kujialeDesc?.ja || "店舗注文が工場審査・生産に直接接続、100億資産流転をサポート",
          officeTitle: profileData.ui?.projects?.officeTitle?.ja || "オフィスパラメトリックデザインツール",
          officeDesc: profileData.ui?.projects?.officeDesc?.ja || "パラメトリック組立式オフィス家具デザイン、震旦/圣奥ブランドにサービス",
          diverseshotTitle: profileData.ui?.projects?.diverseshotTitle?.ja || "DiverseShot AI",
          diverseshotDesc: profileData.ui?.projects?.diverseshotDesc?.ja || "動画を3Dファイルに変換するAIクライアント、シンプルで使いやすい"
        },
        ui: {
          start: profileData.ui?.start?.ja || "スタート",
          exit: profileData.ui?.exit?.ja || "終了",
          welcome: profileData.ui?.welcome?.ja || "私のポートフォリオへようこそ",
          welcomeDesc: profileData.ui?.welcomeDesc?.ja || "スタートボタンをクリックして私の作品を探索してください",
          cartridge: profileData.ui?.cartridge?.ja || "カートリッジ",
          level: profileData.ui?.level?.ja || "レベル",
          cards: profileData.ui?.cards?.ja || "カード",
          gameConsole: profileData.ui?.gameConsole?.titleJa || "ゲームコンソール"
        },
        skills: {
          productPlanning: {
            name: profileData.skills?.productPlanning?.name?.ja || "プロダクト企画 Lv.10",
            description: profileData.skills?.productPlanning?.description?.ja || "サブスクリプション型レンダラーのクライアント/サーバー製品設計と商業化のエンドツーエンド責任",
            cooldown: profileData.skills?.productPlanning?.cooldown?.ja || "アクティブ • CD: 継続"
          },
          interactionDesign: {
            name: profileData.skills?.interactionDesign?.name?.ja || "インタラクションデザイン Lv.9",
            description: profileData.skills?.interactionDesign?.description?.ja || "複雑なビジネスの情報アーキテクチャとプロセス再設計、配信効率とデータ透明性の向上",
            cooldown: profileData.skills?.interactionDesign?.cooldown?.ja || "アクティブ • CD: 継続"
          },
          dataAI: {
            name: profileData.skills?.dataAI?.name?.ja || "データ・AIツール Lv.8",
            description: profileData.skills?.dataAI?.description?.ja || "Tableau/GA/SQL + AIワークフロー、製品成長と機能最適化の推進",
            cooldown: profileData.skills?.dataAI?.cooldown?.ja || "アクティブ • CD: 継続"
          }
        },
        achievements: {
          arr: {
            title: profileData.achievements?.arr?.title?.ja || "ARR 1500万+",
            description: profileData.achievements?.arr?.description?.ja || "チーム版を0から1へ、サブスクリプション収益とリテンションの二重成長を実現"
          },
          patents: {
            title: profileData.achievements?.patents?.title?.ja || "国家発明特許2件（第一発明者）",
            description: profileData.achievements?.patents?.description?.ja || "CN112767099A、CN112801547A"
          },
          awards: {
            title: profileData.achievements?.awards?.title?.ja || "IDEA銀賞 & レッドドット賞",
            description: profileData.achievements?.awards?.description?.ja || "国際工業デザイン賞"
          }
        },
        education: {
          zju: {
            period: profileData.education?.zju?.period?.ja || "2017.09 – 2020.03",
            school: profileData.education?.zju?.school?.ja || "浙江大学 / コンピュータ科学技術学院",
            degree: profileData.education?.zju?.degree?.ja || "工業デザイン工学 • 工学修士"
          },
          dlnu: {
            period: profileData.education?.dlnu?.period?.ja || "2013.07 – 2017.09",
            school: profileData.education?.dlnu?.school?.ja || "大連民族大学 / デザイン学院",
            degree: profileData.education?.dlnu?.degree?.ja || "工業デザイン • 工学学士"
          }
        }
      }
    };
  }

  getDefaultGameText() {
    return this.convertProfileToGameText({});
  }

  getText(key, fallback = '') {
    const keys = key.split('.');
    let value = this.gameTexts[this.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    return value || fallback || key;
  }

  updateUITexts() {
    console.log('📝 updateUITexts called for language:', this.currentLanguage);
    
    // 更新标签页文本
    const tabButtons = document.querySelectorAll('.tab-btn');
    console.log('📝 Found', tabButtons.length, 'tab buttons');
    tabButtons.forEach(btn => {
      const tabName = btn.dataset.tab;
      const text = this.getText(`tabs.${tabName}`, tabName);
      console.log(`📝 Tab ${tabName}: "${text}"`);
      btn.textContent = text;
    });

    // 更新技能标签页内容
    this.updateSkillsContent();
    
    // 更新成就标签页内容
    this.updateAchievementsContent();
    
    // 更新教育标签页内容
    this.updateEducationContent();

    // 更新游戏控制台文本
    const gameModuleTitle = document.querySelector('.game-module .module-title');
    if (gameModuleTitle) {
      gameModuleTitle.textContent = this.getText('ui.gameConsole', 'GAME CONSOLE');
    }

    // 更新卡带文本
    const cartridgeCards = document.querySelectorAll('.cartridge-card');
    const cartridgeData = [
      { nameKey: 'cartridges.d5' },
      { nameKey: 'cartridges.kujiale' },
      { nameKey: 'cartridges.projects' }
    ];

    cartridgeCards.forEach((card, index) => {
      if (cartridgeData[index]) {
        const titleElement = card.querySelector('.cartridge-title');
        if (titleElement) {
          titleElement.textContent = this.getText(cartridgeData[index].nameKey);
        }
      }
    });

    // 更新按钮文本
    const startButton = document.getElementById('start-button');
    if (startButton) {
      const buttonText = startButton.querySelector('.button-text');
      if (buttonText) {
        buttonText.textContent = this.getText('ui.start');
      }
    }

    // 更新状态指示器文本
    const statusElements = document.querySelectorAll('.indicator-text');
    statusElements.forEach(element => {
      const type = element.dataset.type;
      if (type) {
        element.textContent = this.getText(`ui.${type}`);
      }
    });
  }

  updateSkillsContent() {
    const skillsPanel = document.getElementById('skills-panel');
    if (!skillsPanel) return;

    const skillItems = skillsPanel.querySelectorAll('.skill-item');
    const skillData = [
      { key: 'skills.productPlanning' },
      { key: 'skills.interactionDesign' },
      { key: 'skills.dataAI' }
    ];

    skillItems.forEach((item, index) => {
      if (skillData[index]) {
        const nameElement = item.querySelector('.skill-name');
        const descElement = item.querySelector('.skill-description');
        const cooldownElement = item.querySelector('.skill-cooldown');

        if (nameElement) {
          nameElement.textContent = this.getText(`${skillData[index].key}.name`);
        }
        if (descElement) {
          descElement.textContent = this.getText(`${skillData[index].key}.description`);
        }
        if (cooldownElement) {
          cooldownElement.textContent = this.getText(`${skillData[index].key}.cooldown`);
        }
      }
    });
  }

  updateAchievementsContent() {
    const achievementsPanel = document.getElementById('achievements-panel');
    if (!achievementsPanel) return;

    const achievementItems = achievementsPanel.querySelectorAll('.achievement-item');
    const achievementData = [
      { key: 'achievements.arr' },
      { key: 'achievements.patents' },
      { key: 'achievements.awards' }
    ];

    achievementItems.forEach((item, index) => {
      if (achievementData[index]) {
        const titleElement = item.querySelector('.achievement-title');
        const descElement = item.querySelector('.achievement-desc');

        if (titleElement) {
          titleElement.textContent = this.getText(`${achievementData[index].key}.title`);
        }
        if (descElement) {
          descElement.textContent = this.getText(`${achievementData[index].key}.description`);
        }
      }
    });
  }

  updateEducationContent() {
    const educationPanel = document.getElementById('education-panel');
    if (!educationPanel) return;

    const educationItems = educationPanel.querySelectorAll('.education-item');
    const educationData = [
      { key: 'education.zju' },
      { key: 'education.dlnu' }
    ];

    educationItems.forEach((item, index) => {
      if (educationData[index]) {
        const yearElement = item.querySelector('.education-year');
        const schoolElement = item.querySelector('.education-school');
        const titleElement = item.querySelector('.education-title');

        if (yearElement) {
          yearElement.textContent = this.getText(`${educationData[index].key}.period`);
        }
        if (schoolElement) {
          schoolElement.textContent = this.getText(`${educationData[index].key}.school`);
        }
        if (titleElement) {
          titleElement.textContent = this.getText(`${educationData[index].key}.degree`);
        }
      }
    });
  }

  setupEventListeners() {
    console.log('🎧 Setting up event listeners...');
    
    // Language switching using event delegation
    const languageSwitcher = document.querySelector('.language-switcher');
    console.log('🔍 Language switcher found:', !!languageSwitcher);
    
    if (languageSwitcher) {
      const handler = (e) => {
        console.log('🖱️ Click detected on:', e.target);
        console.log('🖱️ Target classes:', e.target.classList.toString());
        console.log('🖱️ Is lang-btn?', e.target.classList.contains('lang-btn'));
        
        if (e.target.classList.contains('lang-btn')) {
          console.log('🎯 Language button clicked:', e.target.dataset.lang);
          this.switchLanguage(e.target.dataset.lang);
        } else {
          console.log('❌ Click not on language button');
        }
      };
      languageSwitcher.addEventListener('click', handler);
      this.eventListeners.push({ element: languageSwitcher, event: 'click', handler });
      console.log('✅ Language switcher event listener added');
    } else {
      console.error('❌ Language switcher not found!');
    }

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const handler = (e) => {
        this.switchTab(e.target.dataset.tab);
      };
      btn.addEventListener('click', handler);
      this.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // Project carousel dots and slides are handled in setupProjectCarousel()

    // Modal controls
    const startButton = document.getElementById('start-button');
    const startHandler = () => {
      if (this.isCartridgeSelected) {
        this.exitCartridge();
      } else {
        this.openModal();
      }
    };
    startButton.addEventListener('click', startHandler);
    this.eventListeners.push({ element: startButton, event: 'click', handler: startHandler });

    const modalClose = document.getElementById('modal-close');
    const closeHandler = () => {
      this.closeModal();
    };
    modalClose.addEventListener('click', closeHandler);
    this.eventListeners.push({ element: modalClose, event: 'click', handler: closeHandler });

    // Cartridge selection
    document.querySelectorAll('.cartridge-card').forEach(card => {
      const handler = () => {
        const cartridge = card.dataset.cartridge;
        this.selectCartridge(cartridge);
      };
      card.addEventListener('click', handler);
      this.eventListeners.push({ element: card, event: 'click', handler });
    });

    // Keyboard navigation
    const keyboardHandler = (e) => {
      this.handleKeyboard(e);
    };
    document.addEventListener('keydown', keyboardHandler);
    this.eventListeners.push({ element: document, event: 'keydown', handler: keyboardHandler });
  }

  setupTabSwitching() {
    // Initialize with skills tab active
    this.switchTab('skills');
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `${tabName}-panel`);
    });
  }








  setupModal() {
    // Close modal when clicking outside
    const modal = document.getElementById('cartridge-modal');
    const handler = (e) => {
      if (e.target.id === 'cartridge-modal') {
        this.closeModal();
      }
    };
    modal.addEventListener('click', handler);
    this.eventListeners.push({ element: modal, event: 'click', handler });
  }

  openModal() {
    const modal = document.getElementById('cartridge-modal');
    modal.classList.add('active');
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.getElementById('cartridge-modal');
    modal.classList.remove('active');
    this.isModalOpen = false;
    document.body.style.overflow = '';
  }

  selectCartridge(cartridgeId) {
    this.currentCartridge = cartridgeId;
    this.currentLevel = null;
    this.isCartridgeSelected = true;
    
    // Update indicator text
    this.updateIndicatorText();
    
    // Load cartridge content
    this.loadCartridgeContent(cartridgeId);
    
    // Update start button to exit mode
    this.updateStartButton();
    
    // Close modal
    this.closeModal();
    
    // Show success feedback
    this.showFeedback('Cartridge inserted successfully!');
  }

  loadCartridgeContent(cartridgeId) {
    const viewport = document.getElementById('game-viewport');
    const viewportContent = viewport.querySelector('.viewport-content');
    
    // Clear existing content
    viewportContent.innerHTML = '';
    
    // Load content based on cartridge
    switch (cartridgeId) {
      case 'd5':
        this.loadD5Content(viewportContent);
        break;
      case 'kujiale':
        this.loadKujialeContent(viewportContent);
        break;
      case 'projects':
        this.loadProjectsContent(viewportContent);
        break;
    }
  }

  loadD5Content(container) {
    container.innerHTML = `
      <div class="cartridge-content">
        <h3>${this.getText('cartridges.d5')} | ${this.getText('profile.title')}</h3>
        <div class="level-selector">
          <button class="level-btn" data-level="team-edition">团队版订阅制 0→1</button>
          <button class="level-btn" data-level="collaboration">云/局域网协作体系</button>
          <button class="level-btn" data-level="commercialization">商业化与增长</button>
          <button class="level-btn" data-level="showreel">3D 展示与内容上云</button>
        </div>
      </div>
    `;
    
    // Add level selection handlers
    container.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectLevel(e.target.dataset.level);
      });
    });
  }

  loadKujialeContent(container) {
    container.innerHTML = `
      <div class="cartridge-content">
        <h3>酷家乐 | 高级交互设计师</h3>
        <div class="level-selector">
          <button class="level-btn" data-level="plm">PLM 设计生产对接</button>
          <button class="level-btn" data-level="oms">订单 OMS 可视化</button>
          <button class="level-btn" data-level="parametric-cad">参数化 CAD 工具</button>
          <button class="level-btn" data-level="design-system">设计系统与研究</button>
        </div>
      </div>
    `;
    
    // Add level selection handlers
    container.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectLevel(e.target.dataset.level);
      });
    });
  }

  loadProjectsContent(container) {
    container.innerHTML = `
      <div class="cartridge-content">
        <h3>Side Projects</h3>
        <div class="level-selector">
          <button class="level-btn" data-level="diverseshot">DiverseShot</button>
          <button class="level-btn" data-level="personal-site">Personal Site</button>
          <button class="level-btn" data-level="experiments">Other Experiments</button>
        </div>
      </div>
    `;
    
    // Add level selection handlers
    container.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectLevel(e.target.dataset.level);
      });
    });
  }

  selectLevel(levelId) {
    this.currentLevel = levelId;
    this.updateIndicatorText();
    this.loadLevelContent(levelId);
    this.showFeedback(`Level ${levelId} selected!`);
  }

  loadLevelContent(levelId) {
    const viewport = document.getElementById('game-viewport');
    const viewportContent = viewport.querySelector('.viewport-content');
    
    // Load level-specific content
    const content = this.getLevelContent(levelId);
    viewportContent.innerHTML = content;
  }

  getLevelContent(levelId) {
    const contentMap = {
      'team-edition': `
        <div class="level-content">
          <h3>团队版订阅制 0→1</h3>
          <div class="content-grid">
            <div class="content-item">
              <h4>ARR 超 1500 万人民币</h4>
              <p>主导团队版从 0 到 1 的产品定义与落地，面向建筑/室内设计工作室</p>
              <div class="metrics">
                <span class="metric">ARR：1500万+ RMB</span>
                <span class="metric">团队数：10K+</span>
              </div>
            </div>
            <div class="content-item">
              <h4>席位制 + 按需增长计费</h4>
              <p>设计席位制授权与 Pay-as-you-Grow 模式，降低准入门槛，推进海外增长</p>
              <div class="metrics">
                <span class="metric">CAC：-50%</span>
                <span class="metric">海外收入：+210%</span>
              </div>
            </div>
          </div>
        </div>
      `,
      'collaboration': `
        <div class="level-content">
          <h3>云 & 局域网协作体系</h3>
          <div class="content-grid">
            <div class="content-item">
              <h4>远程/本地多人协作</h4>
              <p>调研并设计云 & 局域网同步机制，支持多人编辑同一项目</p>
              <div class="metrics">
                <span class="metric">同步效率：10x</span>
                <span class="metric">SLA：99.9%</span>
              </div>
            </div>
            <div class="content-item">
              <h4>WorkSet 无冲突合并</h4>
              <p>发明项目分区存档结构（WorkSet），实现多人编辑无冲突合并；集成 Dropbox/Google Drive</p>
              <div class="metrics">
                <span class="metric">冲突率：≈0</span>
                <span class="metric">跨区协作：稳定</span>
              </div>
            </div>
          </div>
        </div>
      `,
      'commercialization': `
        <div class="level-content">
          <h3>商业化与增长</h3>
          <div class="content-grid">
            <div class="content-item">
              <h4>订阅/定价/订单与支付</h4>
              <p>建立订阅、定价、客户与订单管理系统，打通 Stripe 支付，实现自动化售卖</p>
              <div class="metrics">
                <span class="metric">支付成功率：98%</span>
                <span class="metric">CAC：-50%</span>
              </div>
            </div>
            <div class="content-item">
              <h4>留存与流失优化</h4>
              <p>试用转化与自动化邮件营销优化，订户流失率 23%→11%，MRR 17%→5.4%</p>
              <div class="metrics">
                <span class="metric">Churn：11%</span>
                <span class="metric">MRR Churn：5.4%</span>
              </div>
            </div>
          </div>
        </div>
      `,
      'showreel': `
        <div class="level-content">
          <h3>3D 展示与内容上云</h3>
          <div class="content-grid">
            <div class="content-item">
              <h4>Gaussian Splatting + VR</h4>
              <p>基于 3D Gaussian 与全景 VR 的在线展示，打通渲染-分享闭环</p>
              <div class="metrics">
                <span class="metric">画质：4K</span>
                <span class="metric">VR：360°</span>
              </div>
            </div>
          </div>
        </div>
      `,
      'plm': `
        <div class="level-content">
          <h3>PLM 设计生产对接</h3>
          <div class="content-grid">
            <div class="content-item">
              <h4>设计与生产一体化</h4>
              <p>从零搭建 PLM 系统（订单后台/审核平台/数据仪表盘），支撑 300+ 家企业</p>
              <div class="metrics">
                <span class="metric">资产流转：100 亿+</span>
                <span class="metric">效率：+40%</span>
              </div>
            </div>
          </div>
        </div>
      `,
      'oms': `
        <div class="level-content">
          <h3>订单 OMS 可视化</h3>
          <div class="content-grid">
            <div class="content-item">
              <h4>方案/图纸/JSON 一体化</h4>
              <p>主导 OMS 改版，整合方案、图纸与 JSON 数据管理与可视化</p>
              <div class="metrics">
                <span class="metric">IxDA：Shortlist</span>
                <span class="metric">准确率：99.5%</span>
              </div>
              <div class="badge">IxDA Shortlist</div>
            </div>
          </div>
        </div>
      `,
      'parametric-cad': `
        <div class="level-content">
          <h3>参数化 CAD 工具</h3>
          <div class="content-grid">
            <div class="content-item">
              <h4>生产级建模逻辑</h4>
              <p>与产品共同设计参数化编辑器建模与操作模式，落地办公/家具行业</p>
              <div class="metrics">
                <span class="metric">品牌：震旦/圣奥</span>
                <span class="metric">实时生成</span>
              </div>
            </div>
          </div>
        </div>
      `,
      'design-system': `
        <div class="level-content">
          <h3>设计系统与用户研究</h3>
          <div class="content-grid">
            <div class="content-item">
              <h4>React 组件库 & 画像</h4>
              <p>参与 Tools UI 组件库设计维护；结合问卷与 Tableau 建互动式用户画像</p>
              <div class="metrics">
                <span class="metric">组件：200+ 可复用</span>
                <span class="metric">覆盖全线工具</span>
              </div>
            </div>
          </div>
        </div>
      `,
      'diverseshot': `
        <div class="level-content">
          <h3>DiverseShot</h3>
          <div class="content-grid">
            <div class="content-item">
              <h4>DiverseShot Platform</h4>
              <p>Built photography platform promoting diversity and inclusion in visual content</p>
              <div class="metrics">
                <span class="metric">Users: 5K+ Active</span>
                <span class="metric">Content: 10K+ Images</span>
              </div>
            </div>
          </div>
        </div>
      `,
      'personal-site': `
        <div class="level-content">
          <h3>Personal Site</h3>
          <div class="content-grid">
            <div class="content-item">
              <h4>Interactive Portfolio</h4>
              <p>Designed and developed game-console style personal portfolio with immersive user experience</p>
              <div class="metrics">
                <span class="metric">Performance: 95+ Lighthouse</span>
                <span class="metric">Accessibility: AAA Rating</span>
              </div>
            </div>
          </div>
        </div>
      `,
      'experiments': `
        <div class="level-content">
          <h3>Other Experiments</h3>
          <div class="content-grid">
            <div class="content-item">
              <h4>AI Workflow Components</h4>
              <p>Developed reusable AI workflow components for design automation and optimization</p>
              <div class="metrics">
                <span class="metric">Components: 20+ Reusable</span>
                <span class="metric">Efficiency: 60% Time Saved</span>
              </div>
            </div>
          </div>
        </div>
      `
    };

    return contentMap[levelId] || '<div class="level-content"><h3>Content not found</h3></div>';
  }

  updateIndicatorText() {
    const cartridgeElement = document.getElementById('current-cartridge');
    const levelElement = document.getElementById('current-level');
    
    if (this.currentCartridge) {
      const cartridgeNames = {
        'd5': 'D5 Render',
        'kujiale': 'Kujiale',
        'projects': 'Side Projects'
      };
      cartridgeElement.textContent = cartridgeNames[this.currentCartridge] || this.currentCartridge;
    } else {
      cartridgeElement.textContent = '-';
    }
    
    if (this.currentLevel) {
      levelElement.textContent = this.currentLevel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    } else {
      levelElement.textContent = '-';
    }
  }

  setupGameControls() {
    // AWSD controls
    document.querySelectorAll('.control-btn').forEach(btn => {
      const handler = (e) => {
        const direction = e.target.dataset.direction;
        this.handleDirection(direction);
      };
      btn.addEventListener('click', handler);
      this.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // A/B buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
      const handler = (e) => {
        const action = e.target.dataset.action;
        this.handleAction(action);
      };
      btn.addEventListener('click', handler);
      this.eventListeners.push({ element: btn, event: 'click', handler });
    });
  }

  handleDirection(direction) {
    switch (direction) {
      case 'up':
        this.prevProject();
        break;
      case 'down':
        this.nextProject();
        break;
      case 'left':
        // Previous level or content
        this.showFeedback('Previous content');
        break;
      case 'right':
        // Next level or content
        this.showFeedback('Next content');
        break;
    }
  }

  handleAction(action) {
    switch (action) {
      case 'confirm':
        if (this.currentCartridge && this.currentLevel) {
          this.showFeedback('Action confirmed!');
        } else {
          this.showFeedback('Please select a cartridge and level first');
        }
        break;
      case 'back':
        if (this.currentLevel) {
          this.currentLevel = null;
          this.updateIndicatorText();
          this.loadCartridgeContent(this.currentCartridge);
          this.showFeedback('Back to cartridge selection');
        } else if (this.currentCartridge) {
          this.currentCartridge = null;
          this.updateIndicatorText();
          this.resetViewport();
          this.showFeedback('Back to main menu');
        }
        break;
    }
  }

  handleKeyboard(e) {
    if (this.isModalOpen) return;
    
    switch (e.key.toLowerCase()) {
      case 'w':
        e.preventDefault();
        this.handleDirection('up');
        break;
      case 's':
        e.preventDefault();
        this.handleDirection('down');
        break;
      case 'a':
        e.preventDefault();
        this.handleDirection('left');
        break;
      case 'd':
        e.preventDefault();
        this.handleDirection('right');
        break;
      case 'enter':
      case ' ':
        e.preventDefault();
        this.handleAction('confirm');
        break;
      case 'escape':
        e.preventDefault();
        this.handleAction('back');
        break;
    }
  }

  resetViewport() {
    const viewport = document.getElementById('game-viewport');
    const viewportContent = viewport.querySelector('.viewport-content');
    
    viewportContent.innerHTML = `
      <div class="welcome-message">
        <h3>${this.getText('ui.welcome')}</h3>
        <p>${this.getText('ui.welcomeDesc')}</p>
      </div>
    `;
  }

  updateStartButton() {
    const startButton = document.getElementById('start-button');
    const buttonText = startButton.querySelector('span');
    
    if (this.isCartridgeSelected) {
      startButton.classList.add('exit-mode');
      buttonText.textContent = this.getText('ui.exit');
    } else {
      startButton.classList.remove('exit-mode');
      buttonText.textContent = this.getText('ui.start');
    }
  }

  exitCartridge() {
    this.currentCartridge = null;
    this.currentLevel = null;
    this.isCartridgeSelected = false;
    
    // Update indicator text
    this.updateIndicatorText();
    
    // Reset viewport
    this.resetViewport();
    
    // Update start button
    this.updateStartButton();
    
    // Show feedback
    this.showFeedback('Cartridge ejected successfully!');
  }

  showFeedback(message) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'feedback-message';
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--accent-blue);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 1001;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
      feedback.remove();
    }, 3000);
  }

  // Language switching
  switchLanguage(lang) {
    console.log('🔄 switchLanguage called with:', lang);
    console.log('🔄 Current language:', this.currentLanguage);
    
    if (lang === this.currentLanguage) {
      console.log('⚠️ Same language, returning early');
      return;
    }
    
    console.log('✅ Switching language from', this.currentLanguage, 'to', lang);
    this.currentLanguage = lang;
    
    // Update active button
    const buttons = document.querySelectorAll('.lang-btn');
    console.log('🔘 Updating', buttons.length, 'language buttons');
    buttons.forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      console.log(`🔘 Button ${btn.dataset.lang} active:`, isActive);
    });
    
    // Update UI texts
    console.log('📝 Updating UI texts...');
    this.updateUITexts();
    
    // Save language preference
    localStorage.setItem('game-dashboard-language', lang);
    console.log('💾 Language preference saved:', lang);
    console.log('✅ Language switch completed');
  }

  // Cleanup method to remove all event listeners
  destroy() {
    // Clear interval
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }

    // Remove all event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }
}

// Initialize when DOM is loaded
let gameDashboardInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM Content Loaded - Initializing GameDashboard...');
  gameDashboardInstance = new GameDashboard();
  // Make it globally accessible for debugging
  window.gameDashboardInstance = gameDashboardInstance;
  console.log('✅ GameDashboard instance created and assigned to window.gameDashboardInstance');
  console.log('🔍 Language switcher element exists:', !!document.querySelector('.language-switcher'));
  console.log('🔍 Language buttons found:', document.querySelectorAll('.lang-btn').length);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (gameDashboardInstance) {
    gameDashboardInstance.destroy();
    gameDashboardInstance = null;
  }
});
