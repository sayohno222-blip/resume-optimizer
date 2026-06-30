import type { BionicInput, BionicDesignResult } from '../types/bionic';

// --- 3 Mock Datasets ---

const CLOUD_PHONE_STAND: BionicDesignResult = {
  inspirationAnalysis: [
    '灵感来源：云朵',
    '云朵作为自然界的视觉符号，其核心特征包括：',
    '• 随机性与有机形态——云端边界柔和、不可预测，传达轻松、自由和不可复制的独特感',
    '• 轻盈与通透感——云朵由水汽聚集而成，视觉上轻盈飘浮，给人以无压迫的舒适体验',
    '• 聚集与层次——云朵由无数微小水滴聚集形成，呈现丰富的层次感和体积感',
    '本设计将云朵的核心意象转化为手机支架的功能形态，让日常数码配件具有情感温度和自然美感。',
  ].join('\n'),
  formExtraction: {
    form: [
      '圆润、无棱角的有机轮廓，模仿云端外形的随机曲线',
      '多层堆叠结构，再现云的体积感和层次感',
      '顶部略扁平作为手机支撑面，底部自然延伸作为底座',
    ],
    structure: [
      '多层云片式结构，每层之间微小的倾斜角度提供多角度支撑',
      '底层云朵体积较大，提供稳定的重心',
      '防滑硅胶嵌入云朵底部，确保支架在桌面上稳固不滑动',
    ],
    function: [
      '横屏/竖屏双模式支撑，通过云片层之间的凹槽实现',
      '无线充电兼容——云朵中心区域镂空，不影响手机充电',
      '线缆管理——云层之间的缝隙可收纳充电线',
    ],
  },
  designDirections: [
    { title: '极简单层云', description: '提炼云朵最简轮廓，单片式设计，用最少的线条表达云朵的柔软感。适合追求极致简约的桌面美学。' },
    { title: '积云叠层', description: '3-4层云片堆叠，每层采用不同的云朵形态，形成丰富的视觉层次。云片之间用磁吸连接，可自由调整角度和层数。' },
    { title: '日落云', description: '融入渐变配色（从暖橙到淡紫），模拟日落时分的云彩色彩。适合追求个性化和氛围感的设计。' },
  ],
  cmfAdvice: {
    colors: [
      { name: '云雾白', hex: '#F5F5F0', description: '接近自然云朵的米白色，哑光质感，百搭各种桌面风格' },
      { name: '晴空蓝', hex: '#B8D4E3', description: '淡蓝色调，呼应蓝天背景，清新治愈' },
      { name: '暮光紫', hex: '#D4C4D9', description: '淡紫色渐变，营造日落氛围，适合个性化设计' },
    ],
    materials: [
      { name: '磨砂 PC + ABS', description: '性价比高，注塑成型工艺成熟，表面可做磨砂或哑光处理，触感温润' },
      { name: '生物基塑料（PLA）', description: '环保材料，呼应自然灵感主题，可生物降解，适合作品集加分' },
      { name: '榉木 + 磁吸件', description: '木质底座搭配磁吸云片，自然质感与现代科技结合' },
    ],
    finish: [
      { name: '哑光细磨砂', description: '表面颗粒感细腻，不反光，触感类似肌肤，不留指纹' },
      { name: '软触感涂层（Soft Touch）', description: '橡胶弹性涂层，握持舒适，提升产品质感档位' },
      { name: '渐变喷涂', description: '从白色到淡蓝色的渐变喷涂，模拟天空到云朵的过渡' },
    ],
  },
  aiPrompts: [
    { platform: 'Midjourney', prompt: 'A minimalist phone stand inspired by clouds, organic rounded form, matte white and soft blue gradient, stacked cloud layers, soft lighting on desk, ambient glow, product photography style, clean background, 8k resolution --ar 3:2 --v 6' },
    { platform: 'DALL-E', prompt: 'Product design concept for a cloud-shaped phone stand. Three cloud layers stacked vertically, matte white finish with subtle sky-blue gradient.' },
    { platform: 'Stable Diffusion', prompt: 'cloud inspired phone stand, product design, minimalist, organic form, soft diffused lighting, matte texture, pastel colors, white and light blue, photorealistic, clean background' },
  ],
  designStatement: '本设计灵感来源于自然界的云朵形态，将云的轻盈、柔软与自由意象融入手机支架这一日常数码配件中。通过多层云片叠加的有机造型，打破了传统支架的机械感与冰冷感，赋予产品温度与情绪价值。色彩采用云雾白搭配晴空蓝渐变；材质选用磨砂 PC/ABS 配合软触感涂层。整体设计旨在为用户的桌面带来一片可触摸的云。',
};

