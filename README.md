# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


## Infrastructure
home
a list of trips

button - create new trip(host view)
button - join the trip(guest view)

pages
- create a new trip
- trip detail
- checklist page

component 
- trip detail component
- checklist items


## Tech

要用tailwind要用nativewind
但是他cli建出來專案的沒有用file routing, 但我想要
所以我用回原本專案 就不用tailwind了 也可以啦

## TODO

### Deep link
Deep link to force new user sign up with verification of email
https://supabase.com/docs/guides/auth/native-mobile-deep-linking?platform=react-native 


Note: 目前不用Google login, 因為他不支援Expo Go 這樣違背原本想用Expo Go測試的用意
### Google cloud auth - custom domain
note: this will be a paid feature
https://supabase.com/docs/guides/auth/social-login/auth-google
Set up a custom domain for your project to present the user with a clear relationship to the website they clicked Sign in with Google on.

### Google Cloud Auth - Production credential
現在只有把debug的sha1加入Google Cloud Auth, 要上市的話還要生成production 然後生個新的Google Cloud Auth 的Clients, 並且加到Supabase
https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=platform&platform=react-native


記錄所有難點
第一天
- 用什麼技術 想用react native
- 如何測試 Expo Go
- 如何發佈 Expo Go
- routing use file routing
- styling 該死的卡在nativewind和file routing不能同時兼顧, 最後回頭用不習慣的寫法

第二天
- UI套件選擇 react native element 比較好看, 不喜歡react native paper風格
  - 要給RNE一個themeWrapper 大解決困難
- Supabase 不能用在web - 解決了
- 登入 該死的Google login不能用Expo Go, 回頭用email login

TODO:
login怎麼設計UI


TODO:
0. (done) 行程detail/edit
1. (done) Login => enter name and email
2. (done) Host view/Guest view => Host can edit trip, trip is from db
3. (done) Guest ready UI in trip
  - trip 可以看到user ready state, 只有在全員ready那個user才會顯示ready tick
4. (done) Add checklist for family member, each member will have ready UI when member's checklist is completed
5. (done) Join button
(done) Checklist 應該只show 是user的那些 現在是全show的樣子 - 要從trip_participants 才能找到user參加的trips
(done) 建立trip時, 就要insert 建立者user 到trip_participants
(done) checklist再新增new trip後要refetch
(done) 參與者 改成圓形
(done) 取消參加按鈕
參加/取消不要refetch 畫面會閃
(done) 新member無法直接點選checklist 要重新整理 - after insert, return inserted then update checklist list
(done) 新user無法點選checklist - insert new checklist, then add return id to checklist list
(done) Supabase typescript
(done) Safe area
(done) Android/ios member adding UI layout
(done) Third page head image/統一圖片形式
寫使用情境 
我是一個滑雪愛好者 我想要邀請我們朋友們去滑雪 但是有很多要準備的事情 怎麼辦
於是我設計了一個App 讓朋友們知道準備哪些東西後就可以出發了
App好處在於我隨時可以知道我們朋友們是否準備好了
有些朋友有家庭 需要準備多份行囊 所以也做了隊員的功能
最後是我自己想記錄下每次滑雪用的滑雪板長度 還有喜歡的餐廳
App主要挑戰在於選擇技術 釐清table間的關係 決定欄位資料結構

挑戰
挑戰點：NativeWind（Tailwind for React Native）與 Expo Router 的 file-based routing 衝突，CLI 建立的版本只能不用file-based。
解決過程：評估可維護性與專案大小後選選擇保留 file-based routing，並放棄 Tailwind 改回推薦使用的的 StyleSheet / RNE theme。
面試亮點：
	•	顯示你能權衡「開發效率 vs 穩定性」
	•	展現你對開發體驗（Expo Go）的重視

  從構想到完成的獨立開發

挑戰點：沒有設計稿、團隊或PM，只憑想法開發。
解決過程：
	•	先從「使用情境」出發（滑雪旅程邀請）
	•	再反推所需功能與資料表結構
	•	一邊開發一邊記錄遇到的問題與決策過程
面試亮點：
	•	顯示你具備完整產品開發能力（從需求 → 設計 → 架構 → 上線）
	•	展現自學與持續改進能力

寫介紹
面試用

開場：專案簡介

