# Chrome Web Store 掲載文（全ロケール）

ブラウザデータの項目名は `src/_locales/*/messages.json` の
`options_removeHistory` / `options_removeCookies` / `options_removeCacheAndStorage` /
`options_removeFormData` / `options_removeDownloads` と一致させている（＝Chrome の訳語）。
「Allowlist」も同ファイルの `options_allowlistLabel` の訳語に統一している（＝拡張機能 UI の表記）。

製品名「DeHistory」は冗長を避けるため 3 箇所のみに置く。
冒頭の 1 文（ストア検索対策）、プライバシーの冒頭（最も重要な訴求）、
オープンソースの検証の文（第三者視点の文で主語が必要）。
それ以外は主語を落とすか受動態・無人称構文で言い換えている。

見出しは大文字・小文字の区別がある言語では全大文字にする。
ja / ko / zh_CN / zh_TW は字種に大文字がないためそのまま。

---

## en (English)

```
DeHistory removes your browsing data from the browser.

## WHAT IT DELETES
- Browsing history
- Cookies
- Cached images and files
- Autofill form data
- Download history

## FEATURES
Automatic deletion: Can be set to run when the browser starts or closes.
Allowlist: Data for the sites you specify is kept.
Note: The allowlist applies to cookies and cached files only.

## PRIVACY
DeHistory is designed for one purpose only: to delete your browsing data safely.
It never collects unnecessary data or sends anything to external servers.

## OPEN SOURCE
The source code is published on GitHub.
Anyone can verify that DeHistory is safe.
https://github.com/s-k-i/dehistory
```

---

## ja (日本語)

```
DeHistoryはブラウザからユーザーの閲覧データを削除します。

## 削除するデータ
- 閲覧履歴
- Cookie
- キャッシュされた画像とファイル
- 自動入力フォームのデータ
- ダウンロード履歴

## 機能
自動削除: ブラウザの起動時や終了時に自動実行ができます。
許可リスト: 指定したサイトのデータは保持されます。
注: 許可リストはCookieとキャッシュされたファイルにのみ適用されます。

## プライバシー
DeHistoryは閲覧データを安全に削除するためだけに設計されています。
不要なデータは一切収集せず、外部サーバーへの送信も行いません。

## オープンソース
ソースコードはGitHubで公開されています。
DeHistoryの安全性はどなたでもご検証いただけます。
https://github.com/s-k-i/dehistory
```

---

## de (Deutsch)

```
DeHistory entfernt Ihre Browserdaten.

## WAS GELÖSCHT WIRD
- Browserverlauf
- Cookies
- Im Cache gespeicherte Bilder und Dateien
- Autofill-Formulardaten
- Downloadverlauf

## FUNKTIONEN
Automatisches Löschen: Lässt sich beim Start und beim Schließen des Browsers aktivieren.
Zulassungsliste: Die Daten der von Ihnen angegebenen Websites bleiben erhalten.
Hinweis: Die Zulassungsliste gilt nur für Cookies und im Cache gespeicherte Dateien.

## DATENSCHUTZ
DeHistory wurde für einen einzigen Zweck entwickelt: Ihre Browserdaten sicher zu löschen.
Es werden keine unnötigen Daten erfasst und keine Daten an externe Server gesendet.

## OPEN SOURCE
Der Quellcode ist auf GitHub veröffentlicht.
Jeder kann sich davon überzeugen, dass DeHistory sicher ist.
https://github.com/s-k-i/dehistory
```

---

## fr (Français)

```
DeHistory supprime vos données de navigation.

## CE QUI EST SUPPRIMÉ
- Historique de navigation
- Cookies
- Images et fichiers en cache
- Données de saisie automatique des formulaires
- Historique des téléchargements

## FONCTIONNALITÉS
Suppression automatique : peut être activée au démarrage et à la fermeture du navigateur.
Liste d'autorisation : les données des sites que vous indiquez sont conservées.
Remarque : la liste d'autorisation s'applique uniquement aux cookies et aux fichiers en cache.

## CONFIDENTIALITÉ
DeHistory est conçu dans un seul but : supprimer vos données de navigation en toute sécurité.
Aucune donnée inutile n'est collectée et rien n'est envoyé vers des serveurs externes.

## OPEN SOURCE
Le code source est publié sur GitHub.
Chacun peut vérifier que DeHistory est sûr.
https://github.com/s-k-i/dehistory
```

---

## es (Español)

