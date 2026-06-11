/**
 * BEARING — 个人战略咨询师
 * 核心应用逻辑
 * 纯前端 SPA：路由 + 状态管理 + 语音 + 题目流程
 */

/** 品牌英文名：Bearing = 弄清方位 / 明确方向（get your bearings） */
const BRAND_NAME = 'BEARING';

// ============================================================
// 1. 数据配置
// ============================================================

/** 豆包智能体：个人战略咨询师 */
const DOUBAO_BOT_URL = 'https://doubao.com/bot/XV8wCfJW';

/** 合法路由页面（GitHub Pages hash 路由） */
const VALID_PAGES = new Set([
  'cover', 'landing', 'guide', 'opening', 'question', 'transition', 'closing',
  'summary', 'doubao-guide', 'submit', 'analyze', 'report-save', 'report',
  'history', 'privacy'
]);

const CHAPTERS = {
  1: { name: '现状锚定', color: '#a78bfa', time: '约 5 分钟', theme: 'ch1' },
  2: { name: '方向与障碍', color: '#8b5cf6', time: '约 9 分钟', theme: 'ch2' },
  3: { name: '深层触碰', color: '#7c3aed', time: '约 10 分钟', theme: 'ch3' },
  4: { name: '希望与行动', color: '#c4b5fd', time: '约 4 分钟', theme: 'ch4' }
};

const TRANSITIONS = {
  '1-2': { text: '好，我们聊聊方向。', from: 'ch1', to: 'ch2' },
  '2-3': { text: '接下来三个问题，会往心里走一点。', from: 'ch2', to: 'ch3' },
  '3-4': { text: '最后，我们看看希望。', from: 'ch3', to: 'ch4' },
  '4-end': { text: '今天聊得很透。', from: 'ch4', to: null }
};

const QUESTIONS = [
  {
    id: 'Q1', chapter: 1,
    text: ['最近在工作上，', '最让你觉得「没劲」', '或者「卡住」的', '是什么？'],
    followUps: [
      '这个感觉，大概是从什么时候开始出现的？当时发生了什么变化吗？',
      '如果一直没解决，你最担心会发生什么？'
    ]
  },
  {
    id: 'Q2', chapter: 1,
    text: ['请说一说你现在的处境？', '你现在做什么？', '最近一年，你的生活或工作', '发生了什么变化？'],
    followUps: [
      '你的经济状况如何？',
      '你的家庭支持系统怎么样？'
    ],
    tags: ['有压力', '尚可', '宽裕', '家人理解', '不支持', '独自承担']
  },
  {
    id: 'Q3', chapter: 1,
    text: ['你今年多大？', '你觉得你这个年纪的人', '「应该」是什么样子？', '你和那个「应该」之间有差距吗？'],
    followUps: [
      '这个差距给你带来压力了吗？压力更多来自自己、家庭，还是社会？',
      '如果抛开所有「应该」，你觉得自己真正想要的是什么？'
    ]
  },
  {
    id: 'Q4', chapter: 1,
    text: ['如果用一种比喻来形容', '你现在的整体状态——', '比如天气、动物、交通工具——', '你会用什么？'],
    followUps: [
      '这个比喻是什么时候开始出现在你脑子里的？',
      '如果这个比喻有颜色或者温度，那会是什么？'
    ],
    empathyResponse: '嗯，我大概能感受到那种气氛。'
  },
  {
    id: 'Q5', chapter: 2,
    text: ['你心里有没有一个', '「想去的方向」？', '如果有，请描述一下。'],
    followUps: [
      '确定程度 1-10 分？为什么不是更高或更低？',
      '有几个方向在纠结？分别是什么？纠结点在哪？'
    ],
    branchFollowUps: true
  },
  {
    id: 'Q6', chapter: 2,
    text: ['如果想去那个方向，', '你觉得目前最大的障碍是什么？', '只挑最核心的那个。'],
    followUps: [
      '这个障碍，更多是外面现实挡着，还是自己心里过不去？'
    ]
  },
  {
    id: 'Q7', chapter: 2,
    text: ['过去一年，你为改变', '做过什么事吗？', '哪怕很小，跟人聊过、', '做过一次尝试。'],
    followUps: [
      '那件事做完之后，你心里什么感觉？'
    ]
  },
  {
    id: 'Q8', chapter: 3,
    text: ['你怎么评估自己？'],
    subSteps: [
      { label: '优势', text: '你觉得自己最大的优势是什么？', followUp: '最好的朋友用三个词形容你，他们会用什么？你认同吗？' },
      { label: '劣势', text: '你觉得自己最大的劣势或短板是什么？' },
      { label: '不自信', text: '你最大的不自信，来自哪里？' }
    ]
  },
  {
    id: 'Q9', chapter: 3,
    text: ['回想一个你曾经认真想过、', '但最后没走的路——', '比如一个方向、一次转岗、一个机会。'],
    followUps: [
      '现在回头看，当时那个决定，更多是受了外部条件的限制，还是自己内心的某种感觉？',
      '如果当时有人给你一个保证「不会失败」，你会选它吗？'
    ]
  },
  {
    id: 'Q10', chapter: 3,
    text: ['有时候看到别人做了', '自己想做但没敢做的事，', '心里会有点怪怪的。', '你有过那种时刻吗？'],
    followUps: [
      '那种感觉，如果用一个词形容，会是什么？',
      '如果那个感觉变成一句话，它会说什么？'
    ],
    empathyResponse: '嗯，那种感觉其实很多人都有，不是你的问题。'
  },
  {
    id: 'Q11', chapter: 3,
    text: ['你心里有没有两个声音在打架？', '比如「稳定」和「自由」，', '「责任」和「自我」？'],
    followUps: [
      '如果这两个声音各代表你的一部分，它们各自最想告诉你什么？',
      '有没有可能不是「二选一」，而是「先 A 后 B」或者「70%A + 30%B」？'
    ]
  },
  {
    id: 'Q12', chapter: 4,
    text: ['假设一年后回头看，', '你希望那时候的自己，', '跟现在最不一样的地方是什么？', '只说画面，不想怎么实现。'],
    followUps: [
      '在那个画面里，你做的第一件小事是什么？',
      '如果这个画面实现了，你觉得是因为你做对了哪一件事？'
    ]
  },
  {
    id: 'Q13', chapter: 4,
    text: ['最后，如果今天聊的这些东西里，', '有一个是你觉得可以先碰一碰的——', '哪怕只是换个想法——', '那会是什么？'],
    followUps: [
      '你猜，如果你真的去碰它，最先可能遇到什么阻力？',
      '如果那个阻力出现了，你会用什么方式绕过它？'
    ]
  }
];

