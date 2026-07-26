/**
 * @file ストア掲載用スクリーンショットの撮影スクリプト
 * @description src/_locales/ にある言語ぶんだけ、screen1（ポップアップ）と
 * screen2（オプション画面）を 1280x800 で撮影し screenshots/<言語>/ に出力する。
 *
 *   node take-screenshots.js            全言語
 *   node take-screenshots.js ja         日本語のみ
 *   node take-screenshots.js fr:fr-FR   _locales/fr を Chrome の fr-FR で撮る
 *
 * 詳しい前提と各定数の根拠は同じディレクトリの README.md を参照。
 */

const puppeteer = require('puppeteer-core');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '..', '..');
const SRC = path.join(ROOT, 'src');
const OUT_ROOT = path.join(ROOT, 'screenshots');
const PS1 = path.join(HERE, 'capture.ps1');

const WIDTH = 1280;
const HEIGHT = 800;

// ポップアップはブラウザUIなのでページの拡大では大きくならず、表示倍率でしか変えられない。
// オプション画面は同じ倍率だと高さ200pxのホワイトリスト入力欄が画面外に出るため下げる。
const SCALE_POPUP = Number(process.env.SCALE_POPUP || 1.75);
const SCALE_OPTIONS = Number(process.env.SCALE_OPTIONS || 1.45);

// ポップアップの背景に出すページ。情報量が多いと拡張機能のUIが埋もれる。
// ホワイトリストの記入例（example.com / example.net）と別のドメインにしないと、
// ポップアップが「ホワイトリストから除外する」状態になってしまう。
const BACKDROP = process.env.BACKDROP || 'https://example.org/';

const WHITELIST_SEED = 'example.com,1,1\nexample.net';

const sleep = ms => new Promise(r => setTimeout(r, ms));

function findChrome() {
    if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
    const base = path.join(HERE, 'chrome');
    if (fs.existsSync(base)) {
        for (const dir of fs.readdirSync(base)) {
            const exe = path.join(base, dir, 'chrome-win64', 'chrome.exe');
            if (fs.existsSync(exe)) return exe;
        }
    }
    throw new Error(
        'Chrome for Testing が見つかりません。次を実行してください:\n' +
        '  npx @puppeteer/browsers install chrome@stable\n' +
        'または CHROME_PATH 環境変数で実行ファイルを指定してください。\n' +
        '（通常のChromeは 137 以降 --load-extension を受け付けないため使えません）');
}

const CHROME = findChrome();

