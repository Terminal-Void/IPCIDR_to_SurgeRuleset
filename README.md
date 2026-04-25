# IPCIDR to Surge Ruleset Converter

这是一个基于 Cloudflare Workers 的无服务器脚本，用于动态获取任意公开的 IP/CIDR 列表文件，并将其转换为 Surge 支持的规则集（Ruleset）格式。

## ✨ 特性

- **智能转换**：接收任意纯文本 IP/CIDR 列表 URL，自动识别 IPv4 或 IPv6，并为其添加 `IP-CIDR,` 或 `IP-CIDR6,` 前缀。
- **自动清理**：自动过滤空行及以 `#` 开头的注释行。
- **安全鉴权**：支持基于环境变量的 Token 会话鉴权验证，防止接口被滥用。
- **全球加速**：基于 Cloudflare Workers，低延迟，高可用。
- **CORS 支持**：允许跨域请求使用，支持浏览器直接拉取。

## 🚀 部署方法

1. 安装并登录 [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) 命令行工具：
   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. 克隆本仓库并进入目录：
   ```bash
   git clone <你的仓库地址>
   cd IPCIDR_to_SurgeRuleset
   ```

3. (可选) 配置鉴权密码：
   编辑 `wrangler.toml` 文件，取消最后几行的注释，并将 `your_secret_token_here` 修改为你自己的密码：
   ```toml
   [vars]
   AUTH_TOKEN = "your_secret_token_here"
   ```

4. 部署到 Cloudflare：
   ```bash
   wrangler deploy
   ```

## 📖 使用说明

部署成功后，你会得到一个 Cloudflare Worker 的访问地址，假设为 `https://your-worker.your-subdomain.workers.dev`。

### 基础调用（未开启鉴权）

在 API 地址后加上 `?url=` 参数，指向你想要转换的原始 IP 列表。

```text
https://your-worker.your-subdomain.workers.dev/?url=https://example.com/ips.txt
```

### 开启鉴权后的调用

出于安全考虑，如果你设置了 `AUTH_TOKEN` 环境变量，那么请求时必须携带该 Token 进行验证。

**方式一：使用 URL 参数传递 Token**

```text
https://your-worker.your-subdomain.workers.dev/?url=https://example.com/ips.txt&token=你的密码
```

**方式二：通过 HTTP Header 传递 Token**

如果你通过其他脚本或工具调用，可以在 HTTP Header 中添加：

```http
Authorization: Bearer 你的密码
```

## 📝 转换示例

**原始文件 (https://example.com/ips.txt) :**
```text
# 这是一个注释
192.168.1.0/24
10.0.0.0/8

2001:db8::/32
```

**转换输出:**
```text
IP-CIDR,192.168.1.0/24
IP-CIDR,10.0.0.0/8
IP-CIDR6,2001:db8::/32
```
