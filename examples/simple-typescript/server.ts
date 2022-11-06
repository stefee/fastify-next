import Fastify from "fastify";
import FastifyNext from "fastify-next";

async function init() {
  const fastify = Fastify({ logger: true, disableRequestLogging: true });
  await fastify.register(FastifyNext);
  fastify.next("*");
  await fastify.listen({ port: 3000, host: "127.0.0.1" });
}

init().catch((error) => {
  console.error(error);
  process.exit(1);
});
