/**
 * 诊断提示词加载
 */
const prompts = {
  _cache: null,

  async getSystemPrompt() {
    if (this._cache) return this._cache;

    const path = APP_CONFIG.PROMPT_PATH || 'docs/diagnosis-prompt.md';
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error('无法加载诊断提示词文档');
    }

    this._cache = await res.text();
    return this._cache;
  },

  buildUserMessage(dialogue) {
    return [
      '以下是用户完成的战略对话/访谈记录（可能来自语音深潜或豆包交流），请作为输入材料：',
      '',
      '---',
      dialogue,
      '---',
      '',
      '请严格按照提示词文档中的「输出格式（固定模板）」输出一份完整的《个人战略分析报告》。',
      '要求：',
      '1. 必须包含：一句话判断、详细拆解、核心困境、类型归属、战略解法（本质版/人话版/四句版）',
      '2. 结合用户原话中的具体信息，避免空泛套话',
      '3. 使用 Markdown 格式，用 ### 作为章节标题',
      '4. 语气专业、支持性，非评判性'
    ].join('\n');
  }
};
