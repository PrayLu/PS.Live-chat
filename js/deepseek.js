/**
 * DeepSeek API — 个人战略诊断报告生成
 */
const deepseek = {
  async generateReport(dialogue) {
    const apiKey = (APP_CONFIG.DEEPSEEK_API_KEY || '').trim();
    if (!apiKey) {
      throw new Error('未配置 DeepSeek API Key，请在 js/config.js 中设置');
    }

    const systemPrompt = await prompts.getSystemPrompt();
    const userMessage = prompts.buildUserMessage(dialogue);

    const url = `${APP_CONFIG.DEEPSEEK_BASE_URL}/chat/completions`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: APP_CONFIG.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.6,
        max_tokens: 4096,
        stream: false
      })
    });

    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const err = await res.json();
        detail = err.error?.message || err.message || detail;
      } catch (e) { /* ignore */ }
      throw new Error(`AI 咨询师请求失败：${detail}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('AI 返回内容为空，请重试');
    }

    return content;
  }
};
