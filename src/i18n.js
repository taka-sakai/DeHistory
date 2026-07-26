/**
 * @file 多言語対応ユーティリティ
 * @description data-i18n系属性が付与された要素に chrome.i18n の翻訳文字列を適用する
 */

import { Logger } from './logger.js';

/**
 * 翻訳文字列を取得
 * @param {string} key - messages.json のキー名
 * @returns {string} 翻訳文字列（見つからない場合は空文字）
 * @description HTMLにはフォールバックの文言を持たせていないため、キーを引けないと
 * その要素は空欄のまま表示される。原因を追えるよう警告を残す。
 */
function getMessage(key) {
    const message = chrome.i18n.getMessage(key);
    if (!message) {
        Logger.warn('翻訳が見つかりません:', key);
    }
    return message;
}

/**
 * data-i18n / data-i18n-title / data-i18n-placeholder 属性を持つ要素に翻訳文字列を適用
 * @param {ParentNode} [root=document] - 適用対象のルート要素
 * @returns {void}
 */
function applyI18n(root = document) {
    // スクリーンリーダーに表示中の言語を伝えるため、実際のUI言語を lang に反映する
    if (root.documentElement) {
        root.documentElement.lang = chrome.i18n.getUILanguage();
    }

    root.querySelectorAll('[data-i18n]').forEach((el) => {
        const message = getMessage(el.getAttribute('data-i18n'));
        if (message) {
            el.textContent = message;
        }
    });

    root.querySelectorAll('[data-i18n-title]').forEach((el) => {
        const message = getMessage(el.getAttribute('data-i18n-title'));
        if (message) {
            el.title = message;
        }
    });

    root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const message = getMessage(el.getAttribute('data-i18n-placeholder'));
        if (message) {
            el.placeholder = message;
        }
    });
}

export { applyI18n };
