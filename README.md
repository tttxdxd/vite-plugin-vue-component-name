# vite-plugin-vue-component-name

[![NPM version](https://img.shields.io/npm/v/vite-plugin-vue-component-name?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-vue-component-name)

## Features

- [x] Make the vue script syntax support the name attribute 
- [x] Make the vue script setup syntax support the name attribute 
- [x] Allow the vue script syntax with empty content support the name attribute 
- [x] Use file path generate name attribute

## Install

node version: >=12.0.0
vite version: >=2.0.0

```shell
pnpm i vite-plugin-vue-component-name -D
```

or

```shell
npm i vite-plugin-vue-component-name -D
```

or

```shell
yarn add vite-plugin-vue-component-name -D
```

## Usage

- Config plugin in vite.config.ts. In this way, the required functions can be introduced as needed

```ts
import { Plugin, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueComponentName from 'vite-plugin-vue-component-name'

export default defineConfig({
  plugins: [vue(), vueComponentName()],
})
```

- SFC

```vue
<script lang="ts" setup name="App"></script>

<template>
  <div>hello world</div>
</template>
```

## Thanks

- [vite-plugin-vue-setup-extend](https://github.com/vbenjs/vite-plugin-vue-setup-extend)

## License

[MIT](./LICENSE) License © 2023 [tttxdxd](https://github.com/tttxdxd)