```
DeHistory elimina tus datos de navegación.

## QUÉ ELIMINA
- Historial de navegación
- Cookies
- Imágenes y archivos almacenados en caché
- Datos de autocompletado de formularios
- Historial de descargas

## FUNCIONES
Eliminación automática: se puede activar al iniciar el navegador y al cerrarlo.
Lista de permitidos: los datos de los sitios que especifiques se conservan.
Nota: la lista de permitidos se aplica únicamente a las cookies y a los archivos almacenados en caché.

## PRIVACIDAD
DeHistory está diseñado con un único propósito: eliminar tus datos de navegación de forma segura.
No recopila datos innecesarios ni envía nada a servidores externos.

## CÓDIGO ABIERTO
El código fuente está publicado en GitHub.
Cualquiera puede comprobar que DeHistory es seguro.
https://github.com/s-k-i/dehistory
```

---

## it (Italiano)

```
DeHistory rimuove i tuoi dati di navigazione dal browser.

## COSA ELIMINA
- Cronologia di navigazione
- Cookie
- Immagini e file memorizzati nella cache
- Dati di compilazione automatica dei moduli
- Cronologia dei download

## FUNZIONALITÀ
Eliminazione automatica: può essere attivata all'avvio e alla chiusura del browser.
Siti consentiti: i dati dei siti che indichi vengono conservati.
Nota: l'elenco dei siti consentiti si applica solo ai cookie e ai file memorizzati nella cache.

## PRIVACY
DeHistory è progettato per un unico scopo: eliminare in sicurezza i tuoi dati di navigazione.
Non raccoglie dati non necessari né invia nulla a server esterni.

## OPEN SOURCE
Il codice sorgente è pubblicato su GitHub.
Chiunque può verificare che DeHistory è sicuro.
https://github.com/s-k-i/dehistory
```

---

## pt_BR (Português do Brasil)

```
O DeHistory remove seus dados de navegação.

## O QUE É EXCLUÍDO
- Histórico de navegação
- Cookies
- Imagens e arquivos armazenados em cache
- Dados de preenchimento automático de formulários
- Histórico de downloads

## RECURSOS
Exclusão automática: pode ser ativada na inicialização e no fechamento do navegador.
Lista de permissões: os dados dos sites que você especificar são mantidos.
Observação: a lista de permissões se aplica apenas a cookies e arquivos armazenados em cache.

## PRIVACIDADE
O DeHistory foi criado com um único objetivo: excluir seus dados de navegação com segurança.
Não coleta dados desnecessários nem envia nada para servidores externos.

## CÓDIGO ABERTO
O código-fonte está publicado no GitHub.
Qualquer pessoa pode verificar que o DeHistory é seguro.
https://github.com/s-k-i/dehistory
```

---

## nl (Nederlands)

```
DeHistory verwijdert je browsegegevens.

## WAT WORDT VERWIJDERD
- Browsegeschiedenis
- Cookies
- Afbeeldingen en bestanden in cache
- Gegevens voor automatisch invullen van formulieren
- Downloadgeschiedenis

## FUNCTIES
Automatisch verwijderen: kan worden ingeschakeld bij het starten en afsluiten van de browser.
Toegestane sites: de gegevens van de sites die je opgeeft blijven behouden.
Let op: de lijst met toegestane sites geldt alleen voor cookies en bestanden in cache.

## PRIVACY
DeHistory is ontworpen met maar één doel: je browsegegevens veilig verwijderen.
Er worden geen onnodige gegevens verzameld en niets wordt naar externe servers gestuurd.

## OPENSOURCE
De broncode is gepubliceerd op GitHub.
Iedereen kan vaststellen dat DeHistory veilig is.
https://github.com/s-k-i/dehistory
```

---

## pl (Polski)

```
DeHistory usuwa Twoje dane przeglądania z przeglądarki.

## CO USUWA
- Historia przeglądania
- Pliki cookie
- Obrazy i pliki w pamięci podręcznej
- Dane autouzupełniania formularzy
- Historia pobierania

## FUNKCJE
Automatyczne usuwanie: można je włączyć przy starcie i przy zamknięciu przeglądarki.
Lista dozwolonych: dane wskazanych przez Ciebie witryn są zachowywane.
Uwaga: lista dozwolonych dotyczy wyłącznie plików cookie i plików w pamięci podręcznej.

## PRYWATNOŚĆ
DeHistory powstał wyłącznie w jednym celu: aby bezpiecznie usuwać Twoje dane przeglądania.
Nie zbiera niepotrzebnych danych ani nie wysyła niczego na zewnętrzne serwery.

## OTWARTE ŹRÓDŁO
Kod źródłowy jest opublikowany w serwisie GitHub.
Każdy może przekonać się, że DeHistory jest bezpieczny.
https://github.com/s-k-i/dehistory
```

---

## cs (Čeština)

