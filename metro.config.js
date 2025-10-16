/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 * This configuration ensures react-native-maps works correctly
 */

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;