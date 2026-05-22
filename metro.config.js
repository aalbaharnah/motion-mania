const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Allow Metro to bundle MoveNet and other TFLite models as static assets
config.resolver.assetExts.push('tflite');

module.exports = withNativeWind(config, { input: './src/global.css' })