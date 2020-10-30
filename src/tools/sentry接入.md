### 安装

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

2. 使用 `pip3` 安装 `docker-compose`
   > Compose 是用于定义和运行多容器 Docker 应用程序的工具。通过 Compose，您可以使用 YML 文件来配置应用程序需要的所有服务。然后，使用一个命令，就可以从 YML 文件配置中创建并启动所有服务。

```bash
# 安装 docker-compose 当前文档版本
# 方式一：这种方式不太推荐，github目前下载实在是太慢了
curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 方式二：通过 pip3 工具，方便快捷
pip3 install -U docker-compose
```

### sentry 安装

1. 拉取源码 [onpremise](https://github.com/getsentry/onpremise)
```bash
# 拉取源码
git clone https://github.com/getsentry/onpremise.git

# 切换到最新版本
git checkout releases/20.10.1
```
2. 