// ============================================================
// 2. 路由系统
// ============================================================

const router = {
  current: 'cover',
  history: [],

  init() {
    window.addEventListener('hashchange', () => this.handle());
    const hash = window.location.hash.slice(1);
    if (!hash || !VALID_PAGES.has(hash)) {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}#cover`);
    }
    this.handle();
  },

  handle() {
    let hash = window.location.hash.slice(1) || 'cover';
    if (!VALID_PAGES.has(hash)) hash = 'cover';
    this.go(hash, false);
  },

  go(page, pushHistory = true) {
    if (!VALID_PAGES.has(page)) page = 'cover';

    if (pushHistory && this.current !== page) {
      this.history.push(this.current);
    }
    this.current = page;

    this.updateGlobalNav(page);

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const target = document.getElementById(`page-${page}`);
    if (target) target.classList.add('active');

    if (page === 'cover') app.initCover();
    if (page === 'landing') app.initLanding();
    if (page === 'question') app.initQuestion();
    if (page === 'summary') app.renderSummary();
    if (page === 'history') app.renderHistory();
    if (page === 'report') app.renderReport();
    if (page === 'analyze') app.startAnalysis();
    if (page === 'doubao-guide') app.initDoubaoGuide();

    this.updateTheme(page);
    window.scrollTo(0, 0);

    const wantHash = `#${page}`;
    if (window.location.hash !== wantHash) {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}${wantHash}`);
    }
  },

  back() {
    const prev = this.history.pop() || 'cover';
    this.go(prev, false);
  },

  updateTheme(page) {
    const body = document.body;
    body.removeAttribute('data-theme');
    if (page === 'question') {
      const ch = QUESTIONS[state.currentQ]?.chapter || 1;
      body.setAttribute('data-theme', `ch${ch}`);
    }
  },

  updateGlobalNav(page) {
    const btn = document.getElementById('btn-home');
    if (btn) btn.classList.toggle('active', page !== 'cover');
  }
};

// ============================================================
// 3. 状态管理
// ============================================================

const state = {
  // 题目进度
  currentQ: 0,
  currentSubStep: 0,
  answers: {},
  followUpAnswers: {},

  // 语音状态
  isRecording: false,
  isFollowUpRecording: false,
  transcript: '',
  speechSupported: false,
  speechError: false,

  // 当前转写
  currentTranscript: '',
  currentFollowUpTranscript: '',

  // 编辑模式
  editingSummary: false,

  // 报告
  currentReport: null,
  manualDialogue: '',

  // 初始化
  init() {
    this.speechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    this.loadFromStorage();
  },

  // localStorage
  saveToStorage() {
    try {
      const data = {
        answers: this.answers,
        followUpAnswers: this.followUpAnswers,
        currentQ: this.currentQ,
        currentSubStep: this.currentSubStep,
        timestamp: Date.now()
      };
      localStorage.setItem('strata_state', JSON.stringify(data));
    } catch (e) { console.warn('Storage save failed:', e); }
  },

  loadFromStorage() {
    try {
      const data = localStorage.getItem('strata_state');
      if (data) {
        const parsed = JSON.parse(data);
        this.answers = parsed.answers || {};
        this.followUpAnswers = parsed.followUpAnswers || {};
        this.currentQ = typeof parsed.currentQ === 'number' ? parsed.currentQ : 0;
        this.currentSubStep = typeof parsed.currentSubStep === 'number' ? parsed.currentSubStep : 0;
      }
    } catch (e) { console.warn('Storage load failed:', e); }
  },

  hasQuestionContent(q) {
    if ((this.answers[q.id] || '').trim()) return true;
    if (q.subSteps) {
      return (this.followUpAnswers[q.id] || []).some(a => a && a.trim());
    }
    return false;
  },

  finalizeSubStepAnswer(q) {
    if (!q.subSteps) return;
    const parts = q.subSteps.map((step, i) => {
      const a = (this.followUpAnswers[q.id] || [])[i];
      return a && a.trim() ? `${step.label}：${a.trim()}` : null;
    }).filter(Boolean);
    if (parts.length) this.setAnswer(q.id, parts.join('\n'));
  },

  clearStorage() {
    localStorage.removeItem('strata_state');
    localStorage.removeItem('strata_reports');
    localStorage.removeItem('strata_history');
    this.answers = {};
    this.followUpAnswers = {};
    this.currentQ = 0;
  },

  // 获取/设置答案
  getAnswer(qid) { return this.answers[qid] || ''; },
  setAnswer(qid, text) { this.answers[qid] = text; this.saveToStorage(); },
  getFollowUpAnswer(qid, idx) { return (this.followUpAnswers[qid] || [])[idx] || ''; },
  setFollowUpAnswer(qid, idx, text) {
    if (!this.followUpAnswers[qid]) this.followUpAnswers[qid] = [];
    this.followUpAnswers[qid][idx] = text;
    this.saveToStorage();
  },

  // 生成对话纪要
  generateSummary() {
    let summary = '';
    let currentChapter = 0;

    QUESTIONS.forEach((q) => {
      if (!this.hasQuestionContent(q)) return;

      if (q.chapter !== currentChapter) {
        currentChapter = q.chapter;
        const ch = CHAPTERS[currentChapter];
        if (summary) summary += '\n\n';
        summary += `【${ch.name}】\n`;
      }

      const qText = Array.isArray(q.text) ? q.text.join('') : q.text;
      summary += `\n${q.id}. ${qText}\n`;

      const answer = (this.answers[q.id] || '').trim();
      if (answer) summary += `${answer}\n`;

      if (q.subSteps) {
        q.subSteps.forEach((step, sIdx) => {
          const subAnswer = (this.followUpAnswers[q.id] || [])[sIdx];
          if (subAnswer && subAnswer.trim()) {
            summary += `  · ${step.label}：${subAnswer.trim()}\n`;
          }
        });
      }

      const fuAnswers = this.followUpAnswers[q.id];
      if (fuAnswers && !q.subSteps && q.followUps) {
        fuAnswers.forEach((fu, fuIdx) => {
          if (fu && fu.trim() && q.followUps[fuIdx]) {
            summary += `  · 追问：${fu.trim()}\n`;
          }
        });
      }
    });

    return summary || '（暂无对话内容）';
  },

  // 计算字数
  getWordCount() {
    const summary = this.generateSummary();
    return summary.replace(/\s/g, '').length;
  }
};

// ============================================================
// 4. 语音系统
// ============================================================

const voice = {
  recognition: null,
  isListening: false,
  onResult: null,
  onEnd: null,
  onError: null,

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      state.speechSupported = false;
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'zh-CN';

    this.recognition.onresult = (event) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      if (this.onResult) this.onResult(final, interim);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEnd) this.onEnd();
    };

    this.recognition.onerror = (event) => {
      console.warn('Speech error:', event.error);
      state.speechError = true;
      if (this.onError) this.onError(event.error);
    };
  },

  start() {
    if (!this.recognition) return;
    try {
      this.isListening = true;
      this.recognition.start();
    } catch (e) {
      console.warn('Start failed:', e);
    }
  },

  stop() {
    if (!this.recognition) return;
    try {
      this.isListening = false;
      this.recognition.stop();
    } catch (e) {
      console.warn('Stop failed:', e);
    }
  }
};

// ============================================================
// 5. 核心应用逻辑
// ============================================================

const app = {
  openingTimer: null,
  transitionTimer: null,
  pendingNextQ: null,
  followUpIndex: 0,
  showingFollowUp: false,
  _analyzing: false,
  _analyzeStepTimer: null,

  // 初始化
  init() {
    state.init();
    voice.init();
    router.init();
    this.bindEvents();
    this.initLanding();
  },

  bindEvents() {
    // 文字输入字数统计
    const pasteInput = document.getElementById('paste-input');
    const manualInput = document.getElementById('manual-input');
    const countUpdate = (el, counterId) => {
      el.addEventListener('input', () => {
        document.getElementById(counterId).textContent = `${el.value.length} 字`;
      });
    };
    if (pasteInput) countUpdate(pasteInput, 'submit-count');
    if (manualInput) countUpdate(manualInput, 'submit-count');

    // 报告输入字数
    const reportInput = document.getElementById('report-input');
    if (reportInput) {
      reportInput.addEventListener('input', () => {
        document.getElementById('report-count').textContent = `${reportInput.value.length} 字`;
      });
    }
  },

  // ===== 返回首页 =====
  goHome() {
    const inInterview = ['opening', 'question', 'transition'].includes(router.current);
    const hasProgress = Object.keys(state.answers).length > 0
      || Object.keys(state.followUpAnswers).length > 0;

    if (inInterview && hasProgress) {
      if (!confirm('返回首页？当前进度已自动保存，稍后可继续深潜。')) return;
    }

    if (state.isRecording) this.onOrbRelease();
    if (state.isFollowUpRecording) this.onOrbReleaseFollowup();
    if (this.openingTimer) {
      clearTimeout(this.openingTimer);
      this.openingTimer = null;
    }

    router.history = [];
    router.go('cover', false);
  },

  // ===== 封面页 =====
  initCover() {
    document.querySelectorAll('#page-cover .tagline-line').forEach((el) => {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });
  },

  // ===== 模式选择 =====
  initLanding() {
    document.querySelectorAll('#page-landing .mode-card').forEach((el, i) => {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = `modeCardIn 0.6s var(--ease-out) ${0.15 + i * 0.12}s both`;
    });
  },

  // ===== 开始访谈 =====
  startInterview() {
    const hasProgress = state.currentQ > 0
      || Object.keys(state.answers).length > 0
      || Object.keys(state.followUpAnswers).length > 0;

    if (hasProgress && state.currentQ > 0) {
      if (confirm(`检测到未完成的深潜（约第 ${state.currentQ + 1} 题），是否继续？`)) {
        this.followUpIndex = 0;
        this.showingFollowUp = false;
        router.go('question');
        return;
      }
    }

    state.currentQ = 0;
    state.currentSubStep = 0;
    state.answers = {};
    state.followUpAnswers = {};
    state.saveToStorage();
    this.followUpIndex = 0;
    this.showingFollowUp = false;
    router.go('opening');

    const q = QUESTIONS[0];
    const ch = CHAPTERS[q.chapter];
    document.getElementById('opening-label').textContent = `Ch.${q.chapter} ${ch.name}`;
    document.getElementById('opening-text').textContent = '我们先从「现在」开始。';

    this.openingTimer = setTimeout(() => {
      router.go('question');
    }, 2500);
  },

  extendOpening() {
    if (this.openingTimer) {
      clearTimeout(this.openingTimer);
      this.openingTimer = setTimeout(() => {
        router.go('question');
      }, 3000);
    }
  },

  // ===== 题目页初始化 =====
  initQuestion() {
    const q = QUESTIONS[state.currentQ];
    if (!q) return;

    const ch = CHAPTERS[q.chapter];

    // 设置主题
    document.body.setAttribute('data-theme', ch.theme);

    // 更新章节标签
    document.getElementById('q-chapter-label').textContent = `Ch.${q.chapter} ${ch.name}`;
    document.getElementById('q-chapter-label').style.color = ch.color;
    document.getElementById('q-chapter-time').textContent = `· ${ch.time}`;

    // 更新旅程地图
    document.querySelectorAll('.jp-layer').forEach(el => {
      const chNum = parseInt(el.dataset.ch);
      el.classList.remove('active', 'completed');
      if (chNum < q.chapter) el.classList.add('completed');
      else if (chNum === q.chapter) el.classList.add('active');
    });

    // 更新题目文本
    const textEl = document.getElementById('q-text');
    if (q.subSteps && q.subSteps.length > 0) {
      // Q8 子问题模式
      const step = q.subSteps[state.currentSubStep];
      textEl.innerHTML = `<span class="q-step-label" style="color:${ch.color};font-size:14px;display:block;margin-bottom:8px;">${step.label}</span>${this.formatQuestionText([step.text])}`;
    } else {
      textEl.innerHTML = this.formatQuestionText(q.text);
    }

    // 快捷标签
    const tagsEl = document.getElementById('q-tags');
    if (q.tags) {
      tagsEl.innerHTML = q.tags.map(t => `<button class="quick-tag" onclick="app.insertTag('${t}')">${t}</button>`).join('');
      tagsEl.classList.add('active');
    } else {
      tagsEl.classList.remove('active');
    }

    // 重置 UI 状态
    this.resetQuestionUI();

    // 检查是否已有答案
    const existingAnswer = state.getAnswer(q.id);
    if (existingAnswer && (!q.subSteps || state.currentSubStep === 0)) {
      this.showTranscript(existingAnswer);
    }

    // 语音支持检测
    if (!state.speechSupported) {
      document.getElementById('voice-orb').style.display = 'none';
      document.getElementById('orb-hint').style.display = 'none';
      document.getElementById('text-input-mode').style.display = 'block';
    }
  },

  formatQuestionText(lines) {
    return lines.map(l => `<span class="q-line">${l}</span>`).join('');
  },

  resetQuestionUI() {
    // 重置 VoiceOrb
    const orb = document.getElementById('voice-orb');
    orb.classList.remove('recording', 'done');

    // 隐藏转写气泡
    document.getElementById('transcript-bubble').style.display = 'none';
    document.getElementById('transcript-text').textContent = '';

    // 隐藏追问
    document.getElementById('ripple-followup').classList.remove('active');
    this.showingFollowUp = false;

    // 隐藏下一题按钮
    document.getElementById('btn-next').classList.remove('active');

    // 重置文字输入
    document.getElementById('text-input').value = '';

    // 重置 orb hint
    document.getElementById('orb-hint').textContent = '按住说话';
  },

  // ===== VoiceOrb 交互 =====
  onOrbPress(e) {
    e.preventDefault();
    if (state.isRecording) return;

    state.isRecording = true;
    state.currentTranscript = '';

    const orb = document.getElementById('voice-orb');
    orb.classList.add('recording');
    document.getElementById('orb-hint').textContent = '正在聆听…';
    document.getElementById('transcript-bubble').style.display = 'none';

    voice.onResult = (final, interim) => {
      state.currentTranscript += final;
      // 实时显示转写
      if (state.currentTranscript || interim) {
        this.showLiveTranscript(state.currentTranscript + interim);
      }
    };

    voice.onEnd = () => {
      if (state.isRecording) {
        // 自动重新启动（连续模式）
        setTimeout(() => voice.start(), 100);
      }
    };

    voice.onError = () => {
      this.showToast('没听到声音，要再来一次吗？');
      this.onOrbRelease();
    };

    voice.start();
  },

  onOrbRelease(e) {
    if (e) e.preventDefault();
    if (!state.isRecording) return;

    state.isRecording = false;
    voice.stop();

    const orb = document.getElementById('voice-orb');
    orb.classList.remove('recording');

    if (state.currentTranscript.trim()) {
      orb.classList.add('done');
      document.getElementById('orb-hint').textContent = '已录制';
      this.showTranscript(state.currentTranscript);
    } else {
      document.getElementById('orb-hint').textContent = '按住说话';
    }
  },

  // 追问 VoiceOrb
  onOrbPressFollowup(e) {
    e.preventDefault();
    if (state.isFollowUpRecording) return;

    state.isFollowUpRecording = true;
    state.currentFollowUpTranscript = '';

    const orb = document.getElementById('voice-orb-followup');
    orb.classList.add('recording');

    voice.onResult = (final, interim) => {
      state.currentFollowUpTranscript += final;
    };

    voice.onEnd = () => {
      if (state.isFollowUpRecording) {
        setTimeout(() => voice.start(), 100);
      }
    };

    voice.start();
  },

  onOrbReleaseFollowup(e) {
    if (e) e.preventDefault();
    if (!state.isFollowUpRecording) return;

    state.isFollowUpRecording = false;
    voice.stop();

    document.getElementById('voice-orb-followup').classList.remove('recording');

    if (state.currentFollowUpTranscript.trim()) {
      const q = QUESTIONS[state.currentQ];
      state.setFollowUpAnswer(q.id, this.followUpIndex, state.currentFollowUpTranscript);
      this.hideFollowUp();
      this.showNextButton();
      this.showToast('追问已记录');
    }
  },

  // 显示实时转写
  showLiveTranscript(text) {
    const bubble = document.getElementById('transcript-bubble');
    const textEl = document.getElementById('transcript-text');
    bubble.style.display = 'block';
    textEl.textContent = text;
  },

  // 显示转写气泡
  showTranscript(text) {
    const bubble = document.getElementById('transcript-bubble');
    const textEl = document.getElementById('transcript-text');
    bubble.style.display = 'block';
    textEl.textContent = text;
    document.getElementById('btn-next').classList.add('active');
  },

  // 重录
  rerecord() {
    this.resetQuestionUI();
    state.currentTranscript = '';
  },

  // 确认转写
  confirmTranscript() {
    const q = QUESTIONS[state.currentQ];
    const text = document.getElementById('transcript-text').textContent;

    if (q.subSteps) {
      // 子问题模式：保存到对应子步骤
      state.setFollowUpAnswer(q.id, state.currentSubStep, text);
    } else {
      state.setAnswer(q.id, text);
    }

    state.saveToStorage();
    this.checkFollowUp();
  },

  // 文字输入提交
  submitText() {
    const text = document.getElementById('text-input').value.trim();
    if (!text) {
      this.showToast('请输入内容');
      return;
    }

    const q = QUESTIONS[state.currentQ];
    if (q.subSteps) {
      state.setFollowUpAnswer(q.id, state.currentSubStep, text);
    } else {
      state.setAnswer(q.id, text);
    }
    state.saveToStorage();
    this.checkFollowUp();
  },

  // 插入快捷标签
  insertTag(tag) {
    const textMode = document.getElementById('text-input-mode').style.display !== 'none';
    if (textMode) {
      const input = document.getElementById('text-input');
      input.value = (input.value ? input.value + '，' : '') + tag;
      input.focus();
      return;
    }
    const bubble = document.getElementById('transcript-text');
    const existing = bubble.textContent.trim();
    const next = (existing ? existing + '，' : '') + tag;
    bubble.textContent = next;
    state.currentTranscript = next;
    document.getElementById('transcript-bubble').style.display = 'block';
    document.getElementById('btn-next').classList.add('active');
  },

  // 检查追问
  checkFollowUp() {
    const q = QUESTIONS[state.currentQ];

    // Q8 子问题处理
    if (q.subSteps) {
      if (state.currentSubStep < q.subSteps.length - 1) {
        state.currentSubStep++;
        state.saveToStorage();
        this.initQuestion();
        return;
      }
      state.finalizeSubStepAnswer(q);
    }

    // 普通追问
    if (q.followUps && this.followUpIndex < q.followUps.length && !this.showingFollowUp) {
      this.showFollowUp(q.followUps[this.followUpIndex]);
      return;
    }

    // 共情回应（Q4, Q10）
    if (q.empathyResponse) {
      this.showEmpathyToast(q.empathyResponse);
      setTimeout(() => {
        this.showNextButton();
      }, 2000);
      return;
    }

    this.showNextButton();
  },

  // 显示追问浮层
  showFollowUp(question) {
    this.showingFollowUp = true;
    document.getElementById('rf-question').textContent = question;
    document.getElementById('ripple-followup').classList.add('active');
  },

  // 隐藏追问
  hideFollowUp() {
    document.getElementById('ripple-followup').classList.remove('active');
    this.showingFollowUp = false;
    this.followUpIndex++;
  },

  // 跳过追问
  skipFollowup() {
    this.hideFollowUp();
    const q = QUESTIONS[state.currentQ];
    if (q.followUps && this.followUpIndex < q.followUps.length - 1) {
      this.followUpIndex++;
      this.showFollowUp(q.followUps[this.followUpIndex]);
    } else {
      this.showNextButton();
    }
  },

  // 显示下一题按钮
  showNextButton() {
    document.getElementById('btn-next').classList.add('active');
    const q = QUESTIONS[state.currentQ];
    const isLast = state.currentQ >= QUESTIONS.length - 1;
    const isLastSubStep = q.subSteps && state.currentSubStep >= q.subSteps.length - 1;

    if (isLast || (q.subSteps && isLastSubStep && state.currentQ >= QUESTIONS.length - 1)) {
      document.getElementById('btn-next-text').textContent = '完成深潜';
    } else {
      document.getElementById('btn-next-text').textContent = '下一题';
    }
  },

  // 共情 Toast
  showEmpathyToast(text) {
    const toast = document.getElementById('empathy-toast');
    toast.textContent = text;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
  },

  // ===== 下一题 =====
  nextQuestion() {
    const q = QUESTIONS[state.currentQ];

    // Q8 子问题未完成
    if (q.subSteps && state.currentSubStep < q.subSteps.length - 1) {
      state.currentSubStep++;
      this.followUpIndex = 0;
      this.initQuestion();
      return;
    }

    // 检查是否需要章节转场
    const nextIdx = state.currentQ + 1;
    if (nextIdx >= QUESTIONS.length) {
      state.saveToStorage();
      router.go('closing');
      return;
    }

    const currentCh = q.chapter;
    const nextCh = QUESTIONS[nextIdx].chapter;

    if (currentCh !== nextCh) {
      const transKey = `${currentCh}-${nextCh}`;
      const trans = TRANSITIONS[transKey];
      if (trans) {
        this.showTransition(trans, nextIdx);
        return;
      }
    }

    state.currentQ = nextIdx;
    state.currentSubStep = 0;
    state.saveToStorage();
    this.followUpIndex = 0;
    this.initQuestion();
  },

  // 跳过题目
  skipQuestion() {
    const q = QUESTIONS[state.currentQ];

    if (q.subSteps) {
      if (state.currentSubStep < q.subSteps.length - 1) {
        state.currentSubStep++;
        this.initQuestion();
        return;
      }
    }

    const nextIdx = state.currentQ + 1;
    if (nextIdx >= QUESTIONS.length) {
      state.saveToStorage();
      router.go('closing');
      return;
    }

    state.currentQ = nextIdx;
    state.currentSubStep = 0;
    state.saveToStorage();
    this.followUpIndex = 0;
    this.initQuestion();
  },

  // 章节转场
  showTransition(trans, nextIdx) {
    if (this.transitionTimer) clearTimeout(this.transitionTimer);
    this.pendingNextQ = nextIdx;
    router.go('transition');

    const bg = document.getElementById('transition-bg');
    const text = document.getElementById('transition-text');
    bg.style.background = trans.to ? `var(--${trans.to})` : 'var(--ch4)';
    text.textContent = trans.text;
    text.style.animation = 'none';
    text.offsetHeight;
    text.style.animation = 'transTextIn 1.5s var(--ease-out) 0.3s forwards';

    this.transitionTimer = setTimeout(() => this.completeTransition(), 2500);
  },

  completeTransition() {
    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer);
      this.transitionTimer = null;
    }
    if (this.pendingNextQ === null) return;
    state.currentQ = this.pendingNextQ;
    state.currentSubStep = 0;
    state.saveToStorage();
    this.followUpIndex = 0;
    this.pendingNextQ = null;
    router.go('question');
  },

  skipTransition() {
    this.completeTransition();
  },

  // ===== 对话纪要 =====
  renderSummary() {
    const editor = document.getElementById('summary-editor');
    const summary = state.generateSummary();

    let html = '';
    let currentChapter = 0;

    QUESTIONS.forEach((q) => {
      if (!state.hasQuestionContent(q)) return;

      if (q.chapter !== currentChapter) {
        currentChapter = q.chapter;
        const ch = CHAPTERS[currentChapter];
        if (html) html += '</div>';
        html += `<div class="summary-section"><div class="summary-chapter-title">${ch.name}</div>`;
      }

      const qText = Array.isArray(q.text) ? q.text.join('') : q.text;
      html += `<div class="summary-item"><div class="summary-q">${q.id}. ${qText}</div>`;

      const answer = (state.answers[q.id] || '').trim();
      if (answer) {
        if (state.editingSummary) {
          html += `<div class="summary-a" contenteditable="true" data-qid="${q.id}">${this.escapeHtml(answer)}</div>`;
        } else {
          html += `<div class="summary-a">${this.escapeHtml(answer)}</div>`;
        }
      }

      if (q.subSteps) {
        q.subSteps.forEach((step, sIdx) => {
          const subAnswer = (state.followUpAnswers[q.id] || [])[sIdx];
          if (subAnswer && subAnswer.trim()) {
            html += `<div class="summary-sub">${step.label}：${this.escapeHtml(subAnswer.trim())}</div>`;
          }
        });
      }

      const fuAnswers = state.followUpAnswers[q.id];
      if (fuAnswers && !q.subSteps && q.followUps) {
        fuAnswers.forEach((fu, fuIdx) => {
          if (fu && fu.trim()) {
            html += `<div class="summary-sub">追问：${this.escapeHtml(fu.trim())}</div>`;
          }
        });
      }

      html += '</div>';
    });

    if (html) html += '</div>';
    else html = '<p style="color:var(--silence);text-align:center;padding:40px 0;">暂无对话内容</p>';

    editor.innerHTML = html;
    document.getElementById('summary-count').textContent = `${state.getWordCount()} 字`;
  },

  editSummary() {
    state.editingSummary = !state.editingSummary;
    this.renderSummary();

    // 绑定编辑保存
    if (state.editingSummary) {
      document.querySelectorAll('.summary-a[contenteditable]').forEach(el => {
        el.addEventListener('blur', () => {
          const qid = el.dataset.qid;
          if (qid) {
            state.answers[qid] = el.textContent;
            state.saveToStorage();
          }
        });
      });
    }
  },

  // ===== 提交对话 =====
  switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
  },

  submitDialogue() {
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    const input = document.getElementById(activeTab === 'paste' ? 'paste-input' : 'manual-input');
    const text = input.value.trim();

    if (!text || text.length < 10) {
      this.showToast('请输入至少 10 字的内容');
      return;
    }

    if (!document.getElementById('privacy-check').checked) {
      this.showToast('请先同意隐私声明');
      return;
    }

    state.manualDialogue = text;
    router.go('analyze');
  },

  submitFromSummary() {
    const text = state.generateSummary();
    const count = state.getWordCount();

    if (!text || text === '（暂无对话内容）' || count < 10) {
      this.showToast('请先完成对话或补充内容');
      return;
    }

    state.manualDialogue = text;
    router.go('analyze');
  },

  getDialogueForDiagnose() {
    return state.manualDialogue || state.generateSummary();
  },

  async copyDialogueForDiagnose() {
    const dialogue = this.getDialogueForDiagnose();
    if (!dialogue || dialogue === '（暂无对话内容）') return false;

    const payload = `以下是我的战略对话记录，请据此出具个人战略诊断报告：\n\n${dialogue}`;
    try {
      await navigator.clipboard.writeText(payload);
      return true;
    } catch (e) {
      return false;
    }
  },

  // ===== 分析页（DeepSeek AI 生成报告）=====
  resetAnalyzeUI() {
    const steps = document.querySelectorAll('.a-step');
    steps.forEach(s => s.classList.remove('active', 'done'));
    const status = document.getElementById('analyze-status');
    const errBox = document.getElementById('analyze-error');
    if (status) {
      status.style.display = 'block';
      status.textContent = 'AI 咨询师正在阅读你的对话…';
    }
    if (errBox) errBox.style.display = 'none';
    if (this._analyzeStepTimer) {
      clearTimeout(this._analyzeStepTimer);
      this._analyzeStepTimer = null;
    }
  },

  runAnalyzeStepAnimation() {
    const steps = document.querySelectorAll('.a-step');
    let stepIdx = 0;

    const advance = () => {
      if (stepIdx > 0) {
        steps[stepIdx - 1].classList.remove('active');
        steps[stepIdx - 1].classList.add('done');
      }
      if (stepIdx < steps.length) {
        steps[stepIdx].classList.add('active');
        stepIdx++;
        this._analyzeStepTimer = setTimeout(advance, 1800);
      }
    };

    this._analyzeStepTimer = setTimeout(advance, 400);
  },

  showAnalyzeError(message) {
    const status = document.getElementById('analyze-status');
    const errBox = document.getElementById('analyze-error');
    const errMsg = document.getElementById('analyze-error-msg');
    if (status) status.style.display = 'none';
    if (errMsg) errMsg.textContent = message;
    if (errBox) errBox.style.display = 'block';
  },

  async startAnalysis() {
    if (this._analyzing) return;
    this._analyzing = true;
    this.resetAnalyzeUI();
    this.runAnalyzeStepAnimation();

    const dialogue = this.getDialogueForDiagnose();
    if (!dialogue || dialogue === '（暂无对话内容）' || dialogue.trim().length < 10) {
      this.showAnalyzeError('没有可分析的对话内容，请先完成访谈或提交对话。');
      this._analyzing = false;
      return;
    }

    const status = document.getElementById('analyze-status');
    try {
      if (status) status.textContent = 'AI 咨询师正在撰写你的战略报告…';
      const content = await deepseek.generateReport(dialogue);
      this.saveReportFromAI(content);
      this.showToast('战略报告已生成');
    } catch (e) {
      console.error('DeepSeek error:', e);
      const msg = e.message || '报告生成失败，请稍后重试';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        this.showAnalyzeError('网络请求失败。若部署在 GitHub Pages，可能是浏览器跨域限制，请改用手动豆包或本地预览。');
      } else {
        this.showAnalyzeError(msg);
      }
    } finally {
      this._analyzing = false;
    }
  },

  retryAnalysis() {
    this.startAnalysis();
  },

  saveReportFromAI(content) {
    const report = {
      id: 'r_' + Date.now(),
      date: new Date().toLocaleDateString('zh-CN'),
      content,
      summary: state.generateSummary(),
      source: 'deepseek'
    };

    const history = this.getHistory();
    history.unshift(report);
    localStorage.setItem('strata_history', JSON.stringify(history));

    state.currentReport = report;
    router.go('report');
  },

  async goDiagnose() {
    const copied = await this.copyDialogueForDiagnose();
    if (copied) {
      this.showToast('对话已复制，打开豆包后粘贴发送');
    } else if (this.getDialogueForDiagnose() !== '（暂无对话内容）') {
      this.showToast('请手动复制对话纪要粘贴给豆包');
    }

    const opened = this.openDoubaoBot({
      onOpened: () => {
        setTimeout(() => router.go('report-save'), 500);
      }
    });
    if (!opened) {
      setTimeout(() => router.go('report-save'), 1500);
    }
  },

  // ===== 保存报告 =====
  saveReport() {
    const text = document.getElementById('report-input').value.trim();
    if (!text) {
      this.showToast('请粘贴报告内容');
      return;
    }

    const report = {
      id: 'r_' + Date.now(),
      date: new Date().toLocaleDateString('zh-CN'),
      content: text,
      summary: state.generateSummary()
    };

    // 保存到历史
    const history = this.getHistory();
    history.unshift(report);
    localStorage.setItem('strata_history', JSON.stringify(history));

    state.currentReport = report;
    this.showToast('报告已保存');
    router.go('report');
  },

  // ===== 报告阅读器 =====
  renderReport() {
    const report = state.currentReport;
    if (!report) {
      // 尝试从参数获取
      const params = new URLSearchParams(window.location.search);
      const rid = params.get('rid');
      if (rid) {
        const found = this.getHistory().find(h => h.id === rid);
        if (found) state.currentReport = found;
      }
    }

    const r = state.currentReport;
    if (!r) {
      document.getElementById('report-body').innerHTML = '<p style="color:var(--silence);">暂无报告</p>';
      return;
    }

    document.getElementById('report-date').textContent = r.date;

    // 解析报告内容（简单的 Markdown 解析）
    const html = this.parseReport(r.content);
    document.getElementById('report-body').innerHTML = html;
  },

  parseReport(text) {
    const sections = text.split(/\n#{1,3}\s+/).filter(Boolean);
    if (sections.length <= 1) {
      // 没有标题，整体显示
      return `<div class="report-section"><div class="report-section-body"><p>${this.escapeHtml(text).replace(/\n/g, '</p><p>')}</p></div></div>`;
    }

    return sections.map((section, i) => {
      const lines = section.split('\n').filter(Boolean);
      const title = lines[0] || '';
      const body = lines.slice(1).join('\n');

      return `<div class="report-section">
        <div class="report-section-title">${this.escapeHtml(title)}</div>
        <div class="report-section-body">${this.formatReportBody(body)}</div>
      </div>`;
    }).join('');
  },

  formatReportBody(text) {
    let html = this.escapeHtml(text);

    // 引用
    html = html.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');
    // 列表
    html = html.replace(/^[-*]\s*(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    // 段落
    html = html.split('\n\n').map(p => {
      if (p.startsWith('<')) return p;
      return `<p>${p}</p>`;
    }).join('');

    return html;
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  saveReportLocal() {
    const r = state.currentReport;
    if (!r) return;

    const blob = new Blob([r.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${BRAND_NAME}-战略报告-${r.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('报告已下载');
  },

  shareReport() {
    const r = state.currentReport;
    if (!r) return;

    if (navigator.share) {
      navigator.share({
        title: `我的 ${BRAND_NAME} 战略报告`,
        text: r.content.substring(0, 200) + '...'
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(r.content).then(() => {
        this.showToast('报告已复制到剪贴板');
      }).catch(() => {
        this.showToast('复制失败');
      });
    }
  },

  // ===== 历史记录 =====
  getHistory() {
    try {
      const data = localStorage.getItem('strata_history');
      return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
  },

  renderHistory() {
    const list = document.getElementById('history-list');
    const empty = document.getElementById('history-empty');
    const history = this.getHistory();

    if (history.length === 0) {
      list.innerHTML = '';
      empty.classList.add('active');
      return;
    }

    empty.classList.remove('active');
    list.innerHTML = history.map(h => `
      <div class="history-item" onclick="app.openReport('${h.id}')">
        <div class="history-item-date">${h.date}</div>
        <div class="history-item-title">战略诊断报告</div>
        <div class="history-item-snippet">${h.summary ? h.summary.substring(0, 60) + '...' : h.content.substring(0, 60) + '...'}</div>
      </div>
    `).join('');
  },

  openReport(id) {
    const found = this.getHistory().find(h => h.id === id);
    if (found) {
      state.currentReport = found;
      router.go('report');
    }
  },

  // ===== 豆包相关 =====
  isRestrictedInAppBrowser() {
    const ua = navigator.userAgent || '';
    return /MicroMessenger|Weibo|QQ\//i.test(ua);
  },

  openDoubaoBot({ onOpened } = {}) {
    const url = DOUBAO_BOT_URL;

    if (this.isRestrictedInAppBrowser()) {
      this.showDoubaoFallback('微信等内置浏览器无法直接跳转，请复制链接后在系统浏览器中打开。');
      return false;
    }

    const opened = window.open(url, '_blank', 'noopener,noreferrer');

    if (!opened) {
      this.showDoubaoFallback('无法自动打开豆包，请复制下方链接，粘贴到浏览器地址栏访问。');
      return false;
    }

    try {
      opened.opener = null;
    } catch (e) { /* ignore */ }

    if (onOpened) onOpened();
    return true;
  },

  showDoubaoFallback(message) {
    const modal = document.getElementById('doubao-fallback-modal');
    const msgEl = document.getElementById('doubao-fallback-msg');
    const linkEl = document.getElementById('doubao-fallback-link');
    if (msgEl) msgEl.textContent = message;
    if (linkEl) linkEl.textContent = DOUBAO_BOT_URL;
    if (modal) modal.classList.add('active');
  },

  closeDoubaoFallback() {
    document.getElementById('doubao-fallback-modal')?.classList.remove('active');
  },

  async copyDoubaoLink() {
    try {
      await navigator.clipboard.writeText(DOUBAO_BOT_URL);
      this.showToast('链接已复制，请在浏览器中打开');
    } catch (e) {
      const input = document.getElementById('doubao-fallback-link-input');
      if (input) {
        input.value = DOUBAO_BOT_URL;
        input.select();
        document.execCommand('copy');
        this.showToast('链接已复制，请在浏览器中打开');
      } else {
        this.showToast('复制失败，请长按链接手动复制');
      }
    }
  },

  initDoubaoGuide() {
    const hint = document.getElementById('doubao-wechat-hint');
    if (hint) hint.style.display = this.isRestrictedInAppBrowser() ? 'block' : 'none';
  },

  confirmDoubao() {
    document.getElementById('doubao-confirm-modal').classList.add('active');
  },

  closeDoubaoConfirm() {
    document.getElementById('doubao-confirm-modal').classList.remove('active');
  },

  confirmGoDoubao() {
    this.closeDoubaoConfirm();
    const opened = this.openDoubaoBot({
      onOpened: () => {
        setTimeout(() => router.go('submit'), 800);
      }
    });
    if (!opened) {
      // 跳转失败时仍引导用户去提交页，聊完后可回来粘贴
      setTimeout(() => router.go('submit'), 1500);
    }
  },

  showTutorial() {
    document.getElementById('tutorial-modal').classList.add('active');
  },

  closeTutorial() {
    document.getElementById('tutorial-modal').classList.remove('active');
  },

  // ===== 隐私与数据 =====
  clearAllData() {
    if (confirm('确定要清除所有本地数据吗？此操作不可恢复。')) {
      state.clearStorage();
      this.showToast('所有数据已清除');
      router.go('cover');
    }
  },

  // ===== 通用工具 =====
  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 2500);
  }
};

// ============================================================
// 6. 启动应用
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
