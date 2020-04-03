## demo
[![](http://img.youtube.com/vi/0Y_O4xTX2Nc/0.jpg)](http://www.youtube.com/watch?v=0Y_O4xTX2Nc "")

## demand
+ 為了不讓伺服器過載，請設計一個 middleware
+ 限制每小時來自同一個 IP 的請求數量不得超過 1000
+ 在 response headers 中加入剩餘的請求數量 (X-RateLimit-Remaining) 以及 rate + limit 歸零的時間 (X-RateLimit-Reset)
+ 如果超過限制的話就回傳 429 (Too Many Requests)
+ 可以使用各種資料庫達成
## run server
```
cd dcard_intern_pre_homework
npm install
npm start
```
visit http://127.0.0.1:5000
## defect
+ callback hell
## technic use
- Nodejs express
- MySQL

## database structure
```SQL
CREATE TABLE `ip_table` (
	`ip_addr` TEXT NOT NULL DEFAULT '',
	`req_times` INT(11) NOT NULL DEFAULT 0,
	`dead_time` DATETIME NULL DEFAULT NULL
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
```
## project file structure
```
└── dcard_intern_pre_homework
    ├── app.js
    ├── models
    │   └── sqlModel.js
    ├── package.json
    ├── public
    │   └── index.html
    ├── README.md
    └── routes
        ├── alldata.js
        ├── draw.js
        └── index.js
```