```
DeHistory odstraňuje vaše data prohlížení z prohlížeče.

## CO MAŽE
- Historie prohlížení
- Soubory cookie
- Obrázky a soubory v mezipaměti
- Data automatického vyplňování formulářů
- Historie stahování

## FUNKCE
Automatické mazání: lze zapnout při startu i při zavření prohlížeče.
Seznam povolených: data webů, které určíte, zůstanou zachována.
Poznámka: Seznam povolených se vztahuje pouze na soubory cookie a soubory v mezipaměti.

## SOUKROMÍ
DeHistory byl vytvořen s jediným cílem: bezpečně mazat vaše data prohlížení.
Neshromažďuje zbytečná data ani nic neodesílá na externí servery.

## OTEVŘENÝ ZDROJOVÝ KÓD
Zdrojový kód je zveřejněn na GitHubu.
Kdokoli se může přesvědčit, že je DeHistory bezpečný.
https://github.com/s-k-i/dehistory
```

---

## hu (Magyar)

```
A DeHistory eltávolítja az Ön böngészési adatait a böngészőből.

## MIT TÖRÖL
- Böngészési előzmények
- Sütik
- Gyorsítótárazott képek és fájlok
- Űrlapok automatikus kitöltési adatai
- Letöltési előzmények

## FUNKCIÓK
Automatikus törlés: bekapcsolható a böngésző indításakor és bezárásakor.
Engedélyezési lista: a megadott webhelyek adatai megmaradnak.
Megjegyzés: az engedélyezési lista csak a sütikre és a gyorsítótárazott fájlokra vonatkozik.

## ADATVÉDELEM
A DeHistory egyetlen célra készült: hogy biztonságosan törölje a böngészési adatait.
Nem gyűjt felesleges adatokat, és semmit nem küld külső szerverekre.

## NYÍLT FORRÁSKÓD
A forráskód a GitHubon nyilvánosan elérhető.
Bárki meggyőződhet arról, hogy a DeHistory biztonságos.
https://github.com/s-k-i/dehistory
```

---

## ru (Русский)

```
DeHistory удаляет ваши данные о работе в браузере.

## ЧТО УДАЛЯЕТСЯ
- История просмотров
- Файлы cookie
- Изображения и файлы в кеше
- Данные автозаполнения форм
- История скачиваний

## ВОЗМОЖНОСТИ
Автоматическое удаление: можно включить при запуске и при закрытии браузера.
Список разрешённых: данные указанных вами сайтов сохраняются.
Примечание: список разрешённых применяется только к файлам cookie и файлам в кеше.

## КОНФИДЕНЦИАЛЬНОСТЬ
DeHistory создан с единственной целью — безопасно удалять ваши данные о работе в браузере.
Не собирает лишние данные и ничего не отправляет на внешние серверы.

## ОТКРЫТЫЙ ИСХОДНЫЙ КОД
Исходный код опубликован на GitHub.
Любой может убедиться, что DeHistory безопасен.
https://github.com/s-k-i/dehistory
```

---

## uk (Українська)

```
DeHistory видаляє ваші дані перегляду з браузера.

## ЩО ВИДАЛЯЄТЬСЯ
- Історія перегляду
- Файли cookie
- Зображення та файли в кеші
- Дані автозаповнення форм
- Історія завантажень

## МОЖЛИВОСТІ
Автоматичне видалення: можна ввімкнути під час запуску та закриття браузера.
Список дозволених: дані вказаних вами сайтів зберігаються.
Примітка: список дозволених застосовується лише до файлів cookie та файлів у кеші.

## КОНФІДЕНЦІЙНІСТЬ
DeHistory створено з єдиною метою — безпечно видаляти ваші дані перегляду.
Не збирає зайвих даних і нічого не надсилає на зовнішні сервери.

## ВІДКРИТИЙ КОД
Вихідний код опубліковано на GitHub.
Будь-хто може переконатися, що DeHistory безпечний.
https://github.com/s-k-i/dehistory
```

---

## tr (Türkçe)

```
DeHistory, tarama verilerinizi tarayıcıdan siler.

## NELER SİLİNİR
- Tarama geçmişi
- Çerezler
- Önbelleğe alınmış resimler ve dosyalar
- Otomatik doldurulan form verileri
- İndirme geçmişi

## ÖZELLİKLER
Otomatik silme: Tarayıcı açılışında ve kapanışında çalışacak şekilde ayarlanabilir.
İzin listesi: Belirttiğiniz sitelerin verileri korunur.
Not: İzin listesi yalnızca çerezler ve önbelleğe alınmış dosyalar için geçerlidir.

## GİZLİLİK
DeHistory yalnızca tek bir amaç için tasarlandı: tarama verilerinizi güvenle silmek.
Gereksiz veri toplamaz ve harici sunuculara hiçbir şey göndermez.

## AÇIK KAYNAK
Kaynak kodu GitHub'da yayınlanmıştır.
Herkes DeHistory'nin güvenli olduğunu doğrulayabilir.
https://github.com/s-k-i/dehistory
```

---

## id (Bahasa Indonesia)

