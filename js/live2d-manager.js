// live2d-manager.js

// 導出一個非同步函式，專門用來設定 Live2D 模型
export async function setupLive2D(app) {
    const modelPath = './Resources/robot/robot.model3.json';
    const model = await PIXI.live2d.Live2DModel.from(modelPath);
    app.stage.addChild(model);

    function onResize() {
        // ----- 修改點：改用 app.screen 的尺寸來進行計算，確保在所有設備上都精確 -----
        const screenWidth = app.screen.width;
        const screenHeight = app.screen.height;

        // 計算一個適合螢幕的基礎大小
        let scale = Math.min(
            screenWidth / model.internalModel.width * 0.8,
            screenHeight / model.internalModel.height * 0.8
        );
        // ----- 修改結束 -----

        // 將基礎大小再縮小為 20%
        scale *= 0.2;
        model.scale.set(scale);

        // 將模型的錨點（定位點）設定為左下角
        model.anchor.set(0, 1);

        // ----- 修改點：改用 screenHeight 來定位 -----
        // 將模型定位到螢幕的左下角 (並增加 20px 的邊距)
        const margin = 20;
        model.position.set(margin, screenHeight - margin);
        // ----- 修改結束 -----
    }

    // 在程式初始化時，和視窗尺寸變動時，都呼叫 onResize
    onResize();
    window.addEventListener('resize', onResize);
    
    // 平滑追蹤邏輯 (與之前相同)
    let targetParamX = 0, targetParamY = 0, currentParamX = 0, currentParamY = 0;
    const easingFactor = 0.05;

    window.addEventListener('pointermove', (e) => {
        targetParamX = (e.clientX / window.innerWidth - 0.5) * 60;
        targetParamY = (e.clientY / window.innerHeight - 0.5) * -60;
    });

    document.addEventListener('mouseleave', () => {
        targetParamX = 0;
        targetParamY = 0;
    });

    app.ticker.add(() => {
        currentParamX += (targetParamX - currentParamX) * easingFactor;
        currentParamY += (targetParamY - currentParamY) * easingFactor;
        model.internalModel.coreModel.setParameterValueById('BODY_ANGLE_X', currentParamX);
        model.internalModel.coreModel.setParameterValueById('BODY_ANGLE_Y', currentParamY);
    });

    console.log("Live2D Manager: 模型載入成功！平滑追蹤已啟用。");

    return model;
}