const BAMBOO_CUP: BionicDesignResult = {
  inspirationAnalysis: [
    '灵感来源：竹',
    '竹子作为东方文化中的重要自然元素，其核心特征包括：',
    '• 节状结构——竹节将竹秆分割成规律段落，兼具节奏感和结构强度',
    '• 中空特性——竹秆内部中空，质轻而强韧，是天然的管状结构',
    '• 纵向纹理——竹纤维沿纵向排列，形成独特的线性肌理',
    '本设计将竹的形态逻辑和结构智慧转化到水杯设计中，让日常饮水用具兼具自然美学与工学理性。',
  ].join('\n'),
  formExtraction: {
    form: [
      '竹节式的分段造型，杯身由2-3段节组成，每节之间略微收窄',
      '整体修长挺拔，模仿竹秆的向上生长姿态',
      '杯盖设计为竹叶或竹笋形态的简化抽象',
    ],
    structure: [
      '竹节凸起部位天然防滑，手握时提供定位感',
      '中空双层结构（模仿竹秆中空），实现保温隔热功能',
      '杯底略宽，模仿竹根部的稳定结构，防止倾倒',
    ],
    function: [
      '竹节凹槽作为手指握持的定位点，提升握持舒适度',
      '双层真空保温（外层仿竹节纹理，内层304不锈钢）',
      '杯盖竹叶造型可作茶漏或小杯子使用',
    ],
  },
  designDirections: [
    { title: '单节简约', description: '仅保留一节竹节作为视觉焦点，杯身其余部分光滑简洁。适合喜欢极简风格的用户。' },
    { title: '三节经典', description: '三节竹秆式造型，每节长度递增，模拟真实竹秆的生长比例。手持时自然贴合手掌曲线。' },
    { title: '竹编肌理', description: '杯身融入竹编的编织纹理作为表面装饰，致敬传统竹编工艺，更具文化深度。' },
  ],
  cmfAdvice: {
    colors: [
      { name: '竹青', hex: '#78A86B', description: '新鲜竹子的青绿色，充满生命力，清新自然' },
      { name: '枯竹褐', hex: '#C4A67D', description: '干燥竹子的暖褐色，质朴内敛，有温度感' },
      { name: '墨竹黑', hex: '#2D2D2D', description: '经过碳化处理的深色竹纹，现代感强，适合商务场景' },
    ],
    materials: [
      { name: 'Tritan + 硅胶环', description: '食品级 Tritan 材质透明杯身，搭配仿竹节硅胶防滑环，兼顾美观与安全' },
      { name: '304不锈钢 + 竹木外壳', description: '内部不锈钢保温，外部包裹竹木薄片，真实触感，天然保温' },
      { name: '全陶瓷', description: '一体化陶瓷烧制，竹节造型从杯体自然生长出来，手感温润，适合高端线' },
    ],
    finish: [
      { name: '半透明磨砂', description: 'Tritan 材质半透明磨砂处理，隐约可见内部水位，朦胧美感' },
      { name: '竹木拉丝', description: '竹木外壳表面做顺纹拉丝处理，手感细腻，天然纹理每一只都独一无二' },
      { name: '陶瓷哑光釉', description: '哑光釉面，触感如婴儿肌肤，不沾指纹，品质感强' },
    ],
  },
  aiPrompts: [
    { platform: 'Midjourney', prompt: 'Minimalist water bottle inspired by bamboo, segmented bamboo-joint design, warm beige and bamboo green color, ceramic texture, natural lighting, zen desk setting, product photography, clean background, 8k --ar 3:2 --v 6' },
    { platform: 'DALL-E', prompt: 'Product design concept for a bamboo-inspired water bottle with three bamboo joint segments, warm wood tones, bamboo leaf cap, natural sunlight, clean product photography.' },
    { platform: 'Stable Diffusion', prompt: 'bamboo inspired water bottle, product design, bamboo joint segments, minimalist, natural materials, zen aesthetic, product photography, clean background, photorealistic, 8k' },
  ],
  designStatement: '本设计从竹子的自然形态中汲取灵感，将竹节的分段逻辑、中空结构和纵向肌理转化为水杯的设计语言。杯身采用三段式竹节造型，每节比例参照真实竹秆的生长规律，手持时竹节凸起自然贴合虎口，提供舒适的握持体验。色彩以竹青绿为基调，搭配枯竹褐色点缀。材质上选用 Tritan 透明杯体搭配竹节硅胶环，兼顾食品安全与自然触感。',
};