中文：
我開發了一個滑雪行程管理 App，目標是讓朋友或家庭可以一起規劃滑雪旅行。
App 功能包括行程建立、加入行程、檢查每個人的準備狀態，以及成員的個人 checklist。

English：
I developed a ski trip management app, aimed at helping friends or families plan trips together.
The app features creating trips, joining trips, tracking each member’s readiness, and personal checklists.

⸻

技術與挑戰 1：Expo + Supabase + OAuth

中文：
一開始我想用 Google Login，但 Expo Go 不支援，所以我改用 Email 登入，並保留 deep link 流程為未來 Google OAuth 做準備。
這讓我學會在平台限制下設計可擴展的登入架構。

English：
Initially, I planned to use Google Login, but Expo Go doesn’t support it.
So I switched to email login while keeping a deep-link flow for future Google OAuth.
This taught me to design scalable authentication under platform constraints.

⸻

技術與挑戰 2：即時資料與多角色 UI

中文：
多名成員同時更新 checklist 時，我需要即時更新 UI 而不刷新整頁，避免閃爍。
同時，不同角色（Host / Guest）看到不同操作權限，我設計了 trip_participants 資料結構來支援。

English：
When multiple members update checklists simultaneously, I needed real-time UI updates without full-page refresh to avoid flicker.
Also, different roles (Host / Guest) have different permissions, so I designed the trip_participants table to handle role-based UI.

⸻

技術與挑戰 3：跨平台與 UI

中文：
Android 與 iOS 排版差異大，我用 SafeArea + RNE ThemeProvider 統一樣式，確保成員顯示一致。
我也在 UI 套件選擇上做了取捨，選了 React Native Elements 達到美觀與可維護性平衡。

English：
Android and iOS layouts were different, so I used SafeArea and RNE ThemeProvider for consistent design.
I chose React Native Elements for UI to balance aesthetics and maintainability.

⸻

結尾：學習與亮點

中文：
這個專案讓我從需求分析、資料結構設計，到前端 UI/UX 都有完整經驗。
我學會了如何在技術限制下快速迭代，並確保使用者體驗順暢。

English：
This project gave me end-to-end experience from requirement analysis and data structure design to front-end UI/UX.
I learned to iterate quickly under technical constraints while ensuring smooth user experience.

V2
(done) - 整理名稱 看下面notes
1. Member
2. Family (shared same view)
3. Google login/logout
4. invite
5. checklist 分行程

v3
1. 新增行程時, 可從預設選單選雪場 然後會給一個範例行程
2. user react query, 這樣比較好invalidate


Notes:
trip_members = all members under an user



Project overview

Project Overview
Snow Trip Inviter is a mobile app for organizing snowboarding/skiing trips with friends. It's built with:

React Native with Expo Router for navigation
TypeScript for type safety
Supabase as the backend database
React Native Elements UI (@rneui) for UI components
Core Features
1. Trip Management 🎿
Admins can create new trips with details like:
Location (ski resort)
Accommodation
Dates
Transportation
Gear rental info
Notes
Users can join/leave trips
Trip participants list with readiness status
2. Checklist System ✅
Trip-specific preparation checklists
Support for multiple family members per user
Default checklist categories:
Equipment: goggles, gloves, hat
Clothing: jacket, pants
Other: accommodation booking, lift tickets
Visual "ready" indicators for each participant
3. User Profiles 👤
User authentication via Supabase Auth
Profile management with full name
Snowboard management (length, brand, model, comments)
Role-based access (admin vs regular user)
4. Additional Features
Restaurant tracking (rating, comments, visit dates)
Responsive design for both iOS and Android
Background image headers
Snackbar notifications
Database Schema
The app uses Supabase with these main tables:

profiles - User information
trips - Trip details
trip_participants - Many-to-many relationship between users and trips
checklist - User checklists per trip (supports multiple family members)
snowboards - User snowboard equipment
restaurants - Restaurant reviews
trip_members - Trip member management
App Structure
The app appears to be primarily in Traditional Chinese, targeting Chinese-speaking snowboarding enthusiasts.

Technical Architecture
File-based routing with Expo Router
TypeScript with auto-generated Supabase types
Responsive design with themed components
Context-based user management
Real-time updates via Supabase subscriptions
This is a well-structured social trip planning app specifically designed for snow sports enthusiasts! The code shows good TypeScript practices and proper separation of concerns.