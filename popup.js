// YouTube Gemini Summarizer Popup Script

document.addEventListener('DOMContentLoaded', function () {
  checkCurrentTab();
});

async function checkCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const statusElement = document.getElementById('status');
    const statusText = document.getElementById('status-text');

    if (tab.url && tab.url.includes('youtube.com/watch')) {
      statusElement.className = 'status active';
      statusText.innerHTML = '✅ <b>利用可能です</b><br><small>動画ページの「要約」ボタンを押してください</small>';
    } else {
      statusElement.className = 'status inactive';
      statusText.innerHTML = '⚠️ <b>YouTube動画ページを開いてください</b>';
    }
  } catch (error) {
    console.error('Error checking tab:', error);
    const statusElement = document.getElementById('status');
    const statusText = document.getElementById('status-text');
    statusElement.className = 'status inactive';
    statusText.textContent = 'エラーが発生しました';
  }
}
