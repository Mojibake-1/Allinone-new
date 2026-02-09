/* MODEL LOADER MODULE */
const loader = new THREE.GLTFLoader();
const modelCacheMap = {}; // 缓存已经加载的模型
let currentModel = null;  // 当前显示的模型
let currentModelIndex = config.defaultIndex;
let activeLoadToken = 0; // 仅允许最新一次加载请求渲染到场景

function getModelMaterialTheme(isDarkMode = document.documentElement.classList.contains('dark')) {
  return isDarkMode
    ? {
        metalness: 0.12,
        roughness: 0.5,
        envMapIntensity: 1.0,
        normalScale: 1.0
      }
    : {
        metalness: 0.06,
        roughness: 0.36,
        envMapIntensity: 1.35,
        normalScale: 1.2
      };
}

function tuneMaterialForTheme(material, profile) {
  if (!material || !material.isMaterial) return material;

  const themedMaterial = material.userData && material.userData.__themeMutable
    ? material
    : material.clone();
  themedMaterial.userData = themedMaterial.userData || {};
  themedMaterial.userData.__themeMutable = true;

  if (typeof themedMaterial.metalness === 'number') {
    themedMaterial.metalness = profile.metalness;
  }
  if (typeof themedMaterial.roughness === 'number') {
    themedMaterial.roughness = profile.roughness;
  }
  if (typeof themedMaterial.envMapIntensity === 'number') {
    themedMaterial.envMapIntensity = profile.envMapIntensity;
  }
  if (themedMaterial.normalMap && themedMaterial.normalScale && themedMaterial.normalScale.set) {
    themedMaterial.normalScale.set(profile.normalScale, profile.normalScale);
  }

  themedMaterial.needsUpdate = true;
  return themedMaterial;
}

function applyModelMaterialTheme(model, isDarkMode = document.documentElement.classList.contains('dark')) {
  if (!model) return;
  const profile = getModelMaterialTheme(isDarkMode);

  model.traverse((node) => {
    if (!node.isMesh || !node.material) return;

    if (Array.isArray(node.material)) {
      node.material = node.material.map((material) => tuneMaterialForTheme(material, profile));
      return;
    }

    node.material = tuneMaterialForTheme(node.material, profile);
  });
}

function refreshCurrentModelTheme(isDarkMode = document.documentElement.classList.contains('dark')) {
  if (!currentModel) return;
  applyModelMaterialTheme(currentModel, isDarkMode);
}

function loadModel(index) {
  const modelInfo = config.models[index];
  if (!modelInfo) return;
  const loadToken = ++activeLoadToken;
  currentModelIndex = index;
  
  // 更新导航圆点
  const dots = document.querySelectorAll('.model-dot');
  dots.forEach((dot, dotIndex) => {
    if (dotIndex === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // 发布模型变更事件
  dispatchModelChangedEvent(index, modelInfo);

  // 如果场景中已有模型，先移除
  if (currentModel) {
    scene.remove(currentModel);
    currentModel = null;
  }

  // 从缓存读取或加载新模型
  if (modelCacheMap[modelInfo.file]) {
    if (loadToken !== activeLoadToken) return;
    const cachedModel = modelCacheMap[modelInfo.file];
    // 如果有SkeletonUtils，就用它来克隆
    const cloneModel = THREE.SkeletonUtils
      ? THREE.SkeletonUtils.clone(cachedModel)
      : cachedModel.clone();
    applyModelMaterialTheme(cloneModel);
    scene.add(cloneModel);
    currentModel = cloneModel;
    return;
  }

  loader.load(
    modelInfo.file,
    function (gltf) {
      const newModel = gltf.scene;

      // 自动调整模型位置和大小
      const box = new THREE.Box3().setFromObject(newModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      newModel.position.x += (newModel.position.x - center.x);
      newModel.position.y += (newModel.position.y - center.y);
      
      // 移动端模型位置微调
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        newModel.position.y -= 0; // 移动端模型稍微下移，配合上移的相机
      }
      
      newModel.position.z += (newModel.position.z - center.z);

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.0 / maxDim;
      newModel.scale.set(scale, scale, scale);
      newModel.rotation.y = -0.5;
      modelCacheMap[modelInfo.file] = newModel; // 缓存

      if (loadToken !== activeLoadToken) return;
      const cloneModel = THREE.SkeletonUtils
        ? THREE.SkeletonUtils.clone(newModel)
        : newModel.clone();
      applyModelMaterialTheme(cloneModel);
      scene.add(cloneModel);
      currentModel = cloneModel;
    },
    undefined,
    function (error) {
      console.error('加载模型出错:', error);
    }
  );
}

// 创建和发布模型变更事件的函数
function dispatchModelChangedEvent(index, modelInfo) {
  console.log('切换模型:', index, modelInfo.name, modelInfo.description); // 添加调试日志
  const event = new CustomEvent('modelChanged', {
    detail: {
      index: index,
      modelInfo: modelInfo
    }
  });
  document.dispatchEvent(event);
}

// 初始加载
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM已加载，开始加载模型...');
  loadModel(currentModelIndex);
});
