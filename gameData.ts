
export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Candidate {
  id: number;
  name: string;
  region: string;
  bio: string;
  achievement: string;
  votes: number;
  imageUrl: string;
  publishDate: string;
  sourceType: string;
  fullArchive: string;
}

export const REPORTER_TITLES = [
  "见习记者 (Apprentice)", 
  "助理记者 (Assistant)", 
  "独立记者 (Independent)", 
  "骨干记者 (Core)", 
  "首席记者 (Chief)", 
  "高级记者 (Senior)", 
  "资深记者 (Veteran)", 
  "专家记者 (Expert)", 
  "王牌记者 (Ace)", 
  "传奇记者 (Legendary)"
];

export const getTitleByCorrectCount = (count: number): string => {
  const index = Math.min(Math.floor(count / 20), REPORTER_TITLES.length - 1);
  return REPORTER_TITLES[index];
};

/**
 * 20 位全球媒体英雄内置数据库
 */
export const HEROES_DB: Candidate[] = [
  {
    id: 101,
    name: "Elena Rostova",
    region: "东欧 / 边界战区",
    bio: "连续 300 天在封锁区进行地下报道，揭露了跨国人口贩运链条。",
    achievement: "即使在最深的黑夜，笔尖也能划破铁幕。",
    votes: 1420,
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-05-12",
    sourceType: "独立调查",
    fullArchive: "### 档案：边界之泪\n\nElena 潜入边界营地，拍摄了超过 400 小时的秘密录像。她揭露了某些准军事组织与犯罪团伙勾结的事实。这份档案被加密上传至智安协议，成为了国际法庭的重要证物。"
  },
  {
    id: 102,
    name: "Kwame Osei",
    region: "西非 / 矿区",
    bio: "揭开了非法电子垃圾处理场对当地水源的毁灭性污染。",
    achievement: "黄金与剧毒的较量：一个记者的十年追踪。",
    votes: 980,
    imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-03-20",
    sourceType: "环境周刊",
    fullArchive: "### 档案：致命的遗存\n\n在西非的矿区深处，Kwame 发现了被官方掩盖的汞中毒事件。他通过对比十年的卫星图像与实地采样，证明了某些跨国企业在当地违规排放。虽然他多次收到匿名威胁，但调查从未停止。"
  },
  {
    id: 103,
    name: "Sofia Mendez",
    region: "拉美 / 雨林保护区",
    bio: "记录了非法伐木者如何利用算法漏洞规避遥感监测。",
    achievement: "保护地球的绿肺，从戳穿数字谎言开始。",
    votes: 2150,
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-08-01",
    sourceType: "科技视点",
    fullArchive: "### 档案：数据丛林\n\nSofia 发现伐木公司通过黑客手段修改了公开的卫星监测数据。她带领技术团队重新校准了监测模型，恢复了消失的 5000 公顷森林记录。"
  },
  {
    id: 104,
    name: "Hiroshi Sato",
    region: "东亚 / 科技重镇",
    bio: "首位深入调查社交媒体‘算法审查机制’黑箱的独立记者。",
    achievement: "在代码构建的牢笼里，为自由寻找出口。",
    votes: 3100,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-06-15",
    sourceType: "数字自由报告",
    fullArchive: "### 档案：算法之锁\n\nHiroshi 通过对 10 万条被屏蔽数据的逆向工程，揭露了大型科技公司如何利用特定关键词自动锁定并压制异见者的真实经历。"
  },
  {
    id: 105,
    name: "Amira Jaber",
    region: "中东 / 废墟之城",
    bio: "在无网络环境下，通过卫星终端发送了最后的突发新闻。",
    achievement: "断网时刻，她是连接真相的唯一链路。",
    votes: 4200,
    imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0ad2f04?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-01-10",
    sourceType: "前线电报",
    fullArchive: "### 档案：零度信号\n\n当整座城市陷入信息孤岛时，Amira 携带手摇发电机与卫星设备，将平民遭遇的非人道待遇传送到了智安协议节点。"
  },
  {
    id: 106,
    name: "Liam O'Connor",
    region: "欧洲 / 避税天堂",
    bio: "揭秘了隐藏在艺术品拍卖背后的跨国洗钱网络。",
    achievement: "让隐藏在油墨与财富背后的罪恶无处遁形。",
    votes: 1120,
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-04-05",
    sourceType: "金融深访",
    fullArchive: "### 档案：画布阴影\n\nLiam 追踪了数十家壳公司，发现某国政要通过竞买‘假艺术品’的方式将公款转移出境。他的报道直接导致了欧盟洗钱法的修订。"
  },
  {
    id: 107,
    name: "Chen Wei",
    region: "东南亚 / 离岸中心",
    bio: "卧底半年，揭露了东南亚电信诈骗园区的产业链真相。",
    achievement: "孤身走暗巷，为了让更多人走向光明。",
    votes: 5600,
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-07-22",
    sourceType: "卧底日记",
    fullArchive: "### 档案：迷雾围城\n\n陈威冒死带回了园区内部的平面图与受害者名册，成功协助跨国警方解救了超过 200 名被困人员。"
  },
  {
    id: 108,
    name: "Ingrid Berg",
    region: "北欧 / 极地科考站",
    bio: "调查并证实了某些国家在北极圈进行的秘密资源掠夺协议。",
    achievement: "冰封的真相，终将被勇敢者的呼吸融化。",
    votes: 840,
    imageUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-02-14",
    sourceType: "极地观察",
    fullArchive: "### 档案：极寒博弈\n\nIngrid 通过截获的内部邮件，揭露了能源巨头与政客私下达成的北极领土瓜分协议，引发了全球范围内的外交风暴。"
  },
  {
    id: 109,
    name: "Zainab Al-Farsi",
    region: "中东 / 难民营",
    bio: "专注于报道难民女性在恶劣环境下的医疗权与受教育权。",
    achievement: "在绝望的土地上，播种希望的文字。",
    votes: 1750,
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-09-02",
    sourceType: "人文关怀",
    fullArchive: "### 档案：帐篷下的微光\n\nZainab 的文字催生了三所非营利学校的建立，让难民营中的女孩们第一次拥有了属于自己的课本。"
  },
  {
    id: 110,
    name: "Marcus Thorne",
    region: "北美 / 硅谷",
    bio: "揭露了知名 AI 公司的训练数据中存在严重的种族与性别偏见。",
    achievement: "即使是机器的‘灵魂’，也需要公平的底色。",
    votes: 2800,
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-11-11",
    sourceType: "AI 伦理审查",
    fullArchive: "### 档案：偏见之核\n\nMarcus 的报道迫使三家顶级科技巨头宣布无限期推迟其面部识别技术的商业化进程。"
  },
  {
    id: 111,
    name: "Ananya Gupta",
    region: "南亚 / 纺织厂",
    bio: "揭秘了快时尚品牌背后的现代奴役制度与非法童工。",
    achievement: "光鲜亮丽的衣橱下，不应藏着孩子的泪水。",
    votes: 1940,
    imageUrl: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-10-05",
    sourceType: "劳工调查",
    fullArchive: "### 档案：丝线血泪\n\nAnanya 潜入工厂内部拍摄的画面，直接导致了全球最大的五家快时尚零售商股价大跌，并迫使其签署《供应链人权宪章》。"
  },
  {
    id: 112,
    name: "Diego Silva",
    region: "南美 / 毒枭控制区",
    bio: "唯一一位在毒枭暗杀名单上存活并继续发声的本土记者。",
    achievement: "恐惧是谎言的温床，勇气是唯一的解药。",
    votes: 3900,
    imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-04-18",
    sourceType: "地下电台",
    fullArchive: "### 档案：不灭的灯火\n\nDiego 每日在不同的秘密地点进行广播，通报毒枭的动向。他已成为当地民众心中事实上的‘治安法官’。"
  },
  {
    id: 113,
    name: "Lucas Weber",
    region: "西欧 / 农业巨头",
    bio: "记录了转基因种子专利如何一步步剥夺贫穷农户的生存权。",
    achievement: "土地的馈赠，不应被专利铁丝网围困。",
    votes: 720,
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-12-01",
    sourceType: "农业之窗",
    fullArchive: "### 档案：种子的奴役\n\nLucas 证明了某些公司在种子中故意植入‘自毁基因’，强迫农户每年重复购买。他的报道引发了全球种子主权运动。"
  },
  {
    id: 114,
    name: "Yara Mahmoud",
    region: "北非 / 历史古迹",
    bio: "揭露了战乱中被非法贩卖至海外私人藏家的国家级文物名录。",
    achievement: "文字记录的历史，是夺不走的民族记忆。",
    votes: 1350,
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-03-12",
    sourceType: "文化遗产保卫战",
    fullArchive: "### 档案：失落的文明\n\nYara 的调查促使大英博物馆等机构开始重新审查其馆藏文物的合法来源，并成功归还了首批 12 件青铜器。"
  },
  {
    id: 115,
    name: "Tariq Aziz",
    region: "中亚 / 气象站",
    bio: "揭开了核试验遗留场地的放射性沉降数据被篡改的内幕。",
    achievement: "当大地的伤口被掩盖，文字必须成为呐喊。",
    votes: 1560,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-05-22",
    sourceType: "环境法医",
    fullArchive: "### 档案：紫色土地\n\nTariq 通过民间采样，证明了当地癌症发病率与核试验数据的强相关性，迫使当地政府承认并建立补偿机制。"
  },
  {
    id: 116,
    name: "Chloe Dupont",
    region: "欧洲 / 时装周",
    bio: "深度报道了奢侈品行业中普遍存在的职场霸凌与权力压迫。",
    achievement: "在华服与闪光灯背后，还原真实的人格尊严。",
    votes: 930,
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-06-30",
    sourceType: "时尚观察",
    fullArchive: "### 档案：秀场阴影\n\nChloe 的专题报道引发了时尚界的‘MeToo’运动，数十名顶级设计师因不当行为被解雇或接受调查。"
  },
  {
    id: 117,
    name: "Oliver Stone",
    region: "大洋洲 / 离岸监狱",
    bio: "独家披露了某岛屿拘留中心内对难民的虐待与医疗疏忽。",
    achievement: "孤岛不是法外之地，真相必将跨海而来。",
    votes: 2450,
    imageUrl: "https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-08-15",
    sourceType: "太平洋人权",
    fullArchive: "### 档案：囚室回声\n\nOliver 通过走私出的手写信件，还原了监狱内的真实生活，迫使政府最终关闭了该离岸中心。"
  },
  {
    id: 118,
    name: "Fatima Noor",
    region: "东非 / 饥荒区",
    bio: "揭露了国际援助粮食被当地军阀拦截并倒卖至黑市的行径。",
    achievement: "每一粒粮食都应属于饥饿者，而非掠夺者。",
    votes: 3300,
    imageUrl: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-02-28",
    sourceType: "粮食正义",
    fullArchive: "### 档案：血色救济\n\nFatima 的报道促使联合国重新审查了对该地区的援助分发流程，并建立了基于区块链的追踪系统。"
  },
  {
    id: 119,
    name: "Jonas Nielsen",
    region: "斯堪的纳维亚 / 制药公司",
    bio: "爆料了某畅销抑郁症药物临床试验数据造假，导致多人自杀。",
    achievement: "科学不应成为利润的奴隶，生命值得最后的防线。",
    votes: 2100,
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-07-07",
    sourceType: "医学真理",
    fullArchive: "### 档案：制药幻象\n\nJonas 整理了上万页的内部文件，证明公司高层在知情的情况下掩盖了药物的严重副作用。该药目前已全球下架。"
  },
  {
    id: 120,
    name: "Maya Singh",
    region: "南亚 / 地下水监测站",
    bio: "调查了工业巨头过度开采地下水导致数千个村庄失去饮用水源。",
    achievement: "清泉是自然的恩赐，不应成为权势者的私产。",
    votes: 1680,
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop",
    publishDate: "2024-05-30",
    sourceType: "地球呼吸",
    fullArchive: "### 档案：干涸的村庄\n\nMaya 的深入报道促使最高法院颁布了严格的地下水开采禁令，为上百万村民挽回了生存权。"
  }
];

