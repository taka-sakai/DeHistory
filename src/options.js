/**
 * @file オプションページのスクリプト
 * @description 許可リストと実行設定を管理するUIロジック
 */

import { Logger } from './logger.js';
import {
    DEFAULT_SETTINGS,
    STORAGE_KEYS,
    ALLOWLIST_KEYS
} from './constants.js';

import {
    displayStatusMessage,
    clearStatusMessage,
    parseAllowlistLine
} from './utils.js';

import { applyI18n } from './i18n.js';

applyI18n();

/**
 * エラーリストを表示
 * @param {string[]} messages - 表示するエラーメッセージ
 * @returns {void}
 * @description メッセージにはユーザーが入力した行がそのまま含まれるため、
 * マークアップとして解釈されないようテキストノードとして描画する
 */
function showErrorList(messages) {
    const errorItems = document.getElementById('errorItems');
    errorItems.replaceChildren(...messages.map(message => {
        const li = document.createElement('li');
        li.textContent = message;
        return li;
    }));
    document.getElementById('errorList').style.display = 'block';
}

/**
 * ページ読み込み時にストレージから許可リストと設定を読み込んで表示
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        chrome.storage.local.get([
            STORAGE_KEYS.ALLOWLIST,
            STORAGE_KEYS.RUN_ON_STARTUP,
            STORAGE_KEYS.RUN_ON_CLOSE,
            STORAGE_KEYS.REMOVE_DOWNLOADS,
            STORAGE_KEYS.REMOVE_FORMDATA,
            STORAGE_KEYS.REMOVE_HISTORY,
            STORAGE_KEYS.REMOVE_COOKIES,
            STORAGE_KEYS.REMOVE_CACHE_AND_STORAGE
        ], (result) => {
            try {
                Logger.debug('読み込んだ設定:', result);

                if (chrome.runtime.lastError) {
                    Logger.error('設定読み込みエラー:', chrome.runtime.lastError);
                    displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('options_loadFailed'));
                    return;
                }

                // 配列であることを保証
                const allowlist = result[STORAGE_KEYS.ALLOWLIST] || [];

                // オブジェクト形式からカンマ区切り形式に変換して表示
                const lines = allowlist.map(entry => {
                    const domain = entry[ALLOWLIST_KEYS.DOMAIN];
                    const keepCookies = entry[ALLOWLIST_KEYS.KEEP_COOKIES] ? 1 : 0;
                    const keepCache = entry[ALLOWLIST_KEYS.KEEP_CACHE] ? 1 : 0;
                    return `${domain},${keepCookies},${keepCache}`;
                });
                document.getElementById('allowlist').value = lines.join('\n');
                document.getElementById('runOnStartup').checked = result[STORAGE_KEYS.RUN_ON_STARTUP] ?? DEFAULT_SETTINGS.RUN_ON_STARTUP;
                document.getElementById('runOnClose').checked = result[STORAGE_KEYS.RUN_ON_CLOSE] ?? DEFAULT_SETTINGS.RUN_ON_CLOSE;
                document.getElementById('removeDownloads').checked = result[STORAGE_KEYS.REMOVE_DOWNLOADS] ?? DEFAULT_SETTINGS.REMOVE_DOWNLOADS;
                document.getElementById('removeFormData').checked = result[STORAGE_KEYS.REMOVE_FORMDATA] ?? DEFAULT_SETTINGS.REMOVE_FORMDATA;
                document.getElementById('removeHistory').checked = result[STORAGE_KEYS.REMOVE_HISTORY] ?? DEFAULT_SETTINGS.REMOVE_HISTORY;
                document.getElementById('removeCookies').checked = result[STORAGE_KEYS.REMOVE_COOKIES] ?? DEFAULT_SETTINGS.REMOVE_COOKIES;
                document.getElementById('removeCacheAndStorage').checked = result[STORAGE_KEYS.REMOVE_CACHE_AND_STORAGE] ?? DEFAULT_SETTINGS.REMOVE_CACHE_AND_STORAGE;
            } catch (error) {
                Logger.error('設定読み込み処理エラー:', error);
                displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('options_unexpectedError'));
            }
        });
    } catch (error) {
        Logger.error('DOMContentLoadedエラー:', error);
        displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('options_initFailed'));
    }
});

/**
 * 保存ボタンのクリックイベントハンドラー
 * @description 許可リストと設定をバリデーションしてストレージに保存
 */
