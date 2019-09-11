import typescript from "rollup-plugin-typescript";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";
import cleaner from "rollup-plugin-cleaner";

const { dependencies = {}, peerDependencies = {} } = pkg;
const external = Object.keys({ ...peerDependencies, ...dependencies });

export default [
  {
    input: "src/index.tsx",
    external,
    plugins: [
      cleaner({
        targets: ["./dist"]
      }),
      commonjs(),
      resolve(),
      typescript(),
      babel()
    ],
    output: [
      {
        file: "dist/index.js",
        format: "umd",
        name: "useApiReactHook",
        esModule: false
      },
      {
        file: "dist/esm.index.js",
        format: "esm"
      }
    ]
  }
];
