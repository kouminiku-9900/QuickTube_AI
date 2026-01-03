// gemini_auto_submit.js

async function initGeminiAutoSubmit() {
    // ストレージから保留中の要約タスクを確認
    const data = await new Promise(resolve => {
        chrome.storage.local.get(['pendingSummary', 'summaryText'], resolve);
    });

    if (!data.pendingSummary || !data.summaryText) {
        return;
    }

    console.log('Gemini Auto Submit: 保留中の要約タスクを見つけました');

    // 入力フィールドが見つかるまで待機
    const inputField = await waitForElement('.ql-editor, div[contenteditable="true"], textarea');

    if (!inputField) {
        console.error('Gemini Auto Submit: 入力フィールドが見つかりませんでした');
        return;
    }

    // UIの準備ができるまで少し待つ
    await new Promise(r => setTimeout(r, 1500));

    // テキストを入力
    console.log('Gemini Auto Submit: テキストを入力中...');

    inputField.focus();
    inputField.click();

    document.execCommand('insertText', false, data.summaryText);

    if (!inputField.textContent || inputField.textContent.trim() === '') {
        inputField.innerText = data.summaryText;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // 送信ボタンが有効になるのを待つ
    await new Promise(r => setTimeout(r, 1000));

    // 送信ボタンを探してクリック
    const sendButtonSelector = 'button[aria-label*="送信"], button[aria-label*="Send"], button.send-button';
    const sendButton = await waitForElement(sendButtonSelector);

    if (sendButton) {
        console.log('Gemini Auto Submit: 送信ボタンをクリックします');
        sendButton.click();

        // タスク完了としてストレージをクリア
        chrome.storage.local.remove(['pendingSummary', 'summaryText']);
    }
}

function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element) {
            return resolve(element);
        }

        const observer = new MutationObserver((mutations) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            resolve(null);
        }, timeout);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGeminiAutoSubmit);
} else {
    initGeminiAutoSubmit();
}