document.getElementById('save').addEventListener('click', () => {
    try {
        const saveButton = document.getElementById('save');
        // 連打防止：ボタンを無効化
        saveButton.disabled = true;

        const textarea = document.getElementById('allowlist');
        const lines = textarea.value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const allowlist = [];
        const invalidLines = [];

        // 各行をパース: [ドメイン,keepCookies,keepCache]形式または[ドメイン]形式
        lines.forEach((line, index) => {
            const result = parseAllowlistLine(line, index);
            if (result.success) {
                allowlist.push(result.entry);
            } else {
                invalidLines.push(result.error);
            }
        });

    // バリデーションエラーがあれば警告表示して保存を中止
    if (invalidLines.length > 0) {
        Logger.warn('許可リストのバリデーションエラー:', invalidLines);
        showErrorList(invalidLines);

        displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('options_validationErrorCount', [String(invalidLines.length)]));
        saveButton.disabled = false;
        return;
    }

    // ドメインの重複チェック
    const domainMap = new Map();
    const duplicates = [];
    allowlist.forEach((entry, index) => {
        const domain = entry[ALLOWLIST_KEYS.DOMAIN];
        if (domainMap.has(domain)) {
            duplicates.push(chrome.i18n.getMessage('options_duplicateLine', [
                String(index + 1),
                domain,
                String(domainMap.get(domain) + 1)
            ]));
        } else {
            domainMap.set(domain, index);
        }
    });

    if (duplicates.length > 0) {
        Logger.warn('ドメインの重複エラー:', duplicates);
        showErrorList(duplicates);

        displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('options_domainDuplicate'));
        saveButton.disabled = false;
        return;
    }

    const runOnStartup = document.getElementById('runOnStartup').checked;
    const runOnClose = document.getElementById('runOnClose').checked;
    const removeDownloads = document.getElementById('removeDownloads').checked;
    const removeFormData = document.getElementById('removeFormData').checked;
    const removeHistory = document.getElementById('removeHistory').checked;
    const removeCookies = document.getElementById('removeCookies').checked;
    const removeCacheAndStorage = document.getElementById('removeCacheAndStorage').checked;

    chrome.storage.local.set({
        [STORAGE_KEYS.ALLOWLIST]: allowlist,
        [STORAGE_KEYS.RUN_ON_STARTUP]: runOnStartup,
        [STORAGE_KEYS.RUN_ON_CLOSE]: runOnClose,
        [STORAGE_KEYS.REMOVE_DOWNLOADS]: removeDownloads,
        [STORAGE_KEYS.REMOVE_FORMDATA]: removeFormData,
        [STORAGE_KEYS.REMOVE_HISTORY]: removeHistory,
        [STORAGE_KEYS.REMOVE_COOKIES]: removeCookies,
        [STORAGE_KEYS.REMOVE_CACHE_AND_STORAGE]: removeCacheAndStorage
    }, () => {
            try {
                if (chrome.runtime.lastError) {
                    Logger.error('設定保存エラー:', chrome.runtime.lastError);
                    displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('options_saveFailed'));
                    saveButton.disabled = false;
                    return;
                }

                const status = document.getElementById('status');
                status.textContent = chrome.i18n.getMessage('options_saveSuccess');
                status.className = 'status success';
                status.style.display = '';  // インラインスタイルをクリア
                status.style.backgroundColor = '';
                status.style.color = '';
                setTimeout(() => {
                    status.className = 'status';
                    saveButton.disabled = false;
                }, 3000);
            } catch (error) {
                Logger.error('設定保存後処理エラー:', error);
                displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('options_unexpectedError'));
                saveButton.disabled = false;
            }
        });
    } catch (error) {
        Logger.error('保存処理エラー:', error);
        displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('options_unexpectedError'));
        const saveButton = document.getElementById('save');
        if (saveButton) saveButton.disabled = false;
    }
});

/**
 * ツールチップの表示/非表示を切り替える
 * @param {Event} e - クリックイベント
 */
document.getElementById('helpIcon').addEventListener('click', (e) => {
    try {
        e.stopPropagation();
        const tooltip = document.getElementById('tooltipContent');
        tooltip.classList.toggle('show');
    } catch (error) {
        Logger.error('ツールチップ表示エラー:', error);
    }
});

document.getElementById('closeTooltip').addEventListener('click', (e) => {
    try {
        e.stopPropagation();
        const tooltip = document.getElementById('tooltipContent');
        tooltip.classList.remove('show');
    } catch (error) {
        Logger.error('ツールチップ閉じるエラー:', error);
    }
});

// 終了時オプションのツールチップ
document.getElementById('helpIconClose').addEventListener('click', (e) => {
    try {
        e.stopPropagation();
        const tooltip = document.getElementById('tooltipContentClose');
        tooltip.classList.toggle('show');
    } catch (error) {
        Logger.error('ツールチップ表示エラー:', error);
    }
});

document.getElementById('closeTooltipClose').addEventListener('click', (e) => {
    try {
        e.stopPropagation();
        const tooltip = document.getElementById('tooltipContentClose');
        tooltip.classList.remove('show');
    } catch (error) {
        Logger.error('ツールチップ閉じるエラー:', error);
    }
});

// ツールチップ外をクリックしたら閉じる
document.addEventListener('click', (e) => {
    try {
        const tooltip = document.getElementById('tooltipContent');
        const tooltipClose = document.getElementById('tooltipContentClose');
        const helpIcon = document.getElementById('helpIcon');
        const helpIconClose = document.getElementById('helpIconClose');
        
        if (!tooltip.contains(e.target) && e.target !== helpIcon) {
            tooltip.classList.remove('show');
        }
        
        if (!tooltipClose.contains(e.target) && e.target !== helpIconClose) {
            tooltipClose.classList.remove('show');
        }
    } catch (error) {
        Logger.error('ツールチップ外クリック処理エラー:', error);
    }
});

/**
 * エラーリストを閉じる
 */
document.getElementById('closeErrorList').addEventListener('click', () => {
    try {
        const errorList = document.getElementById('errorList');
        errorList.style.display = 'none';
    } catch (error) {
        Logger.error('エラーリスト閉じる処理エラー:', error);
    }
});