```
DeHistory menghapus data penjelajahan Anda dari browser.

## YANG DIHAPUS
- Riwayat penjelajahan
- Cookie
- Gambar dan file yang di-cache
- Data isi otomatis formulir
- Riwayat download

## FITUR
Penghapusan otomatis: Dapat diatur agar berjalan saat browser dibuka dan ditutup.
Daftar izin: Data situs yang Anda tentukan tetap disimpan.
Catatan: Daftar izin hanya berlaku untuk cookie dan file yang di-cache.

## PRIVASI
DeHistory dirancang hanya untuk satu tujuan: menghapus data penjelajahan Anda dengan aman.
Data yang tidak diperlukan tidak dikumpulkan dan tidak ada data yang dikirim ke server eksternal.

## SUMBER TERBUKA
Kode sumber dipublikasikan di GitHub.
Siapa pun dapat memastikan bahwa DeHistory aman.
https://github.com/s-k-i/dehistory
```

---

## vi (Tiếng Việt)

```
DeHistory xóa dữ liệu duyệt web của bạn khỏi trình duyệt.

## NHỮNG GÌ ĐƯỢC XÓA
- Lịch sử duyệt web
- Cookie
- Hình ảnh và tệp trong bộ nhớ đệm
- Dữ liệu tự động điền biểu mẫu
- Lịch sử tải xuống

## TÍNH NĂNG
Xóa tự động: Có thể thiết lập để chạy khi mở và khi đóng trình duyệt.
Danh sách cho phép: Dữ liệu của những trang web bạn chỉ định được giữ lại.
Lưu ý: Danh sách cho phép chỉ áp dụng cho cookie và tệp trong bộ nhớ đệm.

## QUYỀN RIÊNG TƯ
DeHistory được thiết kế cho một mục đích duy nhất: xóa dữ liệu duyệt web của bạn một cách an toàn.
Không thu thập dữ liệu không cần thiết và không gửi bất kỳ thứ gì đến máy chủ bên ngoài.

## MÃ NGUỒN MỞ
Mã nguồn được công bố trên GitHub.
Bất kỳ ai cũng có thể xác minh rằng DeHistory an toàn.
https://github.com/s-k-i/dehistory
```

---

## ko (한국어)

```
DeHistory는 브라우저에서 사용자의 인터넷 사용 데이터를 삭제합니다.

## 삭제되는 항목
- 인터넷 사용 기록
- 쿠키
- 캐시된 이미지 및 파일
- 자동 입력 양식 데이터
- 다운로드 기록

## 기능
자동 삭제: 브라우저를 시작할 때와 종료할 때 자동으로 실행되도록 설정할 수 있습니다.
허용 목록: 지정한 사이트의 데이터는 유지됩니다.
참고: 허용 목록은 쿠키와 캐시된 파일에만 적용됩니다.

## 개인정보 보호
DeHistory는 인터넷 사용 데이터를 안전하게 삭제하기 위해서만 설계되었습니다.
불필요한 데이터를 일절 수집하지 않으며 외부 서버로 전송하지도 않습니다.

## 오픈소스
소스 코드는 GitHub에 공개되어 있습니다.
DeHistory의 안전성은 누구나 검증할 수 있습니다.
https://github.com/s-k-i/dehistory
```

---

## zh_CN (简体中文)

```
DeHistory 可从浏览器中删除您的浏览数据。

## 删除的内容
- 浏览记录
- Cookie
- 缓存的图片和文件
- 自动填充的表单数据
- 下载记录

## 功能
自动删除：可设置为在浏览器启动时和关闭时运行。
允许列表：您指定网站的数据将被保留。
注意：允许列表仅适用于 Cookie 和缓存的文件。

## 隐私
DeHistory 仅为一个目的而设计：安全地删除您的浏览数据。
不会收集任何不必要的数据，也不会向外部服务器发送数据。

## 开放源代码
源代码已在 GitHub 上公开。
任何人都可以验证 DeHistory 的安全性。
https://github.com/s-k-i/dehistory
```

---

## zh_TW (繁體中文)

```
DeHistory 可從瀏覽器中刪除您的瀏覽資料。

## 刪除的項目
- 瀏覽紀錄
- Cookie
- 快取的圖片和檔案
- 自動填入的表單資料
- 下載紀錄

## 功能
自動刪除：可設定為在瀏覽器啟動時和關閉時執行。
允許清單：您指定網站的資料將會保留。
注意：允許清單僅適用於 Cookie 和快取的檔案。

## 隱私
DeHistory 僅為一個目的而設計：安全地刪除您的瀏覽資料。
不會收集任何不必要的資料，也不會向外部伺服器傳送資料。

## 開放原始碼
原始碼已發布於 GitHub。
任何人都可以驗證 DeHistory 的安全性。
https://github.com/s-k-i/dehistory
```
