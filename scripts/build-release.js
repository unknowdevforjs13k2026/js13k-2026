import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const RELEASE = path.join(ROOT, 'release')

const DIST_HTML = path.join(DIST, 'index.html')
const RELEASE_HTML = path.join(RELEASE, 'index.html')

console.log('')
console.log('========================================')
console.log(' Thunder Unicorn 13 - Release Builder')
console.log('========================================')
console.log('')

// --------------------------------------------------
// 1. 检查 Vite 构建结果
// --------------------------------------------------

if (!fs.existsSync(DIST_HTML)) {
    console.error('❌ 找不到 dist/index.html')
    console.error('   请先执行：npm run build')
    process.exit(1)
}

console.log('✓ 找到 dist/index.html')

// --------------------------------------------------
// 2. 读取 Vite 生成的 HTML
// --------------------------------------------------

let html = fs.readFileSync(DIST_HTML, 'utf8')

// --------------------------------------------------
// 3. 将外部 CSS 内嵌进 HTML
// --------------------------------------------------

const cssRegex = /<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi

const cssFiles = []
let match

while ((match = cssRegex.exec(html)) !== null) {
    cssFiles.push(match[1])
}

for (const cssUrl of cssFiles) {
    const relativePath = cssUrl.replace(/^\.?\//, '')
    const cssPath = path.join(DIST, relativePath)

    if (!fs.existsSync(cssPath)) {
        console.warn(`⚠️ CSS 文件不存在：${cssPath}`)
        continue
    }

    const css = fs.readFileSync(cssPath, 'utf8')

    const styleTag = `<style>\n${css}\n</style>`

    html = html.replace(
        new RegExp(
            `<link[^>]+href=["']${escapeRegExp(cssUrl)}["'][^>]*>`,
            'i'
        ),
        styleTag
    )

    console.log(`✓ 内嵌 CSS：${relativePath}`)
}

// --------------------------------------------------
// 4. 将外部 JS 内嵌进 HTML
// --------------------------------------------------

const jsRegex = /<script([^>]+)src=["']([^"']+\.js)["']([^>]*)><\/script>/gi

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
    const relativePath = script.src.replace(/^\.?\//, '')
    const jsPath = path.join(DIST, relativePath)

    if (!fs.existsSync(jsPath)) {
        console.warn(`⚠️ JS 文件不存在：${jsPath}`)
        continue
    }

    const js = fs.readFileSync(jsPath, 'utf8')

    // Vite 输出的是模块代码。
    // 这里保留 type="module"，让浏览器按照模块方式执行。
    const scriptTag =
        `<script type="module">\n` +
        `${js}\n` +
        `</script>`

    html = html.replace(script.full, scriptTag)

    console.log(`✓ 内嵌 JS：${relativePath}`)
}

// --------------------------------------------------
// 5. 清理 release 目录
// --------------------------------------------------

if (fs.existsSync(RELEASE)) {
    fs.rmSync(RELEASE, {
        recursive: true,
        force: true
    })
}

fs.mkdirSync(RELEASE, {
    recursive: true
})

// --------------------------------------------------
// 6. 写入最终 HTML
// --------------------------------------------------

fs.writeFileSync(
    RELEASE_HTML,
    html,
    'utf8'
)

// --------------------------------------------------
// 7. 输出结果
// --------------------------------------------------

const stats = fs.statSync(RELEASE_HTML)

console.log('')
console.log('========================================')
console.log('✓ Release 构建完成')
console.log('========================================')
console.log('')
console.log(`输出文件：`)
console.log(`  ${RELEASE_HTML}`)
console.log('')
console.log(`文件大小：${formatBytes(stats.size)}`)
console.log('')
console.log('现在可以直接双击：')
console.log('  release/index.html')
console.log('')
console.log('========================================')
console.log('')

// --------------------------------------------------
// 工具函数
// --------------------------------------------------

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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