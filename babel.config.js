// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ESTE PLUGIN ES ABSOLUTAMENTE NECESARIO PARA REACT NATIVE REANIMATED
      'react-native-reanimated/plugin', 
    ],
  };
};