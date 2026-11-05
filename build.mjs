// 把 functions/ 下的模块打包成单文件 Worker（dist/worker.js），
// 便于在 Cloudflare 控制台「编辑代码」里直接粘贴部署（无需 wrangler / Git）。
// 用法：node build.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

// 顺序 = 依赖顺序；每个模块被包进独立闭包，避免内部函数重名
const MODULES = [
  ['functions/_lib/regex.js', '__R'],
  ['functions/_lib/http.js', '__H'],
  ['functions/_lib/tg.js', '__TG'],
  ['functions/_lib/plugins/hunhepan.js', '__P_hunhepan'],
  ['functions/_lib/plugins/jikepan.js', '__P_jikepan'],
  ['functions/_lib/plugins/qupansou.js', '__P_qupansou'],
  ['functions/_lib/plugins/pansearch.js', '__P_pansearch'],
  ['functions/_lib/plugins/pan666.js', '__P_pan666'],
  ['functions/_lib/plugins/ouge.js', '__P_ouge'],
  ['functions/_lib/plugins/index.js', '__PIndex']
];

const MAIN = 'functions/_worker.js';

// 文件名 -> 命名空间变量名
const NS = new Map(MODULES.map(([file, ns]) => [file.split('/').pop(), ns]));

function nsOf(spec) {
  const base = spec.split('/').pop();
  const ns = NS.get(base);
  if (!ns) throw new Error('未知模块引用: ' + spec);
  return ns;
}

// 重写 import，收集具名导出
function transform(code, label = '', allowDefault = false) {
  code = code.replace(/^\s*import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"];?\s*$/gm,
    (_, name, spec) => `const ${name} = ${nsOf(spec)};`);

  code = code.replace(/^\s*import\s*\{([^}]*)\}\s*from\s+['"]([^'"]+)['"];?\s*$/gm,
    (_, names, spec) => `const {${names}} = ${nsOf(spec)};`);

  const exports = [];
  code = code.replace(/^export\s+(const|let|var|async\s+function|function|class)\s+(\w+)/gm,
    (_, kind, name) => {
      exports.push(name);
      return `${kind} ${name}`;
    });

  if (!allowDefault && /^export\s+default/m.test(code)) {
    throw new Error('被包装的模块不应包含 export default: ' + label);
  }

  return { code, exports };
}

const parts = [];

// 内联首页，供单文件 Worker 直接返回
const html = readFileSync('index.html', 'utf8');
parts.push('// 由 build.mjs 生成，请勿直接编辑；改动请改 functions/ 下的源码后重新打包\n');
parts.push('const INDEX_HTML = ' + JSON.stringify(html) + ';\n');

for (const [file, ns] of MODULES) {
  const { code, exports } = transform(readFileSync(file, 'utf8'), file);
  parts.push(`// ---- ${file} ----`);
  parts.push(`const ${ns} = (() => {`);
  parts.push(code);
  parts.push(`return { ${exports.join(', ')} };`);
  parts.push(`})();\n`);
}

// 入口模块放在顶层，保留 export default
const main = transform(readFileSync(MAIN, 'utf8'), MAIN, true).code;
parts.push('// ---- ' + MAIN + ' ----');
parts.push(main);

mkdirSync('dist', { recursive: true });
const out = parts.join('\n');
writeFileSync('dist/worker.js', out, 'utf8');

console.log('已生成 dist/worker.js，大小 ' + (out.length / 1024).toFixed(1) + ' KB');