const SHELL_LAMP: BionicDesignResult = {
  inspirationAnalysis: [
    '灵感来源：贝壳',
    '贝壳作为海洋生物的天然庇护所，其核心特征包括：',
    '• 螺旋与涡旋结构——贝壳从中心向外螺旋生长，形成黄金比例般的美学韵律',
    '• 扇面展开——扇贝的扇形展开形态，兼具包裹感和开放感',
    '• 棱纹肌理——贝壳表面的放射状棱纹，既是结构加强筋，也是独特的触觉肌理',
    '本设计将贝壳的生长逻辑和结构智慧应用到台灯设计中，让灯具既是光源，也是空间中的自然雕塑。',
  ].join('\n'),
  formExtraction: {
    form: [
      '扇形展开的灯罩，模仿扇贝的外壳形态',
      '螺旋底座，模拟贝壳的生长原点',
      '灯罩内表面呈现放射状棱纹，贝壳肌理转化为光影纹理',
    ],
    structure: [
      '灯罩采用渐变厚度的壳体结构——边缘薄、中心厚，自然形成光的漫射效果',
      '底座重而稳，模仿贝壳附着在礁石上的稳定感',
      '灯臂可调节角度，模拟贝壳开合的动作',
    ],
    function: [
      '棱纹内表面将 LED 点光源转化为放射状散射光，营造柔和氛围',
      '灯罩角度调节（0°~45°），实现直接照明与间接照明的切换',
      '底座集成无线充电，既是台灯也是手机充电站',
    ],
  },
  designDirections: [
    { title: '扇贝折叠', description: '灯罩可折叠收拢/展开，收拢时如贝壳闭合，展开时如贝壳打开。既是灯具也是桌面雕塑。' },
    { title: '海螺螺旋', description: '采用海螺的螺旋生长逻辑，光源从螺旋中心向外透出。灯体修长，适合书桌角落。' },
    { title: '珍珠母贝', description: '内表面采用珍珠母贝贴片，灯光照射下呈现柔和虹彩。适合女性化或高端家居场景。' },
  ],
  cmfAdvice: {
    colors: [
      { name: '珍珠白', hex: '#F8F6F0', description: '基底色，模拟贝壳外层的象牙白，温润百搭' },
      { name: '虹彩渐变', hex: '#E8D5E0', description: '内表面珍珠层在灯光下的淡粉-淡紫-淡蓝渐变，梦幻质感' },
      { name: '深海灰', hex: '#5A6A70', description: '底座颜色，模拟礁石的沉稳灰色，提供视觉稳定感' },
    ],
    materials: [
      { name: '注塑 PC + 珍珠涂层', description: '性价比高，灯罩一次注塑成型，内表面喷涂珍珠质感涂层' },
      { name: '真贝壳贴片 + 金属框架', description: '灯罩内表面嵌入真实贝壳薄片，每一只纹理独一无二，高端手工感' },
      { name: '3D 打印树脂', description: '可精确还原贝壳的复杂曲面和棱纹结构，适合小批量定制' },
    ],
    finish: [
      { name: '半透磨砂', description: 'PC 材质半透磨砂处理，灯光透过时如贝壳般柔和朦胧' },
      { name: '珍珠光涂层', description: '内表面喷涂珍珠光涂料，不同角度呈现微妙光泽变化' },
      { name: '哑光砂岩纹', description: '底座采用哑光砂岩纹理，质感粗糙稳重，与光滑灯罩形成对比' },
    ],
  },
  aiPrompts: [
    { platform: 'Midjourney', prompt: 'Elegant desk lamp inspired by seashell, scallop-shaped lampshade, ribbed inner texture, pearl white and iridescent finish, warm ambient glow, product photography, clean background, 8k --ar 3:2 --v 6' },
    { platform: 'DALL-E', prompt: 'Product design concept for a seashell-inspired desk lamp. Scallop shell lampshade with radiating rib lines, pearl white exterior, warm light, wooden desk, clean product photography.' },
    { platform: 'Stable Diffusion', prompt: 'seashell inspired desk lamp, product design, scallop shell lampshade, ribbed inner texture, pearl white, iridescent finish, warm lighting, product photography, photorealistic, 8k' },
  ],
  designStatement: '本设计从贝壳的自然生长形态出发，将扇贝的扇形展开、螺旋生长、棱纹肌理和珍珠光泽等特征转化为台灯的设计语言。灯罩采用扇贝展开式造型，内表面放射状棱纹将 LED 光源转化为柔和的光影肌理。色彩以珍珠白为主色调，内表面加入虹彩渐变涂层。底座采用深海灰哑光质感，与灯罩的光滑形成触觉对比。',
};

const MOCK_DATASETS = [CLOUD_PHONE_STAND, BAMBOO_CUP, SHELL_LAMP];

function matchDataSet(input: BionicInput): number {
  const text = `${input.inspiration} ${input.productType} ${input.styleKeywords}`.toLowerCase();
  if (/云|朵|cloud|phone|支架/.test(text)) return 0;
  if (/竹|bamboo|水杯|cup|杯/.test(text)) return 1;
  if (/贝壳|shell|海|灯|lamp|台灯/.test(text)) return 2;
  if (/杯|壶|水瓶|bottle/.test(text)) return 1;
  if (/灯|lamp|light/.test(text)) return 2;
  return 0;
}

export interface BionicMockCallbacks {
  onProgress?: (stage: number, label: string) => void;
  onComplete: (result: BionicDesignResult) => void;
}

export async function runBionicMock(
  input: BionicInput,
  callbacks: BionicMockCallbacks,
): Promise<void> {
  const datasetIndex = matchDataSet(input);
  const result = MOCK_DATASETS[datasetIndex];
  const stages = [
    { delay: 400, stage: 1, label: '正在分析灵感来源...' },
    { delay: 300, stage: 2, label: '正在提取形态与结构特征...' },
    { delay: 400, stage: 3, label: '正在生成设计方案...' },
    { delay: 300, stage: 4, label: '正在完善设计说明...' },
  ];
  for (const s of stages) {
    await new Promise((r) => setTimeout(r, s.delay));
    callbacks.onProgress?.(s.stage, s.label);
  }
  callbacks.onComplete(result);
}
