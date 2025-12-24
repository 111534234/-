首爾旅遊網站系統架構設計
根據您提供的《韓國首爾旅遊網站專案需求分析書 (REQ) 3.0》以及 SA 撰寫規範，本 SA（系統架構書）旨在定義系統的結構、分層與頁面骨架，以供後續的 Spring Boot 專案骨架生成使用。
請注意：本文件僅定義架構層次，不包含資料庫欄位細節、API 規格或程式邏輯 [1], [2]。
--------------------------------------------------------------------------------
📘 系統架構書 (SA) 3.0：首爾旅遊網站
1. 使用案例對應 (Use Case Mapping)
本架構旨在支援 REQ 文件中定義的使用情境，並確保功能性需求 (FRs) 不被遺漏 [3]。
REQ 編號 (參考)
使用案例 (Use Case)
參與角色
對應 SA 模組/頁面
FR-1
訪客瀏覽旅遊內容 (所有分類)
訪客
前台-列表頁、詳情頁
FR-2
訪客點擊 Banner 或瀏覽頁面
訪客
前台-首頁、後端統計服務
FR-3
管理員新增/編輯/刪除旅遊內容
管理員
後台-內容管理頁
FR-4
管理員管理 Banner
管理員
後台-Banner 管理頁
FR-5
管理員分析數據成效
管理員
後台-數據統計頁
2. 系統分層概觀 (System Layer Overview)
本系統採用標準的分層架構，以確保職責分離，並支援 REQ 中定義的 CRUD 及數據統計功能 [4]。
• 前台 (WebUI)：負責顯示資料與使用者互動 (需支援 RWD 和 繁中/英文雙語系 [5])。
• 後台 (Controller/API)：負責接收前台請求、驗證輸入與回應結果。
• 服務層 (Service)：負責核心業務邏輯運算，例如處理圖片自動產生縮圖、內容管理、數據累積與查詢等 [6]。
• 資料層 (Repository/DB)：負責與資料庫進行 CRUD 存取，並提供每月定期備份 [7]。
> 資料流向說明：使用者操作 WebUI
rightarrow 發送 HTTP 請求至 Controller
rightarrow 呼叫 Service 處理邏輯
rightarrow 透過 Repository 存取 DB [4]。
3. 頁面架構列表 (Page Architecture) ⭐
這是 Gemini CLI 生成程式骨架的關鍵依據。頁面設計將滿足專業、簡潔、易於瀏覽的設計要求 [5], [8]。
3.1 前台頁面 (Frontend Pages)
頁面名稱
路由 (範例)
主要功能/內容
關鍵操作/按鈕
首頁
/ 或 /index
顯示輪播 Banner、最新公告、各類別熱門內容摘要。
搜尋、語言切換 (繁中/EN) [5]、點擊 Banner (需計數) [5]。
內容列表頁
/guide/{category}
依據類別（旅遊資訊、交通方式、住宿體驗、美食探索、購物樂趣）顯示文章列表 [6]。
篩選、分頁。
內容詳情頁
/article/{id}
顯示單一文章的詳細資訊 (純文字、HTML、圖片、影音檔) [6]。
附件下載、社群分享 (此頁面瀏覽次數需計數) [5]。
靜態頁面
/about, /contact
關於網站、聯絡資訊。
無
3.2 後台頁面 (Backend Pages)
頁面名稱
路由 (範例)
主要功能/內容
關鍵操作/按鈕
管理員登入頁
/admin/login
管理員帳號密碼輸入。
登入
內容管理頁 (核心)
/admin/content
旅遊資訊 (景點、美食) 的 CRUD 列表。需支援多媒體編輯、多圖上傳及縮圖產生 [6].
新增文章、編輯、刪除、上架/下架。
數據統計頁
/admin/stats
顯示所有網頁的瀏覽次數統計報表，以及所有 Banner 點擊次數統計報表 [5]。
查詢區間、匯出報表。
Banner 管理頁
/admin/banner
輪播 Banner 的 CRUD 管理 (圖片上傳、連結設定)。
新增 Banner、編輯、刪除。
4. 系統架構圖 (System Architecture Diagram)
使用 Mermaid 語法呈現高階分層結構，強調核心服務的流向 [9]。
graph TD
    A[使用者/管理員] --&gt;|Browser RWD| B(WebUI 前端頁面)
    B --&gt;|HTTPS Request| C(控制層 Controller)
    C --&gt; D(服務層 Service)
    D --&gt; E(資料存取層 Repository)
    E --&gt; F[(資料庫 DB)]

    subgraph 後端核心服務
        D --&gt; D1[內容發布管理]
        D --&gt; D2[影像處理服務 (自動縮圖)]
        D --&gt; D3[數據統計服務]
        D1 &amp; D2 &amp; D3 --&gt; E
    end

    C -- 敏感資料 --&gt;|SFTP/HTTPS 加密協定| G(外部資料交換/備份)

5. 使用者情境順序圖 (User Sequence Diagram)
針對關鍵的「訪客瀏覽內容與數據統計」情境繪製業務流程圖 [9], [10]。
情境：訪客瀏覽景點詳情，觸發數據追蹤
sequenceDiagram
    participant User as 訪客
    participant Web as 前台頁面
    participant Controller as 控制層
    participant Service as 數據服務
    participant DB as 資料庫

    User-&gt;&gt;Web: 點擊「內容詳情頁」連結
    Web-&gt;&gt;Controller: 請求 /article/{id} (HTTP GET)

    Controller-&gt;&gt;Service: 請求內容資料 (Find Article Data)
    Service-&gt;&gt;DB: 查詢文章內容
    DB--&gt;&gt;Service: 回傳文章資料

    Controller-&gt;&gt;Service: **呼叫統計服務**
    Service-&gt;&gt;DB: **記錄網頁瀏覽次數 + 1** (Page View Count) [5]

    Controller--&gt;&gt;Web: 回傳完整頁面 (包含圖片與內容)
    Web--&gt;&gt;User: 顯示內容 (網頁載入須於 3 秒內) [7]

6. 需求對應表 (REQ Mapping)
列出 SA 模組與 REQ 需求的對應關係，確保所有核心需求都已包含在架構設計中 [3]。
REQ 功能描述
REQ 編號 (FRs)
對應 SA 模組/頁面
發布內容結構 (旅遊資訊、交通等)
1.1
內容列表頁、內容詳情頁
編輯能力 (HTML, 影音, 多圖)
1.2, 1.3
後台-內容管理頁
影像處理 (自動產生縮圖)
1.4
服務層-影像處理服務
統計網頁瀏覽與 Banner 點擊
2.1
後台-數據統計頁，服務層-數據統計服務
響應式設計 (RWD)
NFR 1.1
WebUI 前端頁面
雙語系支援
NFR 1.3
WebUI 前端頁面
HTTPS/SFTP 加密
NFR 3.2
Controller/API 層 (傳輸協定規範)