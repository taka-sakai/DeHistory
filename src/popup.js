/**
 * @file ポップアップUIのスクリプト
 * @description ブラウジングデータ削除の実行とホワイトリスト管理のUIロジック
 */

import { Logger } from './logger.js';
import {
    DEFAULT_SETTINGS,
    STORAGE_KEYS,
    WHITELIST_KEYS
} from './constants.js';

import {
    displayStatusMessage,
    clearStatusMessage
} from './utils.js';

import { applyI18n } from './i18n.js';

applyI18n();

/**
 * 現在アクティブなタブのドメイン名
 * @type {string}
 */
let currentDomain = '';

/**
 * 設定ボタンのクリックイベントハンドラー
 * @description オプションページを開く
 */
document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});

/**
 * ホワイトリストボタンの表示を更新
 * @returns {void}
 * @description 現在のドメインがホワイトリストに含まれているかチェックし、
 * ボタンのテキストとスタイルを更新する
 */
function updateWhitelistButton() {
    try {
        if (!currentDomain) return;
        
        chrome.storage.local.get([STORAGE_KEYS.WHITELIST], (result) => {
            try {
                if (chrome.runtime.lastError) {
                    Logger.error('ホワイトリスト取得エラー:', chrome.runtime.lastError.message);
                    return;
                }
                
                const whitelist = result[STORAGE_KEYS.WHITELIST] || [];
                const exists = whitelist.some(entry => {
                    const domain = entry[WHITELIST_KEYS.DOMAIN];
                    return domain === currentDomain;
                });
                
                const btn = document.getElementById('addToWhitelistBtn');
                btn.textContent = chrome.i18n.getMessage(
                    exists ? 'popup_removeFromWhitelistBtn' : 'popup_addToWhitelistBtn'
                );

                // ボタンの色を変更
                if (exists) {
                    btn.classList.remove('secondary');
                    btn.classList.add('remove');
                } else {
                    btn.classList.remove('remove');
                    btn.classList.add('secondary');
                }

                // currentSiteの表示を更新
                const currentSiteDiv = document.getElementById('currentSite');
                if (exists) {
                    currentSiteDiv.innerHTML = chrome.i18n.getMessage('popup_currentSiteRegistered', [currentDomain]);
                } else {
                    currentSiteDiv.textContent = chrome.i18n.getMessage('popup_currentSite', [currentDomain]);
                }
            } catch (error) {
                Logger.error('ホワイトリストボタン更新処理エラー:', error);
            }
        });
    } catch (error) {
        Logger.error('ホワイトリストボタン更新エラー:', error);
    }
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    try {
        if (chrome.runtime.lastError) {
            Logger.error('タブ情報取得エラー:', chrome.runtime.lastError.message);
            document.getElementById('currentSite').textContent = chrome.i18n.getMessage('popup_cannotGetTabInfo');
            document.getElementById('addToWhitelistBtn').disabled = true;
            return;
        }

        if (tabs[0] && tabs[0].url) {
            try {
                const url = new URL(tabs[0].url);
                if (url.protocol !== 'https:' && url.protocol !== 'http:') {
                    document.getElementById('currentSite').textContent = chrome.i18n.getMessage('popup_cannotAddSite');
                    document.getElementById('addToWhitelistBtn').disabled = true;
                    return;
                }
                currentDomain = url.hostname;
                document.getElementById('currentSite').textContent = chrome.i18n.getMessage('popup_currentSite', [currentDomain]);
                updateWhitelistButton();
            } catch (e) {
                Logger.error('URL解析エラー:', e);
                document.getElementById('currentSite').textContent = chrome.i18n.getMessage('popup_cannotGetCurrentSite');
                document.getElementById('addToWhitelistBtn').disabled = true;
            }
        }
    } catch (error) {
        Logger.error('タブ情報処理エラー:', error);
        document.getElementById('currentSite').textContent = chrome.i18n.getMessage('popup_errorOccurred');
        document.getElementById('addToWhitelistBtn').disabled = true;
    }
});

/**
 * データ削除実行ボタンのクリックイベントハンドラー
 * @description バックグラウンドスクリプトにメッセージを送信してブラウジングデータを削除
 */
