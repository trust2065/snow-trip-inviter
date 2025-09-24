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
0. 行程detail
1. Login => enter name and email
2. Host view/Guest view => Host can edit trip, trip is from db
3. Guest ready UI in trip
4. Add checklist for family member, ready UI
5. Join button

V2
1. Member 
2. Family (shared same view)
3. Google login/logout
4. invite
5. checklist 分行程

v3
1. 新增行程時, 可從預設選單選雪場 然後會給一個範例行程
2. 