首爾旅遊網站系統設計書 3.0
這是一份根據您的《首爾旅遊網站系統架構設計 (SA) 3.0》、Java/Spring Boot 實作技術棧，以及 XAMPP 環境（使用 MySQL 資料庫）所產出的系統設計書 (SD) 3.0。
SD 旨在將 SA 的骨架轉化為具體的程式碼實現計畫，確保每個功能都有對應的程式邏輯、API 規格和資料庫設計。
--------------------------------------------------------------------------------
📘 系統設計書 (SD) 3.0：首爾旅遊網站 (Java/Spring Boot)
1. 📋 SA 需求實作對應表 (Implementation Mapping)
此表格將 SA 中定義的頁面和模組，對應到 Java 專案的具體檔案、API 端點及資料表，以便於程式碼生成 [1].
SA 需求編號
SA 頁面/模組名稱
前端檔案 (View) (HTML/Thymeleaf)
後端 API (Controller) (Java)
資料表 (Entity) (MySQL)
實作邏輯摘要
F-1.1
內容列表頁
views/guide/list.html
GET /guide/{category}
Article
依類別查詢文章，實作分頁與 RWD 渲染 [2, 3]
F-1.2
內容詳情頁
views/article/detail.html
GET /article/{id}
Article, StatLog
依 ID 查詢內容，並呼叫 StatService 記錄網頁瀏覽次數 [2]
F-2.1
內容管理頁 (核心)
views/admin/content.html
POST/PUT /admin/api/articles
Article, Media
支援多媒體編輯、多圖上傳及自動縮圖產生 [2]
F-2.2
數據統計頁
views/admin/stats.html
GET /admin/api/stats/summary
StatLog
查詢並彙整瀏覽次數與 Banner 點擊次數報表 [2]
F-2.3
Banner 管理頁
views/admin/banner.html
POST/PUT /admin/api/banners
Banner
Banner 的 CRUD 操作，並記錄點擊連結 [2]
F-3.1
管理員登入頁
views/admin/login.html
POST /admin/login
AdminUser
使用 Spring Security 進行身分驗證 [2]
NFR-1.3
雙語系切換
(所有頁面)
(無獨立 API)
(無)
使用 Spring Boot 國際化資源檔 (messages_zh_TW.properties, messages_en.properties) 實現 [4]
2. 🧩 模組詳細實作規格 (Module Realization Specs)
此處針對專案中最核心的兩個功能——內容詳情頁及數據統計——進行詳細設計，作為 Java/Spring Boot 程式碼實現的依據 [5]。
規格 I: 內容詳情頁與瀏覽統計 (F-1.2)
此規格實作 REQ 中「訪客瀏覽內容」及「必須統計網頁瀏覽次數」的要求 [6], [2]。
A. 相關類別與方法 (Class Design)
使用 Spring Boot 標準的 Controller-Service-Repository 分層架構 [3], [7]。
classDiagram
direction RL
class ArticleController {
    +getArticleDetail(@PathVariable id) String
}
class ArticleService {
    +findById(Long id) ArticleDTO
}
class StatService {
    +logPageView(Long articleId) void
}
class ArticleRepository {
    +findById(Long id) Optional~Article~
}
class StatRepository {
    +save(StatLog log) StatLog
}
ArticleController --&gt; ArticleService
ArticleController --&gt; StatService
ArticleService --&gt; ArticleRepository
StatService --&gt; StatRepository

B. 詳細 API 規格 (Detailed API)
• Endpoint: GET /article/{id}
• 用途: 取得單篇文章詳情，並同時觸發瀏覽次數計數。
• Input (Request):
    ◦ Path Variable: id (Long, 文章 ID)。
• Output (Model Attribute):
    ◦ Key: article
    ◦ Value Type: ArticleDTO (包含 id, title, content_html, mediaList, viewCount 等屬性)。
