import type { FastifyInstance, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import next from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

declare module "fastify" {
  interface FastifyInstance {
    next(path: string): void;
  }

  interface FastifyReply {
    render(path: string): Promise<void>;
    renderError(error: Error | null): Promise<void>;
  }
}

function setRawHeaders(reply: FastifyReply) {
  for (const [headerName, headerValue] of Object.entries(reply.getHeaders())) {
    if (headerValue) {
      reply.raw.setHeader(headerName, headerValue);
    }
  }
}

function fastifyNext(
  fastify: FastifyInstance,
  options: Parameters<typeof next>[0]
) {
  const nextServer = next({
    dev: process.env.NODE_ENV !== "production",
    ...options,
  });
  const nextRequestHandler = nextServer.getRequestHandler();
  const preparePromise = nextServer.prepare();

  fastify.addHook("onClose", async function () {
    await preparePromise;
    return nextServer.close();
  });

  fastify.decorate("next", function (path: string) {
    fastify.all(path, async function (request, reply) {
      await preparePromise;
      setRawHeaders(reply);
      await reply.hijack();
      await nextRequestHandler(request.raw, reply.raw);
    });
  });

  fastify.decorateReply("render", async function (path: string) {
    await preparePromise;
    await this.hijack();
    setRawHeaders(this);
    await nextServer.render(
      this.request.raw,
      this.raw,
      path,
      this.request.query as NextParsedUrlQuery
    );
  });

  fastify.decorateReply("renderError", async function (error: Error | null) {
    await preparePromise;
    await this.hijack();
    setRawHeaders(this);
    await nextServer.renderError(
      error,
      this.request.raw,
      this.raw,
      this.request.url,
      this.request.query as NextParsedUrlQuery
    );
  });
}

export default fp(fastifyNext, {
  fastify: "4.x",
  name: "fastify-next",
});
