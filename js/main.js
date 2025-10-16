// main.js

// 從我們的模組中引入需要的函式
import { setupLive2D } from './live2d-manager.js';
import { setupUI } from './ui-manager.js';

// 主執行函式
(async function () {
    // 建立 PIXI 應用
    const canvas = document.getElementById('live2d-canvas');
    const app = new PIXI.Application({ view: canvas, autoStart: true, resizeTo: window, transparent: true });

    // 步驟 1：設定 Live2D，並等待模型物件回傳
    const model = await setupLive2D(app);

    // 步驟 2：將模型物件傳遞給 UI 管理器，設定 UI 互動
    setupUI(model);

    console.log("Main: 所有模組初始化完成。");
})();