document.getElementById('executeBtn').addEventListener('click', () => {
    try {
        const btn = document.getElementById('executeBtn');
        // 連打防止：ボタンを無効化
        btn.disabled = true;

        // バックグラウンドスクリプトにメッセージを送信してdeleteData()を実行
        chrome.runtime.sendMessage({ action: 'deleteData' }, (response) => {
            try {
                if (chrome.runtime.lastError) {
                    Logger.error('メッセージ送信エラー:', chrome.runtime.lastError.message);
                    displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_sendMessageError', [chrome.runtime.lastError.message]));
                    btn.disabled = false;
                    return;
                }

                if (response && !response.success) {
                    Logger.error('データ削除エラー:', response.error);
                    displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_deleteFailed'));
                    btn.disabled = false;
                    return;
                }

                const status = document.getElementById('status');
                status.textContent = chrome.i18n.getMessage('popup_deleteSuccess');
                status.className = 'success';

                setTimeout(() => {
                    window.close();
                }, 1500);
            } catch (error) {
                Logger.error('データ削除レスポンス処理エラー:', error);
                displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_unexpectedError'));
                btn.disabled = false;
            }
        });
    } catch (error) {
        Logger.error('データ削除実行エラー:', error);
        displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_unexpectedError'));
        const btn = document.getElementById('executeBtn');
        if (btn) btn.disabled = false;
    }
});

/**
 * ホワイトリストを保存して成功メッセージを表示
 * @param {Array<{domain: string, keepCookies: boolean, keepCache: boolean}>} whitelist - 保存するホワイトリスト
 * @param {string} message - 表示するメッセージ
 * @returns {void}
 */
function saveWhitelistWithMessage(whitelist, message) {
    try {
        chrome.storage.local.set({ [STORAGE_KEYS.WHITELIST]: whitelist }, () => {
            try {
                if (chrome.runtime.lastError) {
                    Logger.error('ホワイトリスト保存エラー:', chrome.runtime.lastError.message);
                    displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_saveFailed'));
                    return;
                }

                const status = document.getElementById('status');
                status.textContent = message;
                status.className = 'success';
                setTimeout(() => {
                    window.close();
                }, 1500);
            } catch (error) {
                Logger.error('保存後処理エラー:', error);
                displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_unexpectedError'));
            }
        });
    } catch (error) {
        Logger.error('ホワイトリスト保存処理エラー:', error);
        displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_unexpectedError'));
    }
}

/**
 * ホワイトリスト追加/除外ボタンのクリックイベントハンドラー
 * @description 現在のドメインをホワイトリストに追加、またはホワイトリストから除外
 */
document.getElementById('addToWhitelistBtn').addEventListener('click', () => {
    try {
        if (!currentDomain) {
            return;
        }

        const btn = document.getElementById('addToWhitelistBtn');
        // 連打防止：ボタンを無効化
        btn.disabled = true;

        chrome.storage.local.get([STORAGE_KEYS.WHITELIST], (result) => {
            try {
                if (chrome.runtime.lastError) {
                    Logger.error('ホワイトリスト取得エラー:', chrome.runtime.lastError.message);
                    displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_whitelistLoadFailed'));
                    btn.disabled = false;
                    return;
                }

                let whitelist = result[STORAGE_KEYS.WHITELIST] || [];

                // すでに存在するかチェック
                const existingIndex = whitelist.findIndex(entry => {
                    const domain = entry[WHITELIST_KEYS.DOMAIN];
                    return domain === currentDomain;
                });

                if (existingIndex !== -1) {
                    // ホワイトリストから除外
                    whitelist.splice(existingIndex, 1);
                    saveWhitelistWithMessage(
                        whitelist,
                        chrome.i18n.getMessage('popup_removedFromWhitelist', [currentDomain])
                    );
                } else {
                    // 新しいエントリを追加（デフォルトですべて保持）
                    whitelist.push({
                        [WHITELIST_KEYS.DOMAIN]: currentDomain,
                        [WHITELIST_KEYS.KEEP_COOKIES]: DEFAULT_SETTINGS.WHITELIST_KEEP_COOKIES,
                        [WHITELIST_KEYS.KEEP_CACHE]: DEFAULT_SETTINGS.WHITELIST_KEEP_CACHE
                    });
                    saveWhitelistWithMessage(
                        whitelist,
                        chrome.i18n.getMessage('popup_addedToWhitelist', [currentDomain])
                    );
                }
            } catch (error) {
                Logger.error('ホワイトリスト処理エラー:', error);
                displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_unexpectedError'));
                btn.disabled = false;
            }
        });
    } catch (error) {
        Logger.error('ホワイトリスト追加/除外エラー:', error);
        displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_unexpectedError'));
        const btn = document.getElementById('addToWhitelistBtn');
        if (btn) btn.disabled = false;
    }
});
