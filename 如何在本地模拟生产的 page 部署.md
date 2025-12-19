1. build
```shell
npx @cloudflare/next-on-pages
```
2. run
```shell
npx wrangler pages dev .vercel/output/static --compatibility-flag=nodejs_compat
```