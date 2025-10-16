// ui-manager.js

// 導出一個函式，專門用來設定 UI 互動
export function setupUI(model) {
    const actionMenu = document.getElementById('action-menu');
    const dialogueBox = document.getElementById('dialogue-box');
    const dialogueIcon = document.getElementById('icon-dialogue');
    const closeButton = document.getElementById('close-button');
    const dialogueTextElement = document.getElementById('dialogue-text');
    
    let menuHideTimer = null;
    let isHovering = false;

    const showMenu = () => { clearTimeout(menuHideTimer); actionMenu.classList.add('visible'); };
    const hideMenu = () => { menuHideTimer = setTimeout(() => { actionMenu.classList.remove('visible'); }, 300); };
    
    window.addEventListener('pointermove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const modelBounds = model.getBounds();
        if (modelBounds.contains(mouseX, mouseY)) {
            if (!isHovering) {
                isHovering = true;
                showMenu();
            }
        } else {
            if (isHovering) {
                isHovering = false;
                hideMenu();
            }
        }
    });
    
    document.addEventListener('mouseleave', () => {
        if (isHovering) {
            isHovering = false;
            hideMenu();
        }
    });

    actionMenu.addEventListener('mouseover', showMenu);
    actionMenu.addEventListener('mouseout', hideMenu);

    // 對話視窗邏輯
    const dialogueLines = [ "歡迎來到我們的網站。", "這是一個展示 Live2D 技術的互動專案。", "你可以用滑鼠與我互動，我的視線會跟隨你。", "接下來，我們將會增加更多有趣的功能。", "請期待我們的下一次更新！" ];
    let currentLineIndex = 0;
    let dialogueInterval = null;

    const openDialogue = () => {
        clearTimeout(menuHideTimer);
        dialogueBox.classList.add('visible');
        dialogueIcon.classList.add('active');
        dialogueTextElement.innerText = dialogueLines[currentLineIndex];
        if (dialogueInterval) clearInterval(dialogueInterval);
        dialogueInterval = setInterval(() => {
            currentLineIndex = (currentLineIndex + 1) % dialogueLines.length;
            dialogueTextElement.innerText = dialogueLines[currentLineIndex];
        }, 5000);
    };

    const closeDialogue = () => {
        dialogueBox.classList.remove('visible');
        dialogueIcon.classList.remove('active');
        clearInterval(dialogueInterval);
        dialogueInterval = null;
    };

    dialogueIcon.addEventListener('click', () => {
        if (dialogueBox.classList.contains('visible')) {
            closeDialogue();
        } else {
            openDialogue();
        }
    });

    closeButton.addEventListener('click', closeDialogue);

    console.log("UI Manager: 互動功能已啟用。");
}