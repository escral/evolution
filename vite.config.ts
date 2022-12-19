import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import ViteSvgLoader from 'vite-svg-loader'
import AutoImport from 'unplugin-auto-import/vite'
import type { Plugin } from 'vite'

export default ({ mode }: any) => {
    const env = loadEnv(mode, process.cwd(), ['VITE_', 'DEBUG'])

    process.env = { ...process.env, ...env }

    const entries = [
        './public/index.html',
    ]

    return defineConfig({
        root: './public',

        build: {
            assetsDir: './build/assets',

            rollupOptions: {
                input: entries,
            },
        },

        // esbuild: {
        //     keepNames: true,
        // },

        optimizeDeps: {
            entries,
        },

        css: {
            postcss: {
                plugins: [
                    require('@tailwindcss/nesting'),
                    require('tailwindcss'),
                ].filter(Boolean),
            },
        },

        plugins: [
            ViteSvgLoader({
                defaultImport: "url",
            }),
            vue(),
            AutoImport({
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.mjs?$/, // .mjs
                    /\.vue$/, /\.vue\?vue/, // .vue
                ],

                imports: [
                    'vue',
                    {
                        '@vueuse/core': [
                            'useDebounceFn',
                            'useCurrentElement',
                        ],
                    },
                ],

                dirs: [
                    '../src/composables',
                ],

                dts: '../auto-imports.d.ts',
            }),
        ].filter(Boolean) as Plugin[],

        resolve: {
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
            alias: {
                '@': resolve(__dirname, './src'),
            },
        },

        define: {
            'process.env': env,
        },
    })
}