const ps = (...args) => execFileSync('powershell.exe',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', PS1, ...args], { encoding: 'utf8' }).trim();

function launch(profile, lang, scale) {
    return puppeteer.launch({
        executablePath: CHROME,
        headless: false,
        userDataDir: profile,
        // 既定のままだと全タブが 800x600 に固定され、ウィンドウ内に余白ができる
        defaultViewport: null,
        ignoreDefaultArgs: ['--disable-extensions', '--disable-component-extensions-with-background-pages'],
        args: [
            `--disable-extensions-except=${SRC}`, `--load-extension=${SRC}`,
            `--lang=${lang}`, `--force-device-scale-factor=${scale}`,
            '--no-first-run', '--no-default-browser-check',
            '--window-position=0,0', `--window-size=${WIDTH},${HEIGHT}`,
            '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding',
        ],
    });
}

async function closeOthers(browser, keep) {
    for (const p of await browser.pages()) if (p !== keep) { try { await p.close(); } catch (e) { } }
}

async function getExtensionId(browser) {
    const p = await browser.newPage();
    await p.goto('chrome://extensions-internals/', { waitUntil: 'networkidle0' });
    const list = JSON.parse(await p.evaluate(() => document.body.innerText));
    await p.close();
    const hit = list.find(e => (e.path || '').toLowerCase() === SRC.toLowerCase());
    if (!hit) throw new Error('拡張機能が読み込まれていません');
    return hit.id;
}

/** プロファイルを作り、設定を投入し、ツールバーにアイコンをピン留めする */
async function prepareProfile(profile, lang) {
    fs.rmSync(profile, { recursive: true, force: true });
    const b = await launch(profile, lang, SCALE_POPUP);
    const id = await getExtensionId(b);

    const p = await b.newPage();
    await p.goto(`chrome-extension://${id}/options.html`, { waitUntil: 'networkidle0' });
    await p.evaluate(seed => { document.getElementById('whitelist').value = seed; }, WHITELIST_SEED);
    await p.click('#save');
    await sleep(700);
    await b.close();
    await sleep(800);

    // ピン留めしないとポップアップの表示位置が定まらない
    const prefPath = path.join(profile, 'Default', 'Preferences');
    const prefs = JSON.parse(fs.readFileSync(prefPath, 'utf8'));
    prefs.extensions = prefs.extensions || {};
    prefs.extensions.toolbar = [id];
    prefs.extensions.pinned_extensions = [id];
    fs.writeFileSync(prefPath, JSON.stringify(prefs));
    return id;
}

async function shootOptions(profile, lang, locale, id) {
    const b = await launch(profile, lang, SCALE_OPTIONS);
    const p = await b.newPage();
    await p.goto(`chrome-extension://${id}/options.html`, { waitUntil: 'networkidle0' });
    await closeOthers(b, p);
    await p.bringToFront();

    const m = await p.evaluate(() => {
        const d = document.documentElement;
        return {
            viewport: `${d.clientWidth}x${d.clientHeight}`,
            overflowX: d.scrollWidth - d.clientWidth,
            textareaBottom: Math.round(document.getElementById('whitelist').getBoundingClientRect().bottom),
            clientHeight: d.clientHeight,
        };
    });
    if (m.overflowX > 0) console.warn(`  ! 横スクロールバーが出ています (${m.overflowX}px)。SCALE_OPTIONS を下げてください`);
    if (m.textareaBottom > m.clientHeight) console.warn('  ! ホワイトリスト入力欄が画面外です。SCALE_OPTIONS を下げてください');
    console.log(`  options viewport=${m.viewport} overflowX=${m.overflowX} whitelistVisible=${m.textareaBottom <= m.clientHeight}`);

    await sleep(800);
    console.log('  ' + ps('-ProcessId', String(b.process().pid),
        '-OutPath', path.join(OUT_ROOT, locale, 'screen2.png'), '-Width', String(WIDTH), '-Height', String(HEIGHT)));
    await b.close();
    await sleep(600);
}

async function shootPopup(profile, lang, locale, id) {
    const b = await launch(profile, lang, SCALE_POPUP);
    const site = await b.newPage();
    await site.goto(BACKDROP, { waitUntil: 'domcontentloaded' }).catch(e => console.warn(`  ! ${BACKDROP}: ${e.message}`));
    await closeOthers(b, site);
    await site.bringToFront();
    await sleep(1500);
    // リンク上にポインタが残っていると、左下にURLの吹き出しが写り込む
    await site.mouse.move(WIDTH - 80, HEIGHT - 100).catch(() => { });
    await sleep(300);

    let worker = null;
    for (let i = 0; i < 25 && !worker; i++) {
        const t = b.targets().find(x => x.type() === 'service_worker' && x.url().includes(id));
        if (t) { try { worker = await t.worker(); } catch (e) { } }
        if (!worker) await sleep(400);
    }
    if (!worker) throw new Error('service worker が見つかりません');
    const winId = await worker.evaluate(async () => (await chrome.windows.getLastFocused()).id);

    // 順序が重要。openPopup() は Chrome が「アクティブ」と見なすウィンドウしか受け付けず、
    // それを満たせるのは chrome.windows.update({focused:true}) だけ（OSレベルの
    // SetForegroundWindow では不十分）。ただしこの呼び出しは Chrome が保持している
    // ウィンドウサイズを復元してしまうため、そのあとに物理サイズを与え直す。
    // ポップアップを開いたあとに動かすと閉じてしまうので、必ず開く前に確定させる。
    let opened = false, geom = '', lastErr = '';
    for (let attempt = 0; attempt < 4 && !opened; attempt++) {
        await worker.evaluate(async wid => {
            await chrome.windows.update(wid, { state: 'normal', focused: true });
        }, winId).catch(e => { lastErr = e.message; });
        await sleep(500);

        geom = ps('-ProcessId', String(b.process().pid), '-PositionOnly',
            '-Width', String(WIDTH), '-Height', String(HEIGHT));
        await sleep(500);

        try {
            await worker.evaluate(async wid => { await chrome.action.openPopup({ windowId: wid }); }, winId);
            opened = true;
        } catch (e) { lastErr = e.message; }
    }
    if (!opened) console.warn(`  ! ポップアップを開けませんでした: ${lastErr}`);
    console.log(`  ${geom} popupOpened=${opened}`);

    await sleep(1500);
    console.log('  ' + ps('-ProcessId', String(b.process().pid),
        '-OutPath', path.join(OUT_ROOT, locale, 'screen1.png'),
        '-Width', String(WIDTH), '-Height', String(HEIGHT), '-NoActivate'));
    await b.close();
    await sleep(600);
}

function resolveTargets(argv) {
    const available = fs.readdirSync(path.join(SRC, '_locales'), { withFileTypes: true })
        .filter(d => d.isDirectory()).map(d => d.name);
    if (argv.length === 0) return available.map(l => ({ locale: l, lang: l }));
    return argv.map(a => {
        const [locale, lang] = a.split(':');
        if (!available.includes(locale)) {
            throw new Error(`src/_locales/${locale} がありません（利用可能: ${available.join(', ')}）`);
        }
        return { locale, lang: lang || locale };
    });
}

(async () => {
    if (process.platform !== 'win32') {
        throw new Error('画面キャプチャに PowerShell を使うため Windows 専用です');
    }
    const targets = resolveTargets(process.argv.slice(2));
    console.log(`Chrome: ${CHROME}`);
    console.log(`対象: ${targets.map(t => `${t.locale}(--lang=${t.lang})`).join(', ')}\n`);

    for (const { locale, lang } of targets) {
        console.log(`[${locale}]`);
        fs.mkdirSync(path.join(OUT_ROOT, locale), { recursive: true });
        const profile = path.join(os.tmpdir(), `dehistory-shots-${locale}`);
        try {
            const id = await prepareProfile(profile, lang);
            await shootOptions(profile, lang, locale, id);
            await shootPopup(profile, lang, locale, id);
        } finally {
            // 終了直後は Chrome がまだハンドルを握っていることがある。消せなくても撮影結果には影響しない
            try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); }
            catch (e) { console.warn(`  ! 一時プロファイルを削除できませんでした: ${profile}`); }
        }
    }
    console.log('\n完了:');
    for (const { locale } of targets) {
        for (const f of ['screen1.png', 'screen2.png']) {
            const p = path.join(OUT_ROOT, locale, f);
            if (!fs.existsSync(p)) { console.log(`  ${locale}/${f}  (未生成)`); continue; }
            const buf = fs.readFileSync(p);
            console.log(`  ${locale}/${f}  ${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}`);
        }
    }
})();
