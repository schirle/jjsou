// 插件注册表：name -> search(kw, {timeoutMs}) => [{id,title,datetime,links:[{type,url,password}]}]

import * as hunhepan from './hunhepan.js';
import * as jikepan from './jikepan.js';
import * as qupansou from './qupansou.js';
import * as pansearch from './pansearch.js';
import * as pan666 from './pan666.js';
import * as ouge from './ouge.js';

export const PLUGINS = {
  hunhepan,
  jikepan,
  qupansou,
  pansearch,
  pan666,
  ouge
};

export const DEFAULT_PLUGINS = Object.keys(PLUGINS);
