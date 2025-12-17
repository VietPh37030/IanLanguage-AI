module.exports = function (api) {
    api.cache(true);

    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // react-native-reanimated/plugin phải đặt cuối cùng
            // Nó đã bao gồm worklets bên trong, không cần thêm riêng
            'react-native-reanimated/plugin',
        ],
    };
};
