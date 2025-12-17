# 🦎 Ian AI: Trợ Lý Học Ngôn Ngữ

<p align="center">
  <img src="assets/images/IconApp.png" alt="Ian AI Logo" width="120" />
</p>

<p align="center">
  <b>Ứng dụng học ngôn ngữ thông minh với AI companion</b><br/>
  <i>Học tiếng Trung, tiếng Anh một cách vui vẻ và hiệu quả!</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Expo-SDK_54-000020?style=flat-square&logo=expo" />
  <img src="https://img.shields.io/badge/Firebase-Auth_&_DB-FFCA28?style=flat-square&logo=firebase" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" />
</p>

---

## ✨ Tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🌍 **Đa ngôn ngữ** | Hỗ trợ tiếng Việt, tiếng Anh, tiếng Trung |
| 🤖 **AI Companion** | Ian - trợ lý AI với nhiều tính cách khác nhau |
| 🎯 **Cá nhân hóa** | Tùy chỉnh mục tiêu và trình độ học tập |
| 🔐 **Xác thực OTP** | Quên mật khẩu với mã xác nhận 6 số |
| 🎨 **UI hiện đại** | Glassmorphism design với animations mượt mà |
| 📱 **Rive Animations** | Loading và UI animations sống động |

---

## 📸 Screenshots

<p align="center">
  <i>Coming soon...</i>
</p>

---

## 🚀 Cài đặt

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn
- Android Studio (cho Android development)
- Xcode (cho iOS development - macOS only)

### Bước 1: Clone repo

```bash
git clone https://github.com/VietPh37030/IanLanguage-AI.git
cd IanLanguage-AI
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình Environment

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Cập nhật các giá trị trong `.env`:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
```

### Bước 4: Chạy ứng dụng

**Android:**
```bash
npx expo run:android
```

**iOS:**
```bash
npx expo run:ios
```

**Development mode:**
```bash
npx expo start --dev-client
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native 0.81.5, Expo SDK 54 |
| **Language** | TypeScript |
| **Navigation** | Expo Router |
| **State** | React Context |
| **Backend** | Firebase (Auth, Realtime DB) |
| **Storage** | Cloudinary (Images), AsyncStorage |
| **Animations** | Reanimated, Rive |
| **UI** | Custom Components, Glassmorphism |

---

## 📁 Cấu trúc dự án

```
IanLanguage/
├── app/                    # Screens (Expo Router)
│   ├── index.tsx          # Splash Screen
│   ├── language.tsx       # Language Selection
│   ├── welcome.tsx        # Welcome Screen
│   ├── goals.tsx          # Goals Selection
│   ├── level.tsx          # Level & AI Personality
│   ├── login.tsx          # Login Screen
│   ├── register.tsx       # Register Screen
│   ├── forgot-password.tsx # OTP Password Reset
│   ├── profile-setup.tsx  # Profile Setup
│   └── home.tsx           # Home Screen
├── src/
│   ├── components/        # Reusable UI components
│   ├── config/            # Firebase, Cloudinary configs
│   ├── constants/         # Theme, colors, typography
│   └── i18n/              # Internationalization
├── assets/
│   ├── images/           # App images
│   └── rive/             # Rive animation files
└── android/              # Native Android code
```

---

## 🌐 Internationalization

Hiện tại hỗ trợ:
- 🇻🇳 Tiếng Việt
- 🇬🇧 English
- 🇨🇳 中文 (简体)
- 🇹🇼 中文 (繁體)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Việt Phạm**
- GitHub: [@VietPh37030](https://github.com/VietPh37030)

---

<p align="center">
  Made with ❤️ in Vietnam 🇻🇳
</p>
