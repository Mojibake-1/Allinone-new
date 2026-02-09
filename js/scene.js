/* SCENE MODULE */
// 初始化Three.js的场景、相机和渲染器
const scene = new THREE.Scene();
// 透明背景，显示页面底图
scene.background = null;

const modelContainer = document.getElementById('model-container');

// 读取模型容器当前尺寸，避免硬编码比例带来的响应式问题
function getContainerSize() {
  const fallbackHeight = window.innerHeight * (window.innerWidth < 768 ? 0.5 : 0.58);
  const rect = modelContainer ? modelContainer.getBoundingClientRect() : null;

  return {
    width: Math.max(1, Math.floor(rect && rect.width ? rect.width : window.innerWidth)),
    height: Math.max(1, Math.floor(rect && rect.height ? rect.height : fallbackHeight))
  };
}

const initialSize = getContainerSize();

// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  initialSize.width / initialSize.height,
  0.1,
  1000
);
camera.position.z = 5;

// 判断是否为移动设备并调整相机位置
function adjustCameraForMobile() {
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    camera.position.y = 0.8; // 移动端相机向上移动
  } else {
    camera.position.y = 0; // 桌面端保持原位置
  }
}

// 初始调整
adjustCameraForMobile();

// 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true, physicallyCorrectLights: true, alpha: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
updateRendererSize();

// 更新渲染器尺寸
function updateRendererSize() {
  const { width, height } = getContainerSize();
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

// 窗口大小变化时更新相机和渲染器
window.addEventListener('resize', () => {
  updateRendererSize();
  adjustCameraForMobile();
});

// 监听容器自身尺寸变化（如断点切换）
if (window.ResizeObserver && modelContainer) {
  const resizeObserver = new ResizeObserver(() => {
    updateRendererSize();
  });
  resizeObserver.observe(modelContainer);
}

// 将渲染器添加到页面
modelContainer.appendChild(renderer.domElement);

// 控制器
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 添加光源
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 10);
pointLight1.position.set(2, 2, 2);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 1.5, 10);
pointLight2.position.set(-2, -2, 2);
scene.add(pointLight2);

const sceneThemeProfiles = {
  dark: {
    exposure: 1.0,
    ambient: 1.0,
    directional: 2.0,
    point: 1.5
  },
  light: {
    exposure: 1.2,
    ambient: 1.35,
    directional: 2.5,
    point: 1.9
  }
};

function applySceneThemeLighting(isDarkMode = document.documentElement.classList.contains('dark')) {
  const profile = isDarkMode ? sceneThemeProfiles.dark : sceneThemeProfiles.light;
  renderer.toneMappingExposure = profile.exposure;
  ambientLight.intensity = profile.ambient;
  directionalLight.intensity = profile.directional;
  pointLight1.intensity = profile.point;
  pointLight2.intensity = profile.point;
}

applySceneThemeLighting();
