/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const transpileModules = [
  "react-native",
  "@react-native",
  "dripsy",
  "@dripsy",
  "@expo", // dripsy dependancy
  "react-native-paper",
  "react-native-iphone-x-helper", // react-native-paper dependancy
];
module.exports = {
  preset: "react-native",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: [
    `node_modules/(?!(${transpileModules.join("|")})/)`,
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/"],
};
