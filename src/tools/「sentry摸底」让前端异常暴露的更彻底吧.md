## 本地化环境搭建

### 必备条件

1. 空闲内存大于 2G 的服务器环境，sentry 基本配置需要占用至少 2G 内存
2. docker 环境，新版本需要 docker 版本大于 18+

### 安装 docker 环境

> 官方提供本地化安装，需要以 `docker` 启动

1. 安装 `docker`

```bash
# 官方安装脚本
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

2. 运行环境需要支持 `Python3`，默认环境为 `Python2.7`

```bash
# 使用 yum 安装，默认 python3 会自带 pip3
yum install -y python3
```

3. 使用 `pip3` 安装 `docker-compose`   
> Compose 是用于定义和运行多容器 Docker 应用程序的工具。通过 Compose，您可以使用 YML 文件来配置应用程序需要的所有服务。然后，使用一个命令，就可以从 YML 文件配置中创建并启动所有服务。

```bash
# 安装 docker-compose 当前文档版本
# 方式一：这种方式不太推荐，github目前下载实在是太慢了
curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 方式二：通过 pip3 工具，方便快捷
pip3 install -U docker-compose
```

4. 在之后的 sentry 安装过程中发现依赖 docker 版本需要在`18+`版本以上

> 我的服务器默认 yum 安装 docker 版本为 13，这里附上 docker 升级踩坑指南

```bash
# docker 要求 centOS版本 3.10+
# 1. 查看内核版本
uname -a

# 2. 移除旧版 docker
yum remove docker docker-common docker-selinux docker-engine

# 3. 安装相关需要的依赖包，yum-utils 包含 yum-config-manager，用于设置镜像源
yum install -y yum-utils device-mapper-persistent-data lvm2

# 4. 设置镜像源
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 5. 安装 docker-ce 默认安装的是最新稳定版，这个下载比较慢，容易断，安装了好几次才安装完成
yum install docker-ce
```

### sentry 安装

1. 拉取源码 [onpremise](https://github.com/getsentry/onpremise)

```bash
# 拉取源码
git clone https://github.com/getsentry/onpremise.git
```

2. 新版本安装比以前简单太多，只需要执行 `./install.sh` 即可

```bash
# 此过程将初始化所有过程，数据库，集群等等
./install.sh
```

3. 启动

```bash
# 默认端口 9000
docker-compose up -d

# 重启所有内容
docker-compose restart

# 本地简单测试
curl 127.0.0.1:9000
```

4. 故障排除

```bash
docker-compose logs <service-name>
```

5. nginx 代理 9000 端口，对外访问

```bash
server {
   listen       80;
   server_name  sentry.example.com;

	location / {
            proxy_set_header       Host $host;
            proxy_set_header       X-Real-IP remote_addr;
            proxy_set_header       X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass             http://127.0.0.1:9000;
   }
}
```

### 本地化小结
1. sentry 整体继承了非常多的工具（`memcached`/`redis`/`postgres`/`zookeeper`/`kafka`/`clickhouse`...），非常庞大，这也是其需要至少2G内存支持的原因了，并且适合集群部署；
2. 本地化部署慎重考虑后期维护成本
3. 基本使用其实直接使用线上的就足够了

## 前端接入 [sentry.io](https://sentry.io)

### 基本流程

> 这里采用外网 `github` 账号方式登入

1. [sentry.io](https://sentry.io) 登入，使用 `github` 方式登入；
2. 新建组织
3. 新建项目
4. 前端代码引入
   > 在 `sentry` 中有范例，这里为了不影响主程序加载，改为异步引入方式

- 主代码文件 `a.js`，这里放入 sentry 对应引入代码

```javascript
// 这里以 react 项目为例
// 官方采用的是 *，这里改为 tree shaking 部分引入方式
import { init } from "@sentry/react";
import { Integrations } from "@sentry/tracing";

const isDev = false; // 开发环境 or 测试环境
const sdn = "新建项目中 dsn 配置";

export default function initSentry() {
  init({
    // 版本号，这里的 release 需要与后续 webpack 上传的版本号一致
    release: `${release}`,
    // 这里可以定义 环境变量，用作区分不同环境 比如 SIT/UAT/PROD，定义后再 sentry 中可以对应用作筛选
    environment: `${environment}`,
    dsn: `${dsn}`,
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}
```

- 异步引入代码

```javascript
const isDev = false; // 开发环境 or 测试环境

/**
 * 初始化平台 sentry
 */
export const initAsyncSentry = () =>
  // 生产环境引入
  !isDev && import(/* webpackChunkName: "sentry" */ "./a").then(res => res.default());
```

- 到这里前端的日志基本已经可以进行采集，但是到这里还没有使用到 sentry 的强大功能，错误日志还没办法定位到源开发代码；

5. 上传 sourceMap 到 sentry，借此定位到具体的开发错误代码

- 项目 webpack 打包生产环境需要 sourceMap 模式
  > 这里需要注意不要把生成的 map 文件上传到生产环境服务器，相当于泄漏了代码的文件模块结构了

```javascript
// 1. 生产配置中，设置 devtool 为 hidden-source-map
// 这样打包产物中会对应生成 map 文件

// 2 生成配置打包压缩的时候，设置 sourceMap 为 true
// 压缩打包的文件
new TerserWebpackPlugin({
  cache: false,
  parallel: true, // 启用并行化
  // 这里设置 sourceMap 为 true 即可生成对应的配置文件
  sourceMap: true,
  terserOptions: {
    ecma: 5,
    warnings: false,
    compress: {
      drop_debugger: true,
      drop_console: true,
    },
    output: {
      comments: false,
    },
  },
});
```

- 上传 sourceMap 到 sentry
  
> 1. authToken 推荐在 sentry 中自己新建，`Settings -> Account -> API -> Auth Tokens`（这里主要考虑到多项目多环境多权限管理的问题，可以自定义）
> 2. `${org}` 对应在 `settings -> General Settings` 中的 `Organization Slug` 属性，可以自定义；
> 3. `${project}` 对应在 对应项目中 `General Settings` 中的姓名属性，可以自定义；
> 4. `${release}` 这里需要自定义版本号，用作区分和定位每个版本的错误；

```javascript
// 使用 sentry 官方提供的 webpack 插件
const SentryWebpackPlugin = require("@sentry/webpack-plugin");

// 追加 plugins 配置到 webpack 配置中
new SentryWebpackPlugin({
  authToken: `${authToken}`,
  org: `${org}`,
  project: `${project}`,
  release: `${release}`, // 每次发布的版本号
  // 不显示日志
  silent: true,
  // webpack specific configuration
  include: "dist",
});
```

- 代码托管到 sentry，目前 sentry 支持的仓库管理有 `Github/GitLab/Bitbucket/Azure DevOps`，对应安装插件，绑定好代码即可
> 到这一步成功之后，sentry 即可帮您做到错误定位到具体代码了

### 小结

1. sentry 新建组织、项目（用作引入 sentry 错误抓取代码）
2. webpack 生产打包支持 sourceMap（用作错误定位到具体源码）
3. 上传 map 文件到 sentry 平台（@sentry/webpack-plugin）
