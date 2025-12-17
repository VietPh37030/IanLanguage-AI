// src/config/firebase.js

import { initializeApp } from "firebase/app";
// Thay đổi dòng này: Nhập thêm các công cụ hỗ trợ lưu đăng nhập
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// Nhập cái kho lưu trữ AsyncStorage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Config của bạn (Giữ nguyên)
const firebaseConfig = {
    apiKey: "AIzaSyCZM8JeAE9NNUK5m88suPKrHGL21vbSj7g",
    authDomain: "ianlanguage.firebaseapp.com",
    databaseURL: "https://ianlanguage-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ianlanguage",
    storageBucket: "ianlanguage.firebasestorage.app",
    messagingSenderId: "271839567150",
    appId: "1:271839567150:web:c71fc31d6fad366a86eebf",
    measurementId: "G-33XE03MEBE"
};

// Khởi tạo App
const app = initializeApp(firebaseConfig);

// --- PHẦN SỬA ĐỔI QUAN TRỌNG NHẤT ---
// Thay vì dùng getAuth(app) đơn thuần, ta cấu hình nó để dùng AsyncStorage
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Xuất ra để dùng
export { auth };
export const database = getDatabase(app);