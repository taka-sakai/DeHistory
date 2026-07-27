/**
 * @file ポップアップUIのスクリプト
 * @description ブラウジングデータ削除の実行と許可リスト管理のUIロジック
 */

import { Logger } from './logger.js';
import {
    DEFAULT_SETTINGS,
    STORAGE_KEYS,
    ALLOWLIST_KEYS
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
 * 許可リストボタンの表示を更新
 * @returns {void}
 * @description 現在のドメインが許可リストに含まれているかチェックし、
 * ボタンのテキストとスタイルを更新する
 */
function updateAllowlistButton() {
    try {
        if (!currentDomain) return;
        
        chrome.storage.local.get([STORAGE_KEYS.ALLOWLIST], (result) => {
            try {
                if (chrome.runtime.lastError) {
                    Logger.error('許可リスト取得エラー:', chrome.runtime.lastError.message);
                    return;
                }
                
                const allowlist = result[STORAGE_KEYS.ALLOWLIST] || [];
                const exists = allowlist.some(entry => {
                    const domain = entry[ALLOWLIST_KEYS.DOMAIN];
                    return domain === currentDomain;
                });
                
                const btn = document.getElementById('addToAllowlistBtn');
                btn.textContent = chrome.i18n.getMessage(
                    exists ? 'popup_removeFromAllowlistBtn' : 'popup_addToAllowlistBtn'
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
                Logger.error('許可リストボタン更新処理エラー:', error);
            }
        });
    } catch (error) {
        Logger.error('許可リストボタン更新エラー:', error);
    }
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    try {
        if (chrome.runtime.lastError) {
            Logger.error('タブ情報取得エラー:', chrome.runtime.lastError.message);
            document.getElementById('currentSite').textContent = chrome.i18n.getMessage('popup_cannotGetTabInfo');
            document.getElementById('addToAllowlistBtn').disabled = true;
            return;
        }

        if (tabs[0] && tabs[0].url) {
            try {
                const url = new URL(tabs[0].url);
                if (url.protocol !== 'https:' && url.protocol !== 'http:') {
                    document.getElementById('currentSite').textContent = chrome.i18n.getMessage('popup_cannotAddSite');
                    document.getElementById('addToAllowlistBtn').disabled = true;
                    return;
                }
                currentDomain = url.hostname;
                document.getElementById('currentSite').textContent = chrome.i18n.getMessage('popup_currentSite', [currentDomain]);
                updateAllowlistButton();
            } catch (e) {
                Logger.error('URL解析エラー:', e);
                document.getElementById('currentSite').textContent = chrome.i18n.getMessage('popup_cannotGetCurrentSite');
                document.getElementById('addToAllowlistBtn').disabled = true;
            }
        }
    } catch (error) {
        Logger.error('タブ情報処理エラー:', error);
        document.getElementById('currentSite').textContent = chrome.i18n.getMessage('popup_errorOccurred');
        document.getElementById('addToAllowlistBtn').disabled = true;
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
 * 許可リストを保存して成功メッセージを表示
 * @param {Array<{domain: string, keepCookies: boolean, keepCache: boolean}>} allowlist - 保存する許可リスト
 * @param {string} message - 表示するメッセージ
 * @returns {void}
 */
function saveAllowlistWithMessage(allowlist, message) {
    try {
        chrome.storage.local.set({ [STORAGE_KEYS.ALLOWLIST]: allowlist }, () => {
            try {
                if (chrome.runtime.lastError) {
                    Logger.error('許可リスト保存エラー:', chrome.runtime.lastError.message);
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
        Logger.error('許可リスト保存処理エラー:', error);
        displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_unexpectedError'));
    }
}

/**
 * 許可リスト追加/削除ボタンのクリックイベントハンドラー
 * @description 現在のドメインを許可リストに追加、または許可リストから外す
 */
document.getElementById('addToAllowlistBtn').addEventListener('click', () => {
    try {
        if (!currentDomain) {
            return;
        }

        const btn = document.getElementById('addToAllowlistBtn');
        // 連打防止：ボタンを無効化
        btn.disabled = true;

        chrome.storage.local.get([STORAGE_KEYS.ALLOWLIST], (result) => {
            try {
                if (chrome.runtime.lastError) {
                    Logger.error('許可リスト取得エラー:', chrome.runtime.lastError.message);
                    displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_allowlistLoadFailed'));
                    btn.disabled = false;
                    return;
                }

                let allowlist = result[STORAGE_KEYS.ALLOWLIST] || [];

                // すでに存在するかチェック
                const existingIndex = allowlist.findIndex(entry => {
                    const domain = entry[ALLOWLIST_KEYS.DOMAIN];
                    return domain === currentDomain;
                });

                if (existingIndex !== -1) {
                    // 許可リストから外す
                    allowlist.splice(existingIndex, 1);
                    saveAllowlistWithMessage(
                        allowlist,
                        chrome.i18n.getMessage('popup_removedFromAllowlist', [currentDomain])
                    );
                } else {
                    // 新しいエントリを追加（デフォルトですべて保持）
                    allowlist.push({
                        [ALLOWLIST_KEYS.DOMAIN]: currentDomain,
                        [ALLOWLIST_KEYS.KEEP_COOKIES]: DEFAULT_SETTINGS.ALLOWLIST_KEEP_COOKIES,
                        [ALLOWLIST_KEYS.KEEP_CACHE]: DEFAULT_SETTINGS.ALLOWLIST_KEEP_CACHE
                    });
                    saveAllowlistWithMessage(
                        allowlist,
                        chrome.i18n.getMessage('popup_addedToAllowlist', [currentDomain])
                    );
                }
            } catch (error) {
                Logger.error('許可リスト処理エラー:', error);
                displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_unexpectedError'));
                btn.disabled = false;
            }
        });
    } catch (error) {
        Logger.error('許可リスト追加/削除エラー:', error);
        displayStatusMessage(document.getElementById('status'), chrome.i18n.getMessage('popup_unexpectedError'));
        const btn = document.getElementById('addToAllowlistBtn');
        if (btn) btn.disabled = false;
    }
});