/**
 * 逻辑拆解内置题库 (Logic Decoder)
 */
export const LOGIC_DB: QuizQuestion[] = [
  { id: 1, text: "某官员称：'如果我们不通过这项安保法案，恐怖分子明天就会出现在你家门口。' 这犯了什么谬误？", options: ["诉诸恐惧", "偷换概念", "非黑即白", "人身攻击"], answer: 0, explanation: "这是诉诸恐惧谬误，通过极端化威胁来迫使听众接受其结论，而非通过逻辑论证。" },
  { id: 2, text: "‘大家都转发这条消息，它肯定是真实的。’", options: ["诉诸权威", "循环论证", "诉诸群众", "以偏概全"], answer: 2, explanation: "诉诸群众认为流行的观点即是正确的，忽略了大众可能被误导的情况。" },
  { id: 3, text: "‘你连大学都没读完，凭什么质疑专家的结论？’", options: ["诉诸无知", "人身攻击", "合成谬误", "红鲱鱼"], answer: 1, explanation: "人身攻击（Ad Hominem）通过攻击发言者的背景而非讨论其观点本身。" },
  { id: 4, text: "‘如果不禁止电子游戏，学生就会不学习，国家未来就会垮掉。’", options: ["滑坡谬误", "虚假因果", "偷换概念", "绝对化"], answer: 0, explanation: "滑坡谬误无根据地推导出一系列极端后果。" },
  { id: 5, text: "‘既然没有人能证明他没收钱，那他一定收了。’", options: ["诉诸无知", "循环论证", "错误归因", "非黑即白"], answer: 0, explanation: "诉诸无知认为无法证伪即代表证实。" },
  { id: 6, text: "‘他支持环保，所以他一定反对工业发展。’", options: ["虚假对立", "偷换概念", "合成谬误", "人身攻击"], answer: 0, explanation: "将环保与工业对立，忽略了两者和谐共存的可能性。" },
  { id: 7, text: "‘专家说这个好，所以它绝对好。’", options: ["诉诸权威", "绝对化", "偷换概念", "以偏概全"], answer: 0, explanation: "盲目迷信权威而非分析证据。" },
  { id: 8, text: "‘如果你不站在我们这一边，你就是我们的敌人。’", options: ["非黑即白", "诉诸情感", "窃取论点", "滑坡谬误"], answer: 0, explanation: "虚假两难，忽略了中立或第三方立场的存在。" },
  { id: 9, text: "‘这个政策让老王赚了钱，所以对全国人民都好。’", options: ["以偏概全", "合成谬误", "错误归因", "偷换概念"], answer: 1, explanation: "合成谬误认为对个体成立的结论必然对整体成立。" },
  { id: 10, text: "‘由于他在会议上保持沉默，说明他默认了罪行。’", options: ["虚假预设", "关联谬误", "窃取论点", "诉诸无知"], answer: 0, explanation: "预设了沉默即代表某种特定含义，而非多种可能性。" },
  { id: 11, text: "‘为什么要反驳他？他已经90岁了。’", options: ["诉诸同情", "人身攻击", "红鲱鱼", "偷换概念"], answer: 0, explanation: "诉诸同情而非通过事实反驳。" },
  { id: 12, text: "‘如果允许你迟到，所有人都会迟到，公司就会倒闭。’", options: ["滑坡谬误", "虚假因果", "绝对化", "非黑即白"], answer: 0, explanation: "典型的逻辑滑坡。" }
];

