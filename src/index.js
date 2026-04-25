export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 环境变量鉴权：如果配置了 AUTH_TOKEN，则校验
    const expectedToken = env.AUTH_TOKEN;
    if (expectedToken) {
      const providedToken = url.searchParams.get('token') || request.headers.get('Authorization')?.replace('Bearer ', '');
      if (providedToken !== expectedToken) {
        return new Response('未授权访问: Token 无效', { 
          status: 401,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    }

    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response('请提供 url 参数，例如: ?url=https://example.com/ips.txt', { 
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    try {
      const response = await fetch(targetUrl);
      if (!response.ok) {
        return new Response(`无法获取目标文件，HTTP 状态码: ${response.status}`, { status: 502 });
      }

      const text = await response.text();
      const surgeRuleset = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'))
        .map(line => `IP-CIDR,${line}`)
        .join('\n');

      return new Response(surgeRuleset, {
        headers: { 
          'Content-Type': 'text/plain; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'max-age=3600'
        }
      });
    } catch (error) {
      return new Response(`处理过程中发生错误: ${error.message}`, { status: 500 });
    }
  }
};