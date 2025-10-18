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
    this.isMusicEnabled = true; // 音乐开关状态
    this.isInPreviewMode = false; // 预览模式状态
    this.previousViewportContent = null; // 保存之前的内容
    
    this.init();
  }

  // 音效播放方法
  playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Audio play failed:', e));
    }
  }

  // 播放背景音乐
  playBackgroundMusic() {
    const bgMusic = document.getElementById('backgroundMusic');
    if (bgMusic) {
      bgMusic.volume = 0.3; // 设置较低的音量
      console.log('🎵 Attempting to play background music...');
      bgMusic.play().then(() => {
        console.log('🎵 Background music started successfully');
      }).catch(e => {
        console.log('🎵 Background music play failed:', e);
        // 如果是用户交互限制，尝试在用户交互后播放
        if (e.name === 'NotAllowedError') {
          console.log('🎵 Waiting for user interaction to play music...');
          document.addEventListener('click', () => {
            bgMusic.play().catch(err => console.log('🎵 Music play failed after interaction:', err));
          }, { once: true });
        }
      });
    } else {
      console.error('🎵 Background music element not found');
    }
  }

  // 停止背景音乐
  stopBackgroundMusic() {
    const bgMusic = document.getElementById('backgroundMusic');
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
  }

  // 切换音乐开关
  toggleMusic() {
    this.isMusicEnabled = !this.isMusicEnabled;
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const musicIcon = musicToggleBtn.querySelector('.music-icon');
    
    if (this.isMusicEnabled) {
      this.playBackgroundMusic();
      musicToggleBtn.classList.remove('muted');
      musicToggleBtn.classList.add('playing');
      musicIcon.textContent = '🎵';
      musicToggleBtn.title = 'Music: ON';
    } else {
      this.stopBackgroundMusic();
      musicToggleBtn.classList.remove('playing');
      musicToggleBtn.classList.add('muted');
      musicIcon.textContent = '🔇';
      musicToggleBtn.title = 'Music: OFF';
    }
    
    // 保存音乐状态到localStorage
    localStorage.setItem('game-dashboard-music-enabled', this.isMusicEnabled.toString());
  }

  // 初始化音乐按钮状态
  initializeMusicButton() {
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const musicIcon = musicToggleBtn.querySelector('.music-icon');
    
    if (this.isMusicEnabled) {
      musicToggleBtn.classList.add('playing');
      musicIcon.textContent = '🎵';
      musicToggleBtn.title = 'Music: ON';
    } else {
      musicToggleBtn.classList.add('muted');
      musicIcon.textContent = '🔇';
      musicToggleBtn.title = 'Music: OFF';
    }
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
    
    // Load saved music preference
    const savedMusicState = localStorage.getItem('game-dashboard-music-enabled');
    if (savedMusicState !== null) {
      this.isMusicEnabled = savedMusicState === 'true';
    }
    console.log('🎵 Music enabled:', this.isMusicEnabled);
    
    this.setupEventListeners();
    this.setupTabSwitching();
    this.setupModal();
    this.setupGameControls();
    this.updateUITexts();
    
    // 初始化音乐按钮状态
    this.initializeMusicButton();
    
    // 播放背景音乐（如果启用）
    if (this.isMusicEnabled) {
      setTimeout(() => {
        this.playBackgroundMusic();
      }, 1000); // 延迟1秒播放，确保页面完全加载
      
      // 额外的保险机制：在页面完全加载后再次尝试播放
      window.addEventListener('load', () => {
        if (this.isMusicEnabled) {
          setTimeout(() => {
            this.playBackgroundMusic();
          }, 500);
        }
      });
    }
    
    // Show initial welcome message
    this.resetViewport();
    
    // Set initial active language button
    const langButtons = document.querySelectorAll('.lang-btn');
    console.log('🔘 Found language buttons:', langButtons.length);
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
      console.log(`🔘 Button ${btn.dataset.lang} active:`, btn.classList.contains('active'));
    });
    
    // Bind resize events for responsive 3D carousel
    this.bindResizeEvents();
    
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
          d5: {
            name: profileData.cartridges?.[0]?.nameZh || "D5 渲染器",
            title: profileData.cartridges?.[0]?.titleZh || "产品经理",
            previewUrl: profileData.cartridges?.[0]?.previewUrl || ""
          },
          kujiale: {
            name: profileData.cartridges?.[1]?.nameZh || "酷家乐",
            title: profileData.cartridges?.[1]?.titleZh || "高级产品经理",
            previewUrl: profileData.cartridges?.[1]?.previewUrl || ""
          },
          projects: {
            name: profileData.cartridges?.[2]?.nameZh || "个人项目",
            title: profileData.cartridges?.[2]?.titleZh || "产品设计师",
            previewUrl: profileData.cartridges?.[2]?.previewUrl || ""
          }
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
          aboutYu: profileData.ui?.aboutYu?.zh || "关于刘禹",
          cartridge: profileData.ui?.cartridge?.zh || "卡带",
          level: profileData.ui?.level?.zh || "关卡",
          cards: profileData.ui?.cards?.zh || "卡片",
          moreDetails: profileData.ui?.moreDetails?.zh || "更多细节",
          modal: {
            title: profileData.ui?.modal?.title?.zh || "选择游戏卡带",
            description: profileData.ui?.modal?.description?.zh || "从收藏中选择一个游戏开始你的冒险",
            selectButton: profileData.ui?.modal?.selectButton?.zh || "选择此游戏",
            closeButton: profileData.ui?.modal?.closeButton?.zh || "×"
          },
          cartridgeInfo: {
            d5: {
              genre: profileData.ui?.cartridgeInfo?.d5?.genre?.zh || "实时渲染",
              description: profileData.ui?.cartridgeInfo?.d5?.description?.zh || "专业的实时渲染引擎，为设计师提供强大的3D可视化工具"
            },
            kujiale: {
              genre: profileData.ui?.cartridgeInfo?.kujiale?.genre?.zh || "家装设计",
              description: profileData.ui?.cartridgeInfo?.kujiale?.description?.zh || "领先的家装设计平台，提供从设计到施工的全流程解决方案"
            },
            projects: {
              genre: profileData.ui?.cartridgeInfo?.projects?.genre?.zh || "个人项目",
              description: profileData.ui?.cartridgeInfo?.projects?.description?.zh || "探索创新想法，实践前沿技术，打造有趣的产品体验"
            }
          },
          gameConsole: profileData.ui?.gameConsole?.titleZh || "游戏控制台",
          contact: {
            title: profileData.ui?.contact?.title?.zh || "联系方式",
            phone: profileData.ui?.contact?.phone?.zh || "📞 电话",
            email: profileData.ui?.contact?.email?.zh || "📧 邮箱",
            website: profileData.ui?.contact?.website?.zh || "🌐 网站",
            location: profileData.ui?.contact?.location?.zh || "📍 位置"
          }
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
        },
        experience: {
          d5: {
            levels: {
              "team-edition": {
                name: profileData.experience?.d5?.levels?.["team-edition"]?.nameZh || "团队版从0→10",
                bulletPoints: (() => {
                  const rawBulletPoints = profileData.experience?.d5?.levels?.["team-edition"]?.bulletPoints;
                  console.log('🔍 Raw bulletPoints for team-edition:', rawBulletPoints);
                  if (!rawBulletPoints) return [];
                  return rawBulletPoints.map(bp => {
                    console.log('🔍 Processing BP:', bp);
                    return {
                      title: bp.titleZh || bp.title || bp.titleJa,
                      desc: bp.descZh || bp.desc || bp.descJa
                    };
                  });
                })()
              },
              "collaboration": {
                name: profileData.experience?.d5?.levels?.collaboration?.nameZh || "协作体系",
                bulletPoints: profileData.experience?.d5?.levels?.collaboration?.bulletPoints?.map(bp => ({
                  title: bp.titleZh || bp.title || bp.titleJa,
                  desc: bp.descZh || bp.desc || bp.descJa
                })) || []
              },
              "commercialization": {
                name: profileData.experience?.d5?.levels?.commercialization?.nameZh || "商业化与增长",
                bulletPoints: profileData.experience?.d5?.levels?.commercialization?.bulletPoints?.map(bp => ({
                  title: bp.titleZh || bp.title || bp.titleJa,
                  desc: bp.descZh || bp.desc || bp.descJa
                })) || []
              },
              "showreel": {
                name: profileData.experience?.d5?.levels?.showreel?.nameZh || "3D展示",
                bulletPoints: profileData.experience?.d5?.levels?.showreel?.bulletPoints?.map(bp => ({
                  title: bp.titleZh || bp.title || bp.titleJa,
                  desc: bp.descZh || bp.desc || bp.descJa
                })) || []
              }
            }
          },
          kujiale: {
            levels: {
              "plm": {
                name: profileData.experience?.kujiale?.levels?.plm?.nameZh || "PLM系统",
                bulletPoints: profileData.experience?.kujiale?.levels?.plm?.bulletPoints?.map(bp => ({
                  title: bp.titleZh || bp.title || bp.titleJa,
                  desc: bp.descZh || bp.desc || bp.descJa
                })) || []
              },
              "oms": {
                name: profileData.experience?.kujiale?.levels?.oms?.nameZh || "OMS平台",
                bulletPoints: profileData.experience?.kujiale?.levels?.oms?.bulletPoints?.map(bp => ({
                  title: bp.titleZh || bp.title || bp.titleJa,
                  desc: bp.descZh || bp.desc || bp.descJa
                })) || []
              },
              "parametric-cad": {
                name: profileData.experience?.kujiale?.levels?.["parametric-cad"]?.nameZh || "参数化CAD",
                bulletPoints: profileData.experience?.kujiale?.levels?.["parametric-cad"]?.bulletPoints?.map(bp => ({
                  title: bp.titleZh || bp.title || bp.titleJa,
                  desc: bp.descZh || bp.desc || bp.descJa
                })) || []
              },
              "design-system": {
                name: profileData.experience?.kujiale?.levels?.["design-system"]?.nameZh || "设计系统",
                bulletPoints: profileData.experience?.kujiale?.levels?.["design-system"]?.bulletPoints?.map(bp => ({
                  title: bp.titleZh || bp.title || bp.titleJa,
                  desc: bp.descZh || bp.desc || bp.descJa
                })) || []
              }
            }
          },
          projects: {
            levels: {
              "diverseshot": {
                name: profileData.experience?.projects?.levels?.diverseshot?.nameZh || "DiverseShot",
                bulletPoints: profileData.experience?.projects?.levels?.diverseshot?.bulletPoints?.map(bp => ({
                  title: bp.titleZh || bp.title || bp.titleJa,
                  desc: bp.descZh || bp.desc || bp.descJa
                })) || []
              },
              "personal-site": {
                name: profileData.experience?.projects?.levels?.["personal-site"]?.nameZh || "个人站点",
                bulletPoints: profileData.experience?.projects?.levels?.["personal-site"]?.bulletPoints?.map(bp => ({
                  title: bp.titleZh || bp.title || bp.titleJa,
                  desc: bp.descZh || bp.desc || bp.descJa
                })) || []
              },
              "experiments": {
                name: profileData.experience?.projects?.levels?.experiments?.nameZh || "其它实验",
                bulletPoints: profileData.experience?.projects?.levels?.experiments?.bulletPoints?.map(bp => ({
                  title: bp.titleZh || bp.title || bp.titleJa,
                  desc: bp.descZh || bp.desc || bp.descJa
                })) || []
              }
            }
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
          d5: {
            name: profileData.cartridges?.[0]?.name || "D5 Render",
            title: profileData.cartridges?.[0]?.title || "Product Manager",
            previewUrl: profileData.cartridges?.[0]?.previewUrl || ""
          },
          kujiale: {
            name: profileData.cartridges?.[1]?.name || "Kujiale",
            title: profileData.cartridges?.[1]?.title || "Senior Product Manager",
            previewUrl: profileData.cartridges?.[1]?.previewUrl || ""
          },
          projects: {
            name: profileData.cartridges?.[2]?.name || "Side Projects",
            title: profileData.cartridges?.[2]?.title || "Product Designer",
            previewUrl: profileData.cartridges?.[2]?.previewUrl || ""
          }
        },
        tabs: {
          skills: profileData.ui?.tabs?.skills?.en || "Skills",
          achievements: profileData.ui?.tabs?.achievements?.en || "Wins",
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
          aboutYu: profileData.ui?.aboutYu?.en || "About Yu",
          cartridge: profileData.ui?.cartridge?.en || "Cartridge",
          level: profileData.ui?.level?.en || "Level",
          cards: profileData.ui?.cards?.en || "Cards",
          moreDetails: profileData.ui?.moreDetails?.en || "More Details",
          modal: {
            title: profileData.ui?.modal?.title?.en || "Select Game Cartridge",
            description: profileData.ui?.modal?.description?.en || "Choose a game from your collection to start your adventure",
            selectButton: profileData.ui?.modal?.selectButton?.en || "Select This Game",
            closeButton: profileData.ui?.modal?.closeButton?.en || "×"
          },
          cartridgeInfo: {
            d5: {
              genre: profileData.ui?.cartridgeInfo?.d5?.genre?.en || "Real-time Rendering",
              description: profileData.ui?.cartridgeInfo?.d5?.description?.en || "Professional real-time rendering engine providing powerful 3D visualization tools for designers"
            },
            kujiale: {
              genre: profileData.ui?.cartridgeInfo?.kujiale?.genre?.en || "Home Design",
              description: profileData.ui?.cartridgeInfo?.kujiale?.description?.en || "Leading home design platform providing end-to-end solutions from design to construction"
            },
            projects: {
              genre: profileData.ui?.cartridgeInfo?.projects?.genre?.en || "Personal Projects",
              description: profileData.ui?.cartridgeInfo?.projects?.description?.en || "Exploring innovative ideas, practicing cutting-edge technologies, creating interesting product experiences"
            }
          },
          gameConsole: profileData.ui?.gameConsole?.title || "Game Console",
          contact: {
            title: profileData.ui?.contact?.title?.en || "Contact",
            phone: profileData.ui?.contact?.phone?.en || "📞 Phone",
            email: profileData.ui?.contact?.email?.en || "📧 Email",
            website: profileData.ui?.contact?.website?.en || "🌐 Website",
            location: profileData.ui?.contact?.location?.en || "📍 Location"
          }
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
        },
        experience: {
          d5: {
            levels: {
              "team-edition": {
                name: profileData.experience?.d5?.levels?.["team-edition"]?.name || "Team Edition 0→1",
                bulletPoints: profileData.experience?.d5?.levels?.["team-edition"]?.bulletPoints?.map(bp => ({
                  title: bp.titleEn || bp.title || bp.titleZh,
                  desc: bp.descEn || bp.desc || bp.descZh
                })) || []
              },
              "collaboration": {
                name: profileData.experience?.d5?.levels?.collaboration?.name || "Collaboration System",
                bulletPoints: profileData.experience?.d5?.levels?.collaboration?.bulletPoints?.map(bp => ({
                  title: bp.titleEn || bp.title || bp.titleZh,
                  desc: bp.descEn || bp.desc || bp.descZh
                })) || []
              },
              "commercialization": {
                name: profileData.experience?.d5?.levels?.commercialization?.name || "Commercialization & Growth",
                bulletPoints: profileData.experience?.d5?.levels?.commercialization?.bulletPoints?.map(bp => ({
                  title: bp.titleEn || bp.title || bp.titleZh,
                  desc: bp.descEn || bp.desc || bp.descZh
                })) || []
              },
              "showreel": {
                name: profileData.experience?.d5?.levels?.showreel?.name || "3D Showreel",
                bulletPoints: profileData.experience?.d5?.levels?.showreel?.bulletPoints?.map(bp => ({
                  title: bp.titleEn || bp.title || bp.titleZh,
                  desc: bp.descEn || bp.desc || bp.descZh
                })) || []
              }
            }
          },
          kujiale: {
            levels: {
              "plm": {
                name: profileData.experience?.kujiale?.levels?.plm?.name || "PLM System",
                bulletPoints: profileData.experience?.kujiale?.levels?.plm?.bulletPoints?.map(bp => ({
                  title: bp.titleEn || bp.title || bp.titleZh,
                  desc: bp.descEn || bp.desc || bp.descZh
                })) || []
              },
              "oms": {
                name: profileData.experience?.kujiale?.levels?.oms?.name || "OMS Platform",
                bulletPoints: profileData.experience?.kujiale?.levels?.oms?.bulletPoints?.map(bp => ({
                  title: bp.titleEn || bp.title || bp.titleZh,
                  desc: bp.descEn || bp.desc || bp.descZh
                })) || []
              },
              "parametric-cad": {
                name: profileData.experience?.kujiale?.levels?.["parametric-cad"]?.name || "Parametric CAD",
                bulletPoints: profileData.experience?.kujiale?.levels?.["parametric-cad"]?.bulletPoints?.map(bp => ({
                  title: bp.titleEn || bp.title || bp.titleZh,
                  desc: bp.descEn || bp.desc || bp.descZh
                })) || []
              },
              "design-system": {
                name: profileData.experience?.kujiale?.levels?.["design-system"]?.name || "Design System",
                bulletPoints: profileData.experience?.kujiale?.levels?.["design-system"]?.bulletPoints?.map(bp => ({
                  title: bp.titleEn || bp.title || bp.titleZh,
                  desc: bp.descEn || bp.desc || bp.descZh
                })) || []
              }
            }
          },
          projects: {
            levels: {
              "diverseshot": {
                name: profileData.experience?.projects?.levels?.diverseshot?.name || "DiverseShot",
                bulletPoints: profileData.experience?.projects?.levels?.diverseshot?.bulletPoints?.map(bp => ({
                  title: bp.titleEn || bp.title || bp.titleZh,
                  desc: bp.descEn || bp.desc || bp.descZh
                })) || []
              },
              "personal-site": {
                name: profileData.experience?.projects?.levels?.["personal-site"]?.name || "Personal Site",
                bulletPoints: profileData.experience?.projects?.levels?.["personal-site"]?.bulletPoints?.map(bp => ({
                  title: bp.titleEn || bp.title || bp.titleZh,
                  desc: bp.descEn || bp.desc || bp.descZh
                })) || []
              },
              "experiments": {
                name: profileData.experience?.projects?.levels?.experiments?.name || "Other Experiments",
                bulletPoints: profileData.experience?.projects?.levels?.experiments?.bulletPoints?.map(bp => ({
                  title: bp.titleEn || bp.title || bp.titleZh,
                  desc: bp.descEn || bp.desc || bp.descZh
                })) || []
              }
            }
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
          d5: {
            name: profileData.cartridges?.[0]?.nameJa || "D5 レンダー",
            title: profileData.cartridges?.[0]?.titleJa || "プロダクトマネージャー",
            previewUrl: profileData.cartridges?.[0]?.previewUrl || ""
          },
          kujiale: {
            name: profileData.cartridges?.[1]?.nameJa || "クージャレ",
            title: profileData.cartridges?.[1]?.titleJa || "シニアプロダクトマネージャー",
            previewUrl: profileData.cartridges?.[1]?.previewUrl || ""
          },
          projects: {
            name: profileData.cartridges?.[2]?.nameJa || "サイドプロジェクト",
            title: profileData.cartridges?.[2]?.titleJa || "プロダクトデザイナー",
            previewUrl: profileData.cartridges?.[2]?.previewUrl || ""
          }
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
          aboutYu: profileData.ui?.aboutYu?.ja || "Yuについて",
          cartridge: profileData.ui?.cartridge?.ja || "カートリッジ",
          level: profileData.ui?.level?.ja || "レベル",
          cards: profileData.ui?.cards?.ja || "カード",
          moreDetails: profileData.ui?.moreDetails?.ja || "詳細を見る",
          modal: {
            title: profileData.ui?.modal?.title?.ja || "ゲームカートリッジを選択",
            description: profileData.ui?.modal?.description?.ja || "コレクションからゲームを選んで冒険を始めましょう",
            selectButton: profileData.ui?.modal?.selectButton?.ja || "このゲームを選択",
            closeButton: profileData.ui?.modal?.closeButton?.ja || "×"
          },
          cartridgeInfo: {
            d5: {
              genre: profileData.ui?.cartridgeInfo?.d5?.genre?.ja || "リアルタイムレンダリング",
              description: profileData.ui?.cartridgeInfo?.d5?.description?.ja || "デザイナー向けの強力な3D可視化ツールを提供するプロフェッショナルなリアルタイムレンダリングエンジン"
            },
            kujiale: {
              genre: profileData.ui?.cartridgeInfo?.kujiale?.genre?.ja || "住宅デザイン",
              description: profileData.ui?.cartridgeInfo?.kujiale?.description?.ja || "設計から施工まで全工程のソリューションを提供する住宅デザインのリーディングプラットフォーム"
            },
            projects: {
              genre: profileData.ui?.cartridgeInfo?.projects?.genre?.ja || "個人プロジェクト",
              description: profileData.ui?.cartridgeInfo?.projects?.description?.ja || "革新的なアイデアを探求し、最先端技術を実践し、興味深いプロダクト体験を創造"
            }
          },
          gameConsole: profileData.ui?.gameConsole?.titleJa || "ゲームコンソール",
          contact: {
            title: profileData.ui?.contact?.title?.ja || "連絡先",
            phone: profileData.ui?.contact?.phone?.ja || "📞 電話",
            email: profileData.ui?.contact?.email?.ja || "📧 メール",
            website: profileData.ui?.contact?.website?.ja || "🌐 ウェブサイト",
            location: profileData.ui?.contact?.location?.ja || "📍 所在地"
          }
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
        },
        experience: {
          d5: {
            levels: {
              "team-edition": {
                name: profileData.experience?.d5?.levels?.["team-edition"]?.nameJa || "チーム版 0→1",
                bulletPoints: profileData.experience?.d5?.levels?.["team-edition"]?.bulletPoints?.map(bp => ({
                  title: bp.titleJa || bp.title || bp.titleZh,
                  desc: bp.descJa || bp.desc || bp.descZh
                })) || []
              },
              "collaboration": {
                name: profileData.experience?.d5?.levels?.collaboration?.nameJa || "コラボレーションシステム",
                bulletPoints: profileData.experience?.d5?.levels?.collaboration?.bulletPoints?.map(bp => ({
                  title: bp.titleJa || bp.title || bp.titleZh,
                  desc: bp.descJa || bp.desc || bp.descZh
                })) || []
              },
              "commercialization": {
                name: profileData.experience?.d5?.levels?.commercialization?.nameJa || "商業化と成長",
                bulletPoints: profileData.experience?.d5?.levels?.commercialization?.bulletPoints?.map(bp => ({
                  title: bp.titleJa || bp.title || bp.titleZh,
                  desc: bp.descJa || bp.desc || bp.descZh
                })) || []
              },
              "showreel": {
                name: profileData.experience?.d5?.levels?.showreel?.nameJa || "3Dショーリール",
                bulletPoints: profileData.experience?.d5?.levels?.showreel?.bulletPoints?.map(bp => ({
                  title: bp.titleJa || bp.title || bp.titleZh,
                  desc: bp.descJa || bp.desc || bp.descZh
                })) || []
              }
            }
          },
          kujiale: {
            levels: {
              "plm": {
                name: profileData.experience?.kujiale?.levels?.plm?.nameJa || "PLMシステム",
                bulletPoints: profileData.experience?.kujiale?.levels?.plm?.bulletPoints?.map(bp => ({
                  title: bp.titleJa || bp.title || bp.titleZh,
                  desc: bp.descJa || bp.desc || bp.descZh
                })) || []
              },
              "oms": {
                name: profileData.experience?.kujiale?.levels?.oms?.nameJa || "OMSプラットフォーム",
                bulletPoints: profileData.experience?.kujiale?.levels?.oms?.bulletPoints?.map(bp => ({
                  title: bp.titleJa || bp.title || bp.titleZh,
                  desc: bp.descJa || bp.desc || bp.descZh
                })) || []
              },
              "parametric-cad": {
                name: profileData.experience?.kujiale?.levels?.["parametric-cad"]?.nameJa || "パラメトリックCAD",
                bulletPoints: profileData.experience?.kujiale?.levels?.["parametric-cad"]?.bulletPoints?.map(bp => ({
                  title: bp.titleJa || bp.title || bp.titleZh,
                  desc: bp.descJa || bp.desc || bp.descZh
                })) || []
              },
              "design-system": {
                name: profileData.experience?.kujiale?.levels?.["design-system"]?.nameJa || "デザインシステム",
                bulletPoints: profileData.experience?.kujiale?.levels?.["design-system"]?.bulletPoints?.map(bp => ({
                  title: bp.titleJa || bp.title || bp.titleZh,
                  desc: bp.descJa || bp.desc || bp.descZh
                })) || []
              }
            }
          },
          projects: {
            levels: {
              "diverseshot": {
                name: profileData.experience?.projects?.levels?.diverseshot?.nameJa || "DiverseShot",
                bulletPoints: profileData.experience?.projects?.levels?.diverseshot?.bulletPoints?.map(bp => ({
                  title: bp.titleJa || bp.title || bp.titleZh,
                  desc: bp.descJa || bp.desc || bp.descZh
                })) || []
              },
              "personal-site": {
                name: profileData.experience?.projects?.levels?.["personal-site"]?.nameJa || "個人サイト",
                bulletPoints: profileData.experience?.projects?.levels?.["personal-site"]?.bulletPoints?.map(bp => ({
                  title: bp.titleJa || bp.title || bp.titleZh,
                  desc: bp.descJa || bp.desc || bp.descZh
                })) || []
              },
              "experiments": {
                name: profileData.experience?.projects?.levels?.experiments?.nameJa || "その他の実験",
                bulletPoints: profileData.experience?.projects?.levels?.experiments?.bulletPoints?.map(bp => ({
                  title: bp.titleJa || bp.title || bp.titleZh,
                  desc: bp.descJa || bp.desc || bp.descZh
                })) || []
              }
            }
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
    
    // 更新带有data-text-key属性的元素
    const textKeyElements = document.querySelectorAll('[data-text-key]');
    console.log('📝 Found', textKeyElements.length, 'elements with data-text-key');
    textKeyElements.forEach(element => {
      const textKey = element.dataset.textKey;
      const text = this.getText(textKey, element.textContent);
      console.log(`📝 Element with key "${textKey}": "${text}"`);
      element.textContent = text;
    });
    
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

    // 更新contact模块文本
    const contactTitle = document.getElementById('contact-title');
    const phoneLabel = document.getElementById('phone-label');
    const emailLabel = document.getElementById('email-label');
    const websiteLabel = document.getElementById('website-label');
    const locationLabel = document.getElementById('location-label');
    
    if (contactTitle) {
      contactTitle.textContent = this.getText('ui.contact.title');
    }
    if (phoneLabel) {
      phoneLabel.textContent = this.getText('ui.contact.phone');
    }
    if (emailLabel) {
      emailLabel.textContent = this.getText('ui.contact.email');
    }
    if (websiteLabel) {
      websiteLabel.textContent = this.getText('ui.contact.website');
    }
    if (locationLabel) {
      locationLabel.textContent = this.getText('ui.contact.location');
    }

    // 更新modal文本
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    if (modalTitle) {
      modalTitle.textContent = this.getText('ui.modal.title');
    }
    if (modalDescription) {
      modalDescription.textContent = this.getText('ui.modal.description');
    }

    // 更新cartridge信息文本
    const cartridgeInfo = [
      { id: 'd5', genreId: 'd5-genre', descId: 'd5-desc', btnId: 'd5-select-btn' },
      { id: 'kujiale', genreId: 'kujiale-genre', descId: 'kujiale-desc', btnId: 'kujiale-select-btn' },
      { id: 'projects', genreId: 'projects-genre', descId: 'projects-desc', btnId: 'projects-select-btn' }
    ];

    cartridgeInfo.forEach(info => {
      const genreElement = document.getElementById(info.genreId);
      const descElement = document.getElementById(info.descId);
      const btnElement = document.getElementById(info.btnId);
      
      if (genreElement) {
        genreElement.textContent = this.getText(`ui.cartridgeInfo.${info.id}.genre`);
      }
      if (descElement) {
        descElement.textContent = this.getText(`ui.cartridgeInfo.${info.id}.description`);
      }
      if (btnElement) {
        btnElement.textContent = this.getText('ui.modal.selectButton');
      }
    });

    // 更新卡带文本
    const cartridgeCards = document.querySelectorAll('.cartridge-card');
    const cartridgeData = [
      { nameKey: 'cartridges.d5.name' },
      { nameKey: 'cartridges.kujiale.name' },
      { nameKey: 'cartridges.projects.name' }
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
          this.playSound('buttonClickSound');
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

    // Music toggle button
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    if (musicToggleBtn) {
      const musicHandler = (e) => {
        e.preventDefault();
        this.playSound('buttonClickSound');
        this.toggleMusic();
      };
      musicToggleBtn.addEventListener('click', musicHandler);
      this.eventListeners.push({ element: musicToggleBtn, event: 'click', handler: musicHandler });
      console.log('✅ Music toggle button event listener added');
    } else {
      console.error('❌ Music toggle button not found!');
    }

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const handler = (e) => {
        this.playSound('buttonClickSound');
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
        // 退出模式，播放game-over音效
        this.playSound('gameOverSound');
        this.exitCartridge();
      } else {
        // 开始模式，播放start音效
        this.playSound('gameStartSound');
        this.openModal();
      }
    };
    startButton.addEventListener('click', startHandler);
    this.eventListeners.push({ element: startButton, event: 'click', handler: startHandler });

    const modalClose = document.getElementById('modal-close');
    const closeHandler = () => {
      this.playSound('buttonClickSound');
      this.closeModal();
    };
    modalClose.addEventListener('click', closeHandler);
    this.eventListeners.push({ element: modalClose, event: 'click', handler: closeHandler });

    // Cartridge selection
    document.querySelectorAll('.cartridge-card').forEach(card => {
      const handler = () => {
        this.playSound('buttonClickSound');
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
    console.log('🎮 selectCartridge called with:', cartridgeId);
    this.currentCartridge = cartridgeId;
    this.currentLevel = null;
    this.isCartridgeSelected = true;
    
    console.log('🎮 currentCartridge set to:', this.currentCartridge);
    console.log('🎮 isCartridgeSelected set to:', this.isCartridgeSelected);
    
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
    console.log('🎮 loadCartridgeContent called with:', cartridgeId);
    const viewport = document.getElementById('game-viewport');
    const viewportContent = viewport.querySelector('.viewport-content');
    
    console.log('🎮 viewport found:', !!viewport);
    console.log('🎮 viewportContent found:', !!viewportContent);
    
    // Clear existing content
    viewportContent.innerHTML = '';
    
    // Load content based on cartridge
    switch (cartridgeId) {
      case 'd5':
        console.log('🎮 Loading D5 content');
        this.loadD5Content(viewportContent);
        break;
      case 'kujiale':
        console.log('🎮 Loading Kujiale content');
        this.loadKujialeContent(viewportContent);
        break;
      case 'projects':
        console.log('🎮 Loading Projects content');
        this.loadProjectsContent(viewportContent);
        break;
    }
  }

  loadD5Content(container) {
    const levels = [
      { id: 'team-edition', name: this.getText('experience.d5.levels.team-edition.name'), icon: '🚀' },
      { id: 'collaboration', name: this.getText('experience.d5.levels.collaboration.name'), icon: '🤝' },
      { id: 'commercialization', name: this.getText('experience.d5.levels.commercialization.name'), icon: '📈' },
      { id: 'showreel', name: this.getText('experience.d5.levels.showreel.name'), icon: '🎬' }
    ];

    container.innerHTML = `
      <div class="cartridge-content">
        <h3>${this.getText('cartridges.d5.name')} | ${this.getText('cartridges.d5.title')}</h3>
        <div class="level-grid">
          ${levels.map(level => `
            <div class="level-card" data-level="${level.id}">
              <div class="level-icon">${level.icon}</div>
              <div class="level-info">
                <h4>${level.name}</h4>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    // Add level selection handlers
    container.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.playSound('buttonClickSound');
        this.selectLevel(e.currentTarget.dataset.level);
      });
    });
  }

  loadKujialeContent(container) {
    const levels = [
      { id: 'plm', name: this.getText('experience.kujiale.levels.plm.name'), icon: '📋' },
      { id: 'oms', name: this.getText('experience.kujiale.levels.oms.name'), icon: '⚙️' },
      { id: 'parametric-cad', name: this.getText('experience.kujiale.levels.parametric-cad.name'), icon: '🔧' },
      { id: 'design-system', name: this.getText('experience.kujiale.levels.design-system.name'), icon: '🎨' }
    ];

    container.innerHTML = `
      <div class="cartridge-content">
        <h3>${this.getText('cartridges.kujiale.name')} | ${this.getText('cartridges.kujiale.title')}</h3>
        <div class="level-grid">
          ${levels.map(level => `
            <div class="level-card" data-level="${level.id}">
              <div class="level-icon">${level.icon}</div>
              <div class="level-info">
                <h4>${level.name}</h4>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    // Add level selection handlers
    container.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.playSound('buttonClickSound');
        this.selectLevel(e.currentTarget.dataset.level);
      });
    });
  }

  loadProjectsContent(container) {
    const levels = [
      { id: 'diverseshot', name: this.getText('experience.projects.levels.diverseshot.name'), icon: '📸' },
      { id: 'personal-site', name: this.getText('experience.projects.levels.personal-site.name'), icon: '🌐' },
      { id: 'experiments', name: this.getText('experience.projects.levels.experiments.name'), icon: '🧪' }
    ];

    container.innerHTML = `
      <div class="cartridge-content">
        <h3>${this.getText('cartridges.projects.name')} | ${this.getText('cartridges.projects.title')}</h3>
        <div class="level-grid">
          ${levels.map(level => `
            <div class="level-card" data-level="${level.id}">
              <div class="level-icon">${level.icon}</div>
              <div class="level-info">
                <h4>${level.name}</h4>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    // Add level selection handlers
    container.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.playSound('buttonClickSound');
        this.selectLevel(e.currentTarget.dataset.level);
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
    console.log('🔍 getLevelContent called with:', levelId);
    console.log('🔍 currentCartridge:', this.currentCartridge);
    console.log('🔍 currentLanguage:', this.currentLanguage);
    console.log('🔍 gameTexts exists:', !!this.gameTexts);
    
    if (!this.currentCartridge) {
      console.log('❌ No currentCartridge');
      return '<div class="level-content"><h3>Content not found - No cartridge</h3></div>';
    }

    if (!this.gameTexts) {
      console.log('❌ No gameTexts');
      return '<div class="level-content"><h3>Content not found - No gameTexts</h3></div>';
    }

    const levelData = this.gameTexts[this.currentLanguage]?.experience?.[this.currentCartridge]?.levels?.[levelId];
    console.log('🔍 levelData:', levelData);
    
    if (!levelData) {
      console.log('❌ No levelData found');
      return '<div class="level-content"><h3>Content not found - No level data</h3></div>';
    }

    const levelName = levelData.name || levelId;
    const bulletPoints = levelData.bulletPoints || [];
    console.log('🔍 levelName:', levelName);
    console.log('🔍 bulletPoints:', bulletPoints);

    // 存储bullet points数据供翻页使用
    this.currentBulletPoints = bulletPoints;
    this.currentBulletPointIndex = 0;

    // 为每个bullet point添加随机图片
    const imageUrls = [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop'
    ];

    const currentBP = bulletPoints[0];
    const currentImage = imageUrls[0 % imageUrls.length];

    let paginationControls = '';
    if (bulletPoints.length > 1) {
      paginationControls = `
        <div class="pagination-controls">
          <button class="pagination-btn prev-btn" onclick="gameDashboardInstance.previousBulletPoint()">
            <span>←</span>
          </button>
          <button class="pagination-btn next-btn" onclick="gameDashboardInstance.nextBulletPoint()">
            <span>→</span>
          </button>
              </div>
      `;
    }

    const html = `
        <div class="level-content">
        <h3>${levelName}</h3>
        ${paginationControls}
        <div class="carousel-container">
          <div class="carousel-wrapper">
            ${bulletPoints.map((bp, index) => {
              const imageUrls = [
                'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop'
              ];
              const image = imageUrls[index % imageUrls.length];
              const previewUrl = this.getText(`cartridges.${this.currentCartridge}.previewUrl`);
              const hasPreview = previewUrl && previewUrl.trim() !== '';
              
      return `
        <div class="carousel-card" data-index="${index}">
          <div class="card-image-container">
            <img src="${image}" alt="${bp.title}" class="card-image" loading="lazy">
          </div>
          <div class="card-content">
            <h4>${bp.title}</h4>
            <p>${bp.desc}</p>
            ${hasPreview ? `<button class="preview-btn" onclick="gameDashboardInstance.showPreview('${previewUrl}')" title="预览">
              <span class="preview-text">${this.getText('ui.moreDetails')}</span>
              <svg class="preview-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>` : ''}
          </div>
        </div>
      `;
            }).join('')}
            </div>
          </div>
        </div>
    `;
    
    console.log('🔍 Generated HTML:', html);
    
    // 初始化3D轮播效果
    setTimeout(() => {
      this.initialize3DCarousel();
    }, 100);
    
    return html;
  }

  initialize3DCarousel() {
    if (!this.currentBulletPoints || this.currentBulletPoints.length === 0) return;
    
    // 初始化所有卡片的3D变换
    this.updateBulletPointDisplay();
  }

  bindResizeEvents() {
    // 防抖处理resize事件
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // 如果当前有bulletpoints显示，重新计算3D变换
        if (this.currentBulletPoints && this.currentBulletPoints.length > 0) {
          this.updateBulletPointDisplay();
        }
      }, 100);
    });
  }

  // 翻页功能
  nextBulletPoint() {
    if (!this.currentBulletPoints || this.currentBulletPoints.length <= 1) return;
    
    this.currentBulletPointIndex = (this.currentBulletPointIndex + 1) % this.currentBulletPoints.length;
    this.updateBulletPointDisplay();
  }

  previousBulletPoint() {
    if (!this.currentBulletPoints || this.currentBulletPoints.length <= 1) return;
    
    this.currentBulletPointIndex = this.currentBulletPointIndex === 0 
      ? this.currentBulletPoints.length - 1 
      : this.currentBulletPointIndex - 1;
    this.updateBulletPointDisplay();
  }

  updateBulletPointDisplay() {
    if (!this.currentBulletPoints || this.currentBulletPoints.length === 0) return;

    // 更新所有卡片的3D变换
    const cards = document.querySelectorAll('.carousel-card');
    cards.forEach((card, index) => {
      const offset = index - this.currentBulletPointIndex;
      const absOffset = Math.abs(offset);
      
      // 计算3D变换 - 响应式coverflow效果
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;
      const isTinyMobile = window.innerWidth <= 375;
      const isMicroMobile = window.innerWidth <= 320;
      
      // 根据屏幕尺寸调整变换参数
      let translateX, translateZ, scale, opacity, blur, rotateY;
      
      if (isMicroMobile) {
        // 极小屏幕：最小变换幅度
        translateX = offset * 30;
        translateZ = -absOffset * 20;
        scale = 1 - absOffset * 0.05;
        opacity = 1 - absOffset * 0.2;
        blur = absOffset * 1;
        rotateY = offset * 5;
      } else if (isTinyMobile) {
        // 超小屏幕：减少变换幅度
        translateX = offset * 40;
        translateZ = -absOffset * 25;
        scale = 1 - absOffset * 0.08;
        opacity = 1 - absOffset * 0.25;
        blur = absOffset * 1.5;
        rotateY = offset * 8;
      } else if (isSmallMobile) {
        // 小屏幕：适中变换幅度
        translateX = offset * 50;
        translateZ = -absOffset * 30;
        scale = 1 - absOffset * 0.1;
        opacity = 1 - absOffset * 0.3;
        blur = absOffset * 2;
        rotateY = offset * 10;
      } else if (isMobile) {
        // 移动端：适中的变换幅度
        translateX = offset * 70;
        translateZ = -absOffset * 40;
        scale = 1 - absOffset * 0.12;
        opacity = 1 - absOffset * 0.35;
        blur = absOffset * 3;
        rotateY = offset * 15;
      } else {
        // 桌面端：完整的变换效果
        translateX = offset * 120;
        translateZ = -absOffset * 80;
        scale = 1 - absOffset * 0.15;
        opacity = 1 - absOffset * 0.4;
        blur = absOffset * 4;
        rotateY = offset * 20;
      }
      
      // 限制显示范围
      if (absOffset > 2) {
        opacity = 0;
        scale = 0.3;
        blur = 10;
      }
      
      // 应用变换
      card.style.transform = `
        translateX(${translateX}px) 
        translateZ(${translateZ}px) 
        scale(${scale}) 
        rotateY(${rotateY}deg)
      `;
      card.style.opacity = Math.max(0, opacity);
      card.style.filter = `blur(${blur}px)`;
      card.style.zIndex = this.currentBulletPoints.length - absOffset;
      
      // 添加/移除active类
      if (offset === 0) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // 更新按钮状态
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn && nextBtn) {
      prevBtn.disabled = false;
      nextBtn.disabled = false;
    }
  }

  updateIndicatorText() {
    const cartridgeElement = document.getElementById('current-cartridge');
    const levelElement = document.getElementById('current-level');
    
    if (this.currentCartridge) {
      cartridgeElement.textContent = this.getText(`cartridges.${this.currentCartridge}.name`);
    } else {
      cartridgeElement.textContent = '-';
    }
    
    if (this.currentLevel && this.currentCartridge) {
      levelElement.textContent = this.getText(`experience.${this.currentCartridge}.levels.${this.currentLevel}.name`);
    } else {
      levelElement.textContent = '-';
    }
  }

  showPreview(url) {
    console.log('🔍 showPreview called with URL:', url);
    
    // 播放按钮点击音效
    this.playSound('buttonClickSound');
    
    // 保存当前状态，用于返回
    this.previousViewportContent = document.querySelector('.viewport-content').innerHTML;
    this.isInPreviewMode = true;
    
    // 在viewport-content中显示iframe（无工具栏）
    const viewportContent = document.querySelector('.viewport-content');
    viewportContent.innerHTML = `
      <div class="preview-container">
        <div class="preview-iframe-wrapper">
          <iframe 
            src="${url}" 
            frameborder="0" 
            allowfullscreen
            loading="lazy"
            title="预览内容"
            class="preview-iframe">
          </iframe>
        </div>
      </div>
    `;
    
    // 显示feedback message提示B键返回
    this.showFeedback('Press B to return');
    
    // 更新状态指示器
    this.updateIndicatorText();
  }

  closePreview() {
    // 播放按钮点击音效
    this.playSound('buttonClickSound');
    
    if (this.isInPreviewMode && this.previousViewportContent) {
      // 恢复之前的内容
      const viewportContent = document.querySelector('.viewport-content');
      viewportContent.innerHTML = this.previousViewportContent;
      
      // 重置状态
      this.isInPreviewMode = false;
      this.previousViewportContent = null;
      
      // 更新状态指示器
      this.updateIndicatorText();
    }
  }

  setupGameControls() {
    // AWSD controls
    document.querySelectorAll('.control-btn').forEach(btn => {
      const handler = (e) => {
        this.playSound('buttonClickSound');
        const direction = e.target.dataset.direction;
        this.handleDirection(direction);
      };
      btn.addEventListener('click', handler);
      this.eventListeners.push({ element: btn, event: 'click', handler });
    });

    // A/B buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
      const handler = (e) => {
        this.playSound('buttonClickSound');
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
        console.log('🔙 Back action triggered');
        console.log('🔙 Current cartridge:', this.currentCartridge);
        console.log('🔙 Current level:', this.currentLevel);
        console.log('🔙 Is in preview mode:', this.isInPreviewMode);
        
        // 如果在预览模式，先退出预览
        if (this.isInPreviewMode) {
          console.log('🔙 Exiting preview mode');
          this.closePreview();
          this.showFeedback('Exited preview mode');
          return;
        }
        
        if (this.currentLevel) {
          console.log('🔙 Going back to cartridge selection');
          this.currentLevel = null;
          this.updateIndicatorText();
          this.loadCartridgeContent(this.currentCartridge);
          this.showFeedback('Back to cartridge selection');
        } else if (this.currentCartridge) {
          // 选择卡带后不能通过B键回到欢迎消息页面
          console.log('🔙 Cartridge selected, showing restriction message');
          this.showFeedback('Use Exit button to return to main menu');
        } else {
          console.log('🔙 No cartridge selected, no action taken');
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
      case 'b':
      case 'escape':
        e.preventDefault();
        this.handleAction('back');
        break;
      case 'arrowleft':
        e.preventDefault();
        if (this.currentBulletPoints && this.currentBulletPoints.length > 1) {
          this.previousBulletPoint();
        }
        break;
      case 'arrowright':
        e.preventDefault();
        if (this.currentBulletPoints && this.currentBulletPoints.length > 1) {
          this.nextBulletPoint();
        }
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
    
    // Update indicator text
    this.updateIndicatorText();
    
    // Re-render cartridge content if one is selected
    if (this.currentCartridge) {
      console.log('🔄 Re-rendering cartridge content for:', this.currentCartridge);
      this.loadCartridgeContent(this.currentCartridge);
      
      // Re-render level content if one is selected
      if (this.currentLevel) {
        console.log('🔄 Re-rendering level content for:', this.currentLevel);
        this.loadLevelContent(this.currentLevel);
      }
    } else {
      // If no cartridge is selected, show welcome message in new language
      console.log('🔄 No cartridge selected, updating welcome message');
      this.resetViewport();
    }
    
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

// Global error handler for uncaught promise rejections
window.addEventListener('unhandledrejection', (event) => {
  // Ignore Chrome extension related errors
  if (event.reason && event.reason.message && 
      event.reason.message.includes('message channel closed')) {
    console.warn('⚠️ Ignoring Chrome extension error:', event.reason.message);
    event.preventDefault();
    return;
  }
  
  // Log other unhandled promise rejections
  console.error('❌ Unhandled promise rejection:', event.reason);
});

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
