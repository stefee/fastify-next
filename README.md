# fastify-next

Fastify plugin for [Next.js](https://nextjs.org/), the React framework.

This is an alternative to the official [@fastify/nextjs](https://github.com/fastify/fastify-nextjs) plugin. See [comparison](#comparison-with-fastifynextjs).

## Install

```
npm install fastify-next next react react-dom
```

## Basic Usage

If you want your Fastify server to work similar to the Next.js CLI, do the following:

```ts
import fastify from 'fastify';
import FastifyNext from 'fastify-next';

// Registering the plugin adds the 'next' decorator
await fastify.register(FastifyNext);

// Pass '*' to handle all incoming requests with Next.js
fastify.next('*');
```

## Comparison with @fastify/nextjs

For the most part, this package will work as a drop-in replacement for [@fastify/nextjs](https://github.com/fastify/fastify-nextjs). However, there are a few differences.

### `_next/*` route handling

By default **@fastify/nextjs** handles all incoming requests to `/_next/*`. To mimic this behaviour with **fastify-next**, add the following:

```ts
fastify.next('/_next/*');
```

### under-pressure

The **@fastify/nextjs** plugin includes [under-pressure](https://www.npmjs.com/package/under-pressure) as a dependency which can be enabled by passing the `underPressure: true` option. This package does not currently include support for under-pressure.

### Fastify v4

This plugin supports Fastify v4. 🎉

Support in the official plugin is [currently pending](https://github.com/fastify/fastify-nextjs/issues/557).

### Startup time during local dev

Next.js type-checks and compiles the application when the dev server first starts. The **@fastify/nextjs** plugin waits for the Next.js server to finish doing this before resolving plugin initialization. This can lead to [plugin timeout](https://www.fastify.io/docs/latest/Reference/Server/#plugintimeout) in [large Next.js projects](https://github.com/fastify/fastify-nextjs#plugin-timeout-and-nextjs-development-mode).

This plugin initializes **immediately**, allowing you to make requests to the Fastify server immediately, but will wait for Next.js to complete startup before handling incoming requests.

Note: this has **no effect in production**. The dev server can be enabled using the `dev: true` option or setting `NODE_ENV=development` in the environment.
