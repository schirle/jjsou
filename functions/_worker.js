// 网盘聚合搜索 API（Cloudflare Pages Functions）
// 功能对齐 fish2018/pansou（MIT）的搜索聚合：TG 频道 + 多插件并发搜索，
// 合并去重后按网盘类型归类输出。无需 Docker / 常驻服务器。
//
// 路由：
//   GET /api/search?kw=关键词[&cloud_types=quark,uc][&src=all|tg|plugin][&channels=a,b][&plugins=a,b][&refresh=1][&debug=1]
//   GET /api/health
// 出参：{ code, message, data: { total, merged_by_type: { quark: [{url,password,note,datetime}] } } }
//
// Cloudflare 变量：
//   TG_CHANNELS        TG 频道列表（可选，逗号分隔；不配用内置默认）
//   PLUGINS            启用的插件（可选，逗号分隔；不配用内置全部）
//   SEARCH_TIMEOUT_MS  单个上游请求超时毫秒（可选，默认 8000）
//   CACHE_TTL_SECONDS  搜索结果缓存秒数（可选，默认 1800）

import { searchTG } from './_lib/tg.js';
import { PLUGINS, DEFAULT_PLUGINS } from './_lib/plugins/index.js';
import { getLinkType, cutTitle, ZERO_TIME } from './_lib/regex.js';

// 内置默认 TG 频道（与 pansou 默认配置一致，可用 TG_CHANNELS 变量覆盖）
const DEFAULT_TG_CHANNELS = [
  'tgsearchers2', 'Aliyun_4K_Movies', 'yunpanx', 'yp123pan', 'yunpanxunlei', 'tianyifc',
  'BaiduCloudDisk', 'txtyzy', 'peccxinpd', 'gotopan', 'PanjClub', 'kkxlzy', 'baicaoZY',
  'MCPH01', 'bdwpzhpd', 'ysxb48', 'yggpan', 'MCPH086', 'zaihuayun', 'Q66Share',
  'Oscar_4Kmovies', 'ucwpzy', 'shareAliyun', 'alyp_1', 'dianyingshare', 'Quark_Movies',
  'XiangxiuNBB', 'ydypzyfx', 'ucquark', 'xx123pan', 'zyfb123', 'tyypzhpd', 'tianyirigeng',
  'cloudtianyi', 'hdhhd21', 'Lsp115', 'oneonefivewpfx', 'qixingzhenren', 'taoxgzy',
  'Channel_Shares_115', 'vip115hot', 'yunpan139', 'yunpan189', 'yunpanuc', 'leoziyuan',
  'pikpakpan', 'Q_dongman'
];

// Workers 免费版单请求最多 50 个子请求，频道数需给插件留余量
const MAX_CHANNELS = 32;

