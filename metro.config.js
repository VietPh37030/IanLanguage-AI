// metro.config.js - Cấu hình Metro bundler
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Thêm extension .riv để Metro bundler nhận diện file Rive
config.resolver.assetExts.push('riv');

module.exports = config;
