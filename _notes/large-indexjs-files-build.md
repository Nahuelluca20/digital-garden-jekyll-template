---
title: Improve performance in large `index-*.js` files
---
Sometimes in large projects we can have builds that weigh quite a lot, even more than 9 MB, this can translate to more loading time on the client.

To try to solve this we are going to investigate different techniques that can be useful.
## Diagnostic
### Rollup Plugin Visualizer:
In this case it is a Vite app so we can take advantage of the rollup-plugin-visualizer plugin to generate an interactive report that shows how the weight is distributed among your modules.

```bash
npm install --save-dev rollup-plugin-visualizer
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,  
      filename: 'bundle-analysis.html',
      gzipSize: true,
      brotliSize: true
    })
  ]
})
]
```

With this when que run de `build` command that generate a visualizar about our build.


## Possible solutions

#### **Mark React & ReactDOM as external**
Prevents React and ReactDOM from being bundled.
```js
build: {
  rollupOptions: {
    external: ['react', 'react-dom'],
  },
}
```

#### **Enable code splitting**
Splits code into smaller chunks to avoid a massive single file.
```js
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) return 'vendor';
      },
    },
  },
}
```

#### **Replace heavy libraries** (the worst option)
Swap out bloated dependencies for lighter alternatives.

#### **Use lazy loading**
Load heavy components only when needed.
```js
const Editor = React.lazy(() => import('./Editor'))
```

#### **Enable compression**
Compresses `.js` files to reduce download size.
```js
import compression from 'vite-plugin-compression';

plugins: [react(), compression()],
```

#### **Enable treeshaking**
Helps if you're importing entire libraries instead of just what you use.
```js
build: {
  treeshake: true,
  commonjsOptions: {
    include: /node_modules/,
  },
}
```
