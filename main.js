/**
 * @file ブラウジングデータ削除拡張機能のメインスクリプト
 * @description 各コンポーネントを初期化し、アプリケーションを起動
 */

console.log(`[${chrome.runtime.getManifest().name}] [Main] スクリプト読み込み開始`);

import { Logger } from './logger.js';

import { SettingsManager } from './settingsManager.js';
Logger.debug('[Main] SettingsManager インポート完了');

import { DataCleaner } from './dataCleaner.js';
Logger.debug('[Main] DataCleaner インポート完了');

import { EventHandler } from './eventHandler.js';
Logger.debug('[Main] EventHandler インポート完了');

/**
 * アプリケーションの初期化
 */
async function initializeApp() {
    Logger.info('='.repeat(50));
    Logger.info('ブラウジングデータ削除拡張機能を起動中...');
    Logger.info('='.repeat(50));
    
    try {
        // コンポーネントの作成
        Logger.debug('[Main] コンポーネントを作成中...');
        const settingsManager = new SettingsManager();
        const dataCleaner = new DataCleaner(settingsManager);
        const eventHandler = new EventHandler(settingsManager, dataCleaner);
        Logger.debug('[Main] コンポーネント作成完了');
        
        // 初期設定の読み込み
        Logger.debug('[Main] 設定を読み込み中...');
        await settingsManager.load();
        settingsManager.logSettings();
        Logger.debug('[Main] 設定読み込み完了');
        
        // イベントリスナーの登録
        Logger.debug('[Main] イベントリスナー登録中...');
        eventHandler.registerAll();
        Logger.debug('[Main] イベントリスナー登録完了');
        
        Logger.info('='.repeat(50));
        Logger.info('アプリケーションの初期化が完了しました');
        Logger.info('='.repeat(50));
        
        // 初期化完了後、起動時処理を実行
        Logger.debug('[Main] 起動時処理を確認中...');
        await eventHandler.handleStartupIfNeeded();
        Logger.debug('[Main] 起動時処理の確認完了');
    } catch (error) {
        Logger.error('='.repeat(50));
        Logger.error('[Main] アプリケーションの初期化に失敗:', error);
        Logger.error('[Main] エラースタック:', error.stack);
        Logger.error('='.repeat(50));
        
        // 初期化失敗時の通知（オプション）
        if (chrome.notifications) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'img/icon48.png',
                title: '拡張機能エラー',
                message: 'ブラウジングデータ削除拡張機能の初期化に失敗しました'
            });
        }
    }
}

Logger.debug('[Main] initializeApp を実行します');
initializeApp();

