/* UI MODULE */
// 切换模型按钮
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
prevButton.addEventListener('click', () => {
  const newIndex = (currentModelIndex - 1 + config.models.length) % config.models.length;
  loadModel(newIndex);
});
nextButton.addEventListener('click', () => {
  const newIndex = (currentModelIndex + 1) % config.models.length;
  loadModel(newIndex);
});

// 创建导航圆点
const modelDotsContainer = document.getElementById('model-dots');

// 清空容器
while (modelDotsContainer.firstChild) {
  modelDotsContainer.removeChild(modelDotsContainer.firstChild);
}

// 为每个模型创建一个圆点
config.models.forEach((model, index) => {
  const dot = document.createElement('div');
  dot.className = 'model-dot';
  if (index === currentModelIndex) {
    dot.classList.add('active');
  }
  
  // 添加点击事件
  dot.addEventListener('click', () => {
    loadModel(index);
  });
  
  modelDotsContainer.appendChild(dot);
});

// 夜间模式切换
const nightModeButton = document.getElementById('night-mode-button');
const nightModeIcon = nightModeButton.querySelector('i');

nightModeButton.addEventListener('click', () => {
  const isDarkMode = document.documentElement.classList.toggle('dark');

  if (typeof applySceneThemeLighting === 'function') {
    applySceneThemeLighting(isDarkMode);
  }
  if (typeof refreshCurrentModelTheme === 'function') {
    refreshCurrentModelTheme(isDarkMode);
  }

  if (isDarkMode) {
    nightModeIcon.className = 'fas fa-moon';
  } else {
    nightModeIcon.className = 'fas fa-sun';
  }
});

// 设置初始图标状态
if (document.documentElement.classList.contains('dark')) {
  nightModeIcon.className = 'fas fa-moon';
} else {
  nightModeIcon.className = 'fas fa-sun';
}

if (typeof applySceneThemeLighting === 'function') {
  applySceneThemeLighting(document.documentElement.classList.contains('dark'));
}