function parseList(v) {
  return String(v || '').split(/[\s,，;；]+/).map(s => s.trim()).filter(Boolean);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// 合并去重：URL 为唯一键，重复时保留时间更新的；按网盘类型分组
function mergeByType(resultGroups, wantedTypes) {
  const byUrl = new Map();

  for (const group of resultGroups) {
    for (const r of group.items) {
      const title = cutTitle(r.title || '');
      for (const link of r.links || []) {
        if (!link.url) continue;
        const datetime = link.datetime || r.datetime || ZERO_TIME;
        const prev = byUrl.get(link.url);
        if (!prev) {
          byUrl.set(link.url, {
            type: link.type || getLinkType(link.url),
            url: link.url,
            password: link.password || '',
            note: title,
            datetime
          });
        } else {
          // 更新的记录覆盖时间/提取码，标题取先到的非空值
          if (datetime > prev.datetime) prev.datetime = datetime;
          if (!prev.password && link.password) prev.password = link.password;
          if (!prev.note && title) prev.note = title;
        }
      }
    }
  }

  const merged = {};
  let total = 0;
  for (const e of byUrl.values()) {
    if (wantedTypes && !wantedTypes.has(e.type)) continue;
    (merged[e.type] || (merged[e.type] = [])).push({
      url: e.url, password: e.password, note: e.note, datetime: e.datetime
    });
    total += 1;
  }

  // 按固定类型顺序输出，保证结构稳定
  const order = ['baidu', 'aliyun', 'quark', 'tianyi', 'uc', 'mobile', '115', 'xunlei', '123', 'pikpak', 'magnet', 'ed2k', 'guangya', 'others'];
  const merged_by_type = {};
  for (const t of order) {
    if (merged[t]?.length) merged_by_type[t] = merged[t];
  }
  return { total, merged_by_type };
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
    }

    const url = new URL(request.url);
    const sp = url.searchParams;
    const startedAt = Date.now();

    // GET /api/health
    if (url.pathname === '/api/health') {
      const plugins = parseList(env.PLUGINS).filter(p => PLUGINS[p]);
      return json({
        code: 0, message: 'success',
        data: {
          plugins: plugins.length ? plugins : DEFAULT_PLUGINS,
          channels: parseList(env.TG_CHANNELS).length || DEFAULT_TG_CHANNELS.length
        }
      });
    }

    if (url.pathname !== '/api/search') {
      // 非 API 路径：优先 Pages 静态资源（env.ASSETS），
      // 单文件 Worker 形态下没有 ASSETS，直接返回内联的 index.html
      if (env.ASSETS && (request.method === 'GET' || request.method === 'HEAD')) {
        return env.ASSETS.fetch(request);
      }
      if (typeof INDEX_HTML === 'string' && (url.pathname === '/' || url.pathname === '/index.html')) {
        return new Response(INDEX_HTML, {
          headers: { 'Content-Type': 'text/html;charset=utf-8' }
        });
      }
      return json({ code: 404, message: 'not found', data: null }, 404);
    }

    const kw = (sp.get('kw') || sp.get('word') || '').trim();
    if (!kw) return json({ code: 400, message: '缺少 kw 参数', data: null }, 400);

    // 缓存（refresh=1 跳过读取；debug 响应不缓存；本地 node 无 caches，自动降级）
    const cache = globalThis.caches?.default;
    const refresh = ['1', 'true'].includes(sp.get('refresh'));
    const debug = sp.get('debug') === '1';
    if (cache && !refresh && !debug) {
      const hit = await cache.match(request);
      if (hit) return hit;
    }

    const src = sp.get('src') || 'all';
    const timeoutMs = Math.min(Math.max(Number(env.SEARCH_TIMEOUT_MS) || 8000, 2000), 25000);

    // 频道与插件清单
    const channels = (sp.get('channels') ? parseList(sp.get('channels')) : (parseList(env.TG_CHANNELS).length ? parseList(env.TG_CHANNELS) : DEFAULT_TG_CHANNELS)).slice(0, MAX_CHANNELS);
    const pluginNames = (sp.get('plugins') ? parseList(sp.get('plugins')) : (parseList(env.PLUGINS).length ? parseList(env.PLUGINS) : DEFAULT_PLUGINS))
      .filter(p => PLUGINS[p]);

    // 并发搜索：TG 一路 + 各插件一路，全部并行，单路失败不影响整体
    // TG 频道单独用更短的超时（t.me 正常响应很快，挂住的多为被墙/限流）
    const jobs = [];
    if (src !== 'plugin' && channels.length) {
      const tgTimeout = Math.min(timeoutMs, 5000);
      jobs.push(searchTG(kw, channels, tgTimeout).then(items => ({ name: 'tg', items })));
    }
    if (src !== 'tg') {
      for (const name of pluginNames) {
        jobs.push(
          PLUGINS[name].search(kw, { timeoutMs })
            .then(items => ({ name, items }))
            .catch(e => ({ name, items: [], error: String(e?.message || e) }))
        );
      }
    }

    const settled = await Promise.allSettled(jobs);
    const groups = [];
    const stats = [];
    for (const s of settled) {
      if (s.status === 'fulfilled') {
        groups.push(s.value);
        stats.push({ source: s.value.name, count: s.value.items.length, error: s.value.error || '' });
      } else {
        stats.push({ source: 'unknown', count: 0, error: String(s.reason?.message || s.reason) });
      }
    }

    // cloud_types 过滤（网盘类型名，如 quark,uc,115）
    const requestedTypes = parseList(sp.get('cloud_types')).map(s => s.toLowerCase());
    const wantedTypes = requestedTypes.length ? new Set(requestedTypes) : null;

    const { total, merged_by_type } = mergeByType(groups, wantedTypes);

    const data = { total, merged_by_type };
    if (debug) {
      data.took_ms = Date.now() - startedAt;
      data.sources = stats;
    }

    const resp = json({ code: 0, message: 'success', data });
    resp.headers.set('Cache-Control', 'public, max-age=' + Math.min(Math.max(Number(env.CACHE_TTL_SECONDS) || 1800, 60), 86400));
    if (cache) ctx?.waitUntil(cache.put(request, resp.clone()));
    return resp;
  }
};