/**
 * 情绪陷阱内置题库 (Emotional Bait)
 */
export const TRAP_DB: QuizQuestion[] = [
  { id: 1, text: "‘丧心病狂！暴徒竟然对无辜者痛下杀手！’ 这个标题的主要目的是？", options: ["客观报道", "煽动仇恨/情绪", "提供技术细节", "政策分析"], answer: 1, explanation: "‘丧心病狂’、‘暴徒’、‘痛下杀手’均为极具情感色彩的定性词，旨在激发读者的愤怒。" },
  { id: 2, text: "‘据气象局数据显示，明日降雨概率为80%。’ 这是一个...", options: ["情感煽动", "事实陈述"], answer: 1, explanation: "纯粹基于数据和机构的客观说明。" },
  { id: 3, text: "‘别让这些害群之马破坏了我们的团圆。’", options: ["事实描述", "去人性化标签"], answer: 1, explanation: "‘害群之马’将特定群体非人化，减少读者的共情心。" },
  { id: 4, text: "‘如果不转发，你就不是中国人！’", options: ["绑架民族情感", "事实科普"], answer: 0, explanation: "典型的道德与情感绑架。" },
  { id: 5, text: "‘震惊！这种水果吃多了竟然会中毒？’", options: ["悬念标题党", "权威科普"], answer: 0, explanation: "利用‘震惊’和未知恐惧吸引点击，而非科学严谨陈述。" },
  { id: 6, text: "‘伟大的成果证明了我们的体制无往不胜。’", options: ["情感动员", "数据分析"], answer: 0, explanation: "使用‘伟大’、‘无往不胜’进行单向度的情感强化。" },
  { id: 7, text: "‘那些自私的反对者正在阻碍社会的进步。’", options: ["标签化攻击", "客观讨论"], answer: 0, explanation: "通过‘自私’定性反对者，剥夺其合理诉求的讨论空间。" },
  { id: 8, text: "‘这种行为简直是文明的耻辱。’", options: ["道德裁判", "法律分析"], answer: 0, explanation: "诉诸道德愤怒而非理性的法理分析。" },
  { id: 9, text: "‘调查发现，该地区人均收入连续三年增长。’", options: ["事实陈述", "主观臆断"], answer: 0, explanation: "基于调查数据的客观结果。" },
  { id: 10, text: "‘泪目！他在暴雨中坚守了12个小时。’", options: ["情感渲染", "单纯通报"], answer: 0, explanation: "‘泪目’引导读者进入预设的感动情绪。" }
];

