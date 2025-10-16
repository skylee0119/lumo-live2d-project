// live2d-manager.js

// 導出一個非同步函式，專門用來設定 Live2D 模型
export async function setupLive2D(app) {
    const modelPath = './Resources/robot/robot.model3.json';
    const model = await PIXI.live2d.Live2DModel.from(modelPath);
    app.stage.addChild(model);

    // 設定大小和位置
    let scale = Math.min(window.innerWidth / model.width * 0.8, window.innerHeight / model.height * 0.8);
    scale *= 0.2;
    model.scale.set(scale);
    model.anchor.set(0, 1);
    const margin = 20;
    model.position.set(margin, window.innerHeight - margin);
    
    // 平滑追蹤邏輯
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

    // 將 model 物件回傳，給其他模組使用
    return model;
}