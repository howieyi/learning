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


