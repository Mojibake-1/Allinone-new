/* CONFIG MODULE */
const config = {
  models: [
    { 
      name: "ChatGPT", 
      file: "chatgpt.gltf",
      description: "GPT-5.2 系列成为新主力，并持续更新推理与编程能力",
      version: "GPT-5.2 / 5.2 Thinking / 5.2 Pro / Codex 5.3"
    }, 
    { 
      name: "Claude", 
      file: "claude.gltf",
      description: "Opus 4.6 强化代码与代理任务，支持 1M 上下文窗口（Beta）",
      version: "Opus 4.6 / Sonnet 4.5"
    },
    { 
      name: "DeepSeek", 
      file: "deepseek.gltf",
      description: "V3.2 系列主打推理与 Agent，支持“思考 + 工具调用”一体化",
      version: "V3.2 / V3.2-Speciale"
    },
    { 
      name: "Gemini", 
      file: "gemini.gltf",
      description: "Gemini 3 Pro 预览上线，强化多模态推理、代码与 Agent 能力",
      version: "Gemini 3 Pro / Gemini 3 Flash"
    },
    { 
      name: "Grok", 
      file: "grok.gltf",
      description: "Grok 4.1 已在 App 端上线，4.1 Fast 聚焦高效工具调用与长上下文",
      version: "Grok 4.1 / Grok 4.1 Fast"
    }
  ],
  defaultIndex: 0, // 默认加载的模型索引
  rotationSpeed: (2 * Math.PI) / 40, // 40秒完成一圈
}; 