/**
 * 真相还原内置题库 (Restoration)
 */
export const RESTORATION_DB: QuizQuestion[] = [
  { id: 1, text: "原文：‘由于[████]，通往市中心的道路被无限期封锁。’ 最可能的隐藏真相是？", options: ["道路维修", "突发抗议/冲突", "嘉年华准备", "常规检查"], answer: 1, explanation: "‘无限期’和‘封锁’在新闻语境中通常暗示难以预料的社会性突发事件。" },
  { id: 2, text: "原文：‘官方通告：这次[████]是成功的。’", options: ["阶段性", "全面", "唯一", "虚假"], answer: 0, explanation: "‘阶段性’常被用于修饰尚未根治、仍有隐患的进展。" },
  { id: 3, text: "原文：‘因为[████]原因，该媒体账号已不再更新。’", options: ["内部调整", "内容审查/封禁", "创始人退休", "欠费"], answer: 1, explanation: "含混的辞藻常掩盖因触碰底线而被强制关停的事实。" },
  { id: 4, text: "原文：‘他在[████]中展现了极大的克制。’", options: ["暴力干预", "友好访问", "常规巡逻", "学术研究"], answer: 0, explanation: "‘克制’往往是描述在冲突场景中单方面的暴力行使。" },
  { id: 5, text: "原文：‘目击者称，现场听到了[████]的声音。’", options: ["爆破/枪鸣", "歌声", "欢呼", "施工"], answer: 0, explanation: "目击者描述被遮蔽的部分往往是决定定性的关键证据。" },
  { id: 6, text: "原文：‘该项目在[████]过程中遗失了原始记录。’", options: ["突击审计", "正常搬迁", "数字化", "归档"], answer: 0, explanation: "在审计前夕遗失资料是掩盖违规行为的典型套路。" },
  { id: 7, text: "原文：‘这是一个[████]性质的例行检查。’", options: ["惩罚/警告", "学术", "自愿", "艺术"], answer: 0, explanation: "例行检查常被作为行政干预的委婉称法。" },
  { id: 8, text: "原文：‘相关数据已按照[████]进行合规化处理。’", options: ["官方口径", "国际标准", "数学模型", "随机数"], answer: 0, explanation: "‘合规化处理’往往意味着对原始不利数据的修正。" },
  { id: 9, text: "原文：‘对此，我们保持[████]的乐观。’", options: ["审慎", "盲目", "愤怒", "绝望"], answer: 0, explanation: "‘审慎的乐观’是外交与官方辞令中掩盖不确定性的常用语。" },
  { id: 10, text: "原文：‘这是为了[████]而做出的必要牺牲。’", options: ["集体利益", "个人获利", "短期KPI", "排外"], answer: 0, explanation: "‘集体利益’常被作为要求个体让步的道德筹码。" }
];
