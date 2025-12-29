// YouTube Gemini Summarizer Content Script

// 要約ボタンが既に追加されているかチェックするフラグ
let summaryButtonAdded = false;

// 要約タブが表示されているかチェックするフラグ
let summaryTabVisible = false;

// 要約タブのDOM要素
let summaryTab = null;

// YouTubeページの読み込み完了を待つ
function waitForYouTubeLoad() {
  console.log('Waiting for YouTube to load...');
  const checkInterval = setInterval(() => {
    const buttonContainer = document.querySelector('#top-level-buttons-computed');
    console.log('Button container found:', buttonContainer);
    if (buttonContainer && !summaryButtonAdded) {
      addSummaryButton();
      summaryButtonAdded = true;
      clearInterval(checkInterval);
    }
  }, 1000);
}

// 要約ボタンを追加する関数
function addSummaryButton() {
  console.log('Adding summary button...');
  const buttonContainer = document.querySelector('#top-level-buttons-computed');
  if (!buttonContainer) {
    console.log('Button container not found');
    return;
  }

  // 要約ボタンを作成
  const summaryButton = document.createElement('yt-button-view-model');
  summaryButton.className = 'ytd-menu-renderer';
  summaryButton.innerHTML = `
    <button-view-model class="yt-spec-button-view-model style-scope ytd-menu-renderer">
      <button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment" 
             title="Geminiで要約" 
             aria-label="Geminiで要約" 
             aria-disabled="false" 
             id="gemini-summary-button">
        <div aria-hidden="true" class="yt-spec-button-shape-next__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
          </svg>
        </div>
        <div class="yt-spec-button-shape-next__button-text-content">要約</div>
      </button>
    </button-view-model>
  `;

  // いいねボタンの前に挿入
  const likeDislikeButton = buttonContainer.querySelector('segmented-like-dislike-button-view-model');
  if (likeDislikeButton) {
    buttonContainer.insertBefore(summaryButton, likeDislikeButton);
    console.log('Summary button added successfully');
  } else {
    // いいねボタンが見つからない場合は最初に挿入
    buttonContainer.insertBefore(summaryButton, buttonContainer.firstChild);
    console.log('Summary button added at the beginning');
  }

  // ボタンクリックイベントを追加
  const button = summaryButton.querySelector('#gemini-summary-button');
  button.addEventListener('click', toggleSummaryTab);
}


// 要約を実行してGeminiを小窓で開く関数
function openGeminiMiniWindow() {
  const videoUrl = window.location.href;
  const summaryText = `${videoUrl}\n\nこの動画を要約してください。`;

  // ストレージにテキストとフラグを保存
  chrome.storage.local.set({
    pendingSummary: true,
    summaryText: summaryText
  }, function () {
    // Geminiを小窓（ポップアップウィンドウ）で開く
    // 画面の右側に配置されるように計算
    const width = 450;
    const height = 600;
    const left = window.screen.width - width;
    const top = 100;

    window.open(
      'https://gemini.google.com/app',
      'GeminiWindow',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
    );
  });
}

// ボタンクリックイベントを変更
function addSummaryButton() {
  console.log('Adding summary button...');
  const buttonContainer = document.querySelector('#top-level-buttons-computed');
  if (!buttonContainer) {
    return;
  }

  const summaryButton = document.createElement('yt-button-view-model');
  summaryButton.className = 'ytd-menu-renderer';
  summaryButton.innerHTML = `
    <button-view-model class="yt-spec-button-view-model style-scope ytd-menu-renderer">
      <button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment" 
             title="Geminiで要約（小窓）" 
             aria-label="Geminiで要約（小窓）" 
             aria-disabled="false" 
             id="gemini-summary-button">
        <div aria-hidden="true" class="yt-spec-button-shape-next__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
          </svg>
        </div>
        <div class="yt-spec-button-shape-next__button-text-content">要約</div>
      </button>
    </button-view-model>
  `;

  const likeDislikeButton = buttonContainer.querySelector('segmented-like-dislike-button-view-model');
  if (likeDislikeButton) {
    buttonContainer.insertBefore(summaryButton, likeDislikeButton);
  } else {
    buttonContainer.insertBefore(summaryButton, buttonContainer.firstChild);
  }

  // ボタンクリック時は直接Gemini小窓を開く
  const button = summaryButton.querySelector('#gemini-summary-button');
  button.addEventListener('click', openGeminiMiniWindow);
}

// ページ変更を監視（YouTubeのSPA対応）
function observePageChanges() {
  let currentUrl = window.location.href;

  const observer = new MutationObserver(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      summaryButtonAdded = false;
      // 新しいページで要約ボタンを再追加
      setTimeout(waitForYouTubeLoad, 1000);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 初期化
function init() {
  console.log('YouTube Gemini Summarizer initialized');
  waitForYouTubeLoad();
  observePageChanges();
}

// ページ読み込み完了後に初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


