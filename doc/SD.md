# 系統設計文件 (System Design) - 韓國首爾旅行網站

## 1. 總覽 (Overview)

本文件基於軟體架構 (SA) 文件，進一步詳細闡述系統的具體設計。內容包含系統的架構圖、各模組的詳細職責，以及資料庫的綱要設計，作為開發團隊實作的技術藍圖。

---

## 2. 系統架構圖 (System Architecture Diagram)

本圖採 C4 模型中的容器圖 (Container Diagram) 風格，展示系統的主要建構區塊 (應用程式、資料庫) 及其互動關係。

```mermaid
C4Container
    !include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

    Person(user, "一般使用者", "規劃行程的旅客")
    Person(admin, "管理員", "維護網站內容")

    System_Boundary(web_system, "首爾旅行網站系統") {
        Container(frontend, "前端應用", "React.js, SPA", "提供所有使用者介面")
        Container(backend, "後端應用", "Java, Spring Boot, REST API", "處理業務邏輯與資料存取")
        ContainerDb(database, "資料庫", "PostgreSQL", "儲存所有應用程式資料")
    }

    Rel(user, frontend, "使用", "HTTPS")
    Rel(admin, frontend, "使用", "HTTPS")

    Rel(frontend, backend, "發送 API 請求", "HTTPS, JSON")

    Rel(backend, database, "讀取/寫入資料", "JDBC")
```

**架構說明**:
- **使用者 (一般使用者/管理員)**: 透過網頁瀏覽器與「前端應用」互動。
- **前端應用 (React SPA)**: 是一個單頁應用程式，負責呈現介面並回應使用者操作。它透過 HTTPS 向「後端應用」發送 API 請求來處理資料。
- **後端應用 (Spring Boot API)**: 核心業務邏輯層。它提供 RESTful API 給前端使用，並透過 JDBC (Java Database Connectivity) 協議與「資料庫」溝通。
- **資料庫 (PostgreSQL)**: 負責永久儲存所有資料，如使用者、地點、行程等。

---

## 3. 模組職責 (Module Responsibilities)

### 3.1. 前端應用 (Frontend Application)
- **技術**: React.js
- **職責**:
  - **介面渲染 (UI Rendering)**: 根據從後端獲取的資料，動態產生並顯示頁面。
  - **使用者互動 (User Interaction)**: 處理使用者的點擊、輸入、表單提交等行為。
  - **狀態管理 (State Management)**: 管理整個應用程式的狀態，例如使用者登入狀態、目前顯示的行程資料等。
  - **路由管理 (Routing)**: 根據 URL 的變化，切換顯示不同的頁面 (例如：首頁、行程頁、登入頁)。
  - **API 通訊 (API Communication)**: 透過 Axios 或 Fetch API 與後端進行非同步的資料交換。

### 3.2. 後端應用 (Backend Application)
- **技術**: Java, Spring Boot
- **職責**:
  - **API 端點 (API Endpoints)**: 設計並實作 RESTful API，供前端呼叫。例如 `/api/users`, `/api/locations`, `/api/itineraries`。
  - **使用者驗證與授權 (Authentication & Authorization)**: 處理使用者註冊、登入，並使用 JWT (JSON Web Tokens) 或 Session 來驗證使用者身份與角色權限。
  - **業務邏輯 (Business Logic)**: 實作核心功能，例如建立行程、將景點加入行程、管理員權限判斷等。
  - **資料存取 (Data Access)**: 透過 Repository 模式與資料庫互動，執行資料的新增、查詢、修改、刪除 (CRUD)。
  - **資料驗證 (Data Validation)**: 確保從前端傳來的資料符合格式要求 (例如：Email 格式、密碼長度)。

### 3.3. 資料庫 (Database)
- **技術**: PostgreSQL
- **職責**:
  - **資料持久化 (Data Persistence)**: 安全地儲存所有資料。
  - **資料完整性 (Data Integrity)**: 透過主鍵 (Primary Key)、外鍵 (Foreign Key) 等約束，確保資料之間關聯的正確性。
  - **交易管理 (Transaction Management)**: 確保一系列操作要麼全部成功，要麼全部失敗，維持資料一致性 (例如：建立行程時，需同時寫入多個表格)。
  - **資料備份與恢復 (Backup & Recovery)**: 制定備份策略，以防資料遺失。

---

## 4. 資料表對應 (Database Schema)

以下為資料庫中各個資料表的詳細設計。

### `users`
儲存使用者與管理員的帳戶資訊。
| 欄位名稱 | 資料型別 | 限制/約束 | 說明 |
| :--- | :--- | :--- | :--- |
| `user_id` | `SERIAL` | `PRIMARY KEY` | 使用者唯一識別碼 (自動遞增) |
| `username` | `VARCHAR(50)` | `NOT NULL`, `UNIQUE` | 使用者名稱 |
| `email` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE` | 電子郵件 |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | 加密後的密碼 |
| `role` | `VARCHAR(20)` | `NOT NULL`, `DEFAULT 'USER'` | 角色 (USER 或 ADMIN) |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | 帳號建立時間 |

### `locations`
儲存所有地點 (景點、餐廳等) 的資訊。
| 欄位名稱 | 資料型別 | 限制/約束 | 說明 |
| :--- | :--- | :--- | :--- |
| `location_id` | `SERIAL` | `PRIMARY KEY` | 地點唯一識別碼 |
| `name` | `VARCHAR(255)` | `NOT NULL` | 地點名稱 |
| `description` | `TEXT` | | 詳細描述 |
| `address` | `VARCHAR(255)` | | 地址 |
| `category` | `VARCHAR(50)` | `NOT NULL` | 分類 (ATTRACTION, FOOD, SHOPPING) |
| `latitude` | `DECIMAL(9,6)` | | 緯度 |
| `longitude` | `DECIMAL(9,6)` | | 經度 |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | 資料建立時間 |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | 資料最後更新時間 |

### `itineraries`
儲存使用者建立的行程基本資訊。
| 欄位名稱 | 資料型別 | 限制/約束 | 說明 |
| :--- | :--- | :--- | :--- |
| `itinerary_id` | `SERIAL` | `PRIMARY KEY` | 行程唯一識別碼 |
| `user_id` | `INTEGER` | `NOT NULL`, `FOREIGN KEY (users.user_id)` | 所屬使用者的 ID |
| `name` | `VARCHAR(255)` | `NOT NULL` | 行程名稱 |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | 建立時間 |

### `itinerary_items`
儲存行程中包含的地點，以及其順序。
| 欄位名稱 | 資料型別 | 限制/約束 | 說明 |
| :--- | :--- | :--- | :--- |
| `item_id` | `SERIAL` | `PRIMARY KEY` | 項目唯一識別碼 |
| `itinerary_id` | `INTEGER` | `NOT NULL`, `FOREIGN KEY (itineraries.itinerary_id)` | 所屬行程的 ID |
| `location_id` | `INTEGER` | `NOT NULL`, `FOREIGN KEY (locations.location_id)` | 對應地點的 ID |
| `item_order` | `INTEGER` | `NOT NULL` | 地點在行程中的順序 |