C. 實作邏輯步驟 (Implementation Logic)
詳述訪客瀏覽景點詳情，觸發數據追蹤的後端流程 [8], [9]。
sequenceDiagram
    participant Client as 瀏覽器
    participant Ctl as ArticleController
    participant ArtSvc as ArticleService
    participant StatSvc as StatService
    participant DB as Database (MySQL)

    Client-&gt;&gt;Ctl: 1. GET /article/{id} (請求文章詳情)

    Ctl-&gt;&gt;ArtSvc: 2. 呼叫 findById(id)
    ArtSvc-&gt;&gt;DB: 3. SELECT * FROM article WHERE id = {id}
    DB--&gt;&gt;ArtSvc: 4. 回傳 Article 實體

    Ctl-&gt;&gt;StatSvc: 5. 呼叫 logPageView(id)
    StatSvc-&gt;&gt;StatSvc: 6. 構造 StatLog 實體 (type=VIEW, target_id=id, timestamp=NOW)
    StatSvc-&gt;&gt;DB: 7. INSERT INTO stat_log (type, target_id, ...)

    DB--&gt;&gt;StatSvc: 8. 確認寫入成功
    StatSvc--&gt;&gt;Ctl: 9. 成功記錄

    Ctl-&gt;&gt;Ctl: 10. model.addAttribute("article", dto)
    Ctl--&gt;&gt;Client: 11. 回傳 detail.html (Thymeleaf 渲染)

規格 II: 內容管理與縮圖生成 (F-2.1)
此規格涵蓋管理員上傳多圖、編輯內容，並觸發「自動產生縮圖」的核心業務邏輯 [2], [3]。
A. 相關類別與方法 (Class Design)
classDiagram
direction RL
class ContentController {
    +saveArticle(@ModelAttribute articleForm) String
}
class ContentService {
    +save(ArticleForm form) Long
}
class ImageProcessorService {
    +generateThumbnail(MultipartFile file) String
}
class ArticleRepository {
    +save(Article entity) Article
}
ContentController --&gt; ContentService
ContentService --&gt; ArticleRepository
ContentService --&gt; ImageProcessorService

B. 詳細 API 規格 (Detailed API)
• Endpoint: POST /admin/api/articles
• 用途: 管理員提交新增或編輯後的文章內容。
• Input (Request):
    ◦ Request Body (@ModelAttribute): ArticleForm (包含 title, category, content_html, files (MultipartFile List) 等)。
3. 🗄️ 資料庫詳細設計 (Detailed Schema)
採用 MySQL 資料庫，定義核心實體 (Entity) 的結構和資料型態 [9]。
A. 核心實體結構表
資料表名稱
欄位名稱
資料型態 (MySQL)
是否為 Null
備註
Article (文章)
article_id
INT
N
PK，主鍵
title_zh
VARCHAR(255)
N
繁中標題 (支援雙語系)
title_en
VARCHAR(255)
Y
英文標題
category
VARCHAR(50)
N
內容分類 (如: 美食探索, 交通方式)
content_html
TEXT
Y
文章內容 (支援 HTML 編輯)
view_count
INT
N
網頁瀏覽次數 (可預先計入)
status
VARCHAR(10)
N
狀態 (UP/DOWN)
created_at
DATETIME
N
建立時間
Banner (輪播圖)
banner_id
INT
N
PK，主鍵
image_url
VARCHAR(512)
N
圖片儲存路徑
target_url
VARCHAR(512)
N
點擊後導向連結
click_count
INT
N
Banner 點擊次數
StatLog (統計日誌)
log_id
BIGINT
N
PK，主鍵
log_type
VARCHAR(20)
N
日誌類型 (PAGE_VIEW / BANNER_CLICK)
target_id
INT
N
對應的文章 ID 或 Banner ID
log_time
DATETIME
N
發生時間
ip_address
VARCHAR(50)
Y
訪客 IP 地址 (用於基礎去重/分析)
Media (媒體檔案)
media_id
BIGINT
N
PK，主鍵
article_id
INT
Y
FK，對應文章 ID
file_path
VARCHAR(512)
N
原始檔案路徑
thumbnail_path
VARCHAR(512)
Y
自動產生縮圖路徑
file_type
VARCHAR(20)
N
檔案類型 (Image/Video/Attachment)
B. 實體關係圖 (ERD)
erDiagram
    ARTICLE ||--o{ MEDIA : has
    ARTICLE ||--o{ STAT_LOG : logs
    BANNER ||--o{ STAT_LOG : logs

    ARTICLE {
        int article_id PK
        varchar title_zh
        varchar title_en
        varchar category
        text content_html
        int view_count
        varchar status
        datetime created_at
    }

    BANNER {
        int banner_id PK
        varchar image_url
        varchar target_url
        int click_count
    }

    STAT_LOG {
        bigint log_id PK
        varchar log_type
        int target_id FK
        datetime log_time
        varchar ip_address
    }

    MEDIA {
        bigint media_id PK
        int article_id FK
        varchar file_path
        varchar thumbnail_path
        varchar file_type
    }
