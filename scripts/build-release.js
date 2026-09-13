import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')

const DIST_HTML = path.join(DIST, 'index.html')

console.log('')
console.log('========================================')
console.log(' Thunder Unicorn 13 - Build')
console.log('========================================')
console.log('')

// ==================================================
// 1. 清理 dist
// ==================================================

if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, {
        recursive: true,
        force: true
    })
}

console.log('✓ 已清理 dist')

// ==================================================
// 2. 调用 Vite 构建源码
// ==================================================

console.log('✓ 正在执行 Vite 构建...')

try {
    await build({
        root: ROOT,
        configFile: path.join(ROOT, 'vite.config.js'),
        build: {
            outDir: DIST,
            emptyOutDir: true
        }
    })
} catch (error) {
    console.error('')
    console.error('❌ Vite 构建失败')
    console.error(error)
    process.exit(1)
}

console.log('✓ Vite 构建完成')

// ==================================================
// 3. 检查 index.html
// ==================================================

if (!fs.existsSync(DIST_HTML)) {
    console.error('')
    console.error('❌ Vite 没有生成 dist/index.html')
    process.exit(1)
}

console.log('✓ 找到 dist/index.html')

// ==================================================
// 4. 读取 HTML
// ==================================================

let html = fs.readFileSync(DIST_HTML, 'utf8')

// ==================================================
// 5. 内嵌 CSS
// ==================================================

const cssRegex =
    /<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi

let match

const cssFiles = []

while ((match = cssRegex.exec(html)) !== null) {
    cssFiles.push(match[1])
}

for (const cssUrl of cssFiles) {
    const relativePath = cssUrl
        .replace(/^\.?\//, '')

    const cssPath = path.join(
        DIST,
        relativePath
    )

    if (!fs.existsSync(cssPath)) {
        console.warn(`⚠️ CSS 文件不存在：${cssPath}`)
        continue
    }

    const css = fs.readFileSync(
        cssPath,
        'utf8'
    )

    const escapedUrl =
        escapeRegExp(cssUrl)

    const linkRegex =
        new RegExp(
            `<link[^>]+href=["']${escapedUrl}["'][^>]*>`,
            'i'
        )

    html = html.replace(
        linkRegex,
        `<style>\n${css}\n</style>`
    )

    console.log(
        `✓ 已内嵌 CSS：${relativePath}`
    )
}

// ==================================================
// 6. 内嵌 JS
// ==================================================

const jsRegex =
    /<script([^>]+)src=["']([^"']+\.js)["']([^>]*)><\/script>/gi

const jsFiles = []

while ((match = jsRegex.exec(html)) !== null) {
    jsFiles.push({
        full: match[0],
        before: match[1],
        src: match[2],
        after: match[3]
    })
}

for (const script of jsFiles) {
    const relativePath =
        script.src.replace(/^\.?\//, '')

    const jsPath =
        path.join(DIST, relativePath)

    if (!fs.existsSync(jsPath)) {
        console.warn(
            `⚠️ JS 文件不存在：${jsPath}`
        )
        continue
    }

    const js = fs.readFileSync(
        jsPath,
        'utf8'
    )

    const scriptTag =
        `<script type="module">\n` +
        `${js}\n` +
        `</script>`

    html = html.replace(
        script.full,
        scriptTag
    )

    console.log(
        `✓ 已内嵌 JS：${relativePath}`
    )
}

// ==================================================
// 7. 写回 dist/index.html
// ==================================================

fs.writeFileSync(
    DIST_HTML,
    html,
    'utf8'
)

console.log('✓ 已生成单文件 HTML')

// ==================================================
// 8. 删除其他 Vite 构建产物
// ==================================================

const files = fs.readdirSync(DIST)

for (const file of files) {
    if (file === 'index.html') {
        continue
    }

    const target = path.join(
        DIST,
        file
    )

    fs.rmSync(target, {
        recursive: true,
        force: true
    })
}

// ==================================================
// 9. 输出结果
// ==================================================

const stats =
    fs.statSync(DIST_HTML)

console.log('')
console.log('========================================')
console.log('✓ Build 构建完成')
console.log('========================================')
console.log('')
console.log('最终文件：')
console.log(`  ${DIST_HTML}`)
console.log('')
console.log(`文件大小：${formatBytes(stats.size)}`)
console.log('')
console.log('dist 目录现在只包含：')
console.log('  index.html')
console.log('')
console.log('========================================')
console.log('')

// ==================================================
// 工具函数
// ==================================================

function escapeRegExp(string) {
    return string.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
    )
}

function formatBytes(bytes) {
    if (bytes < 1024) {
        return `${bytes} B`
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`
    }

    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}