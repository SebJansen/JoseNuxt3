<template>
  <h1 id="reproduction-of-problem">Reproduction of problem</h1>
  <h2 id="runs-locally-in-node">Runs locally in node</h2>
  <ul>
    <li><code>npm i</code></li>
    <li><code>npm run dev</code></li>
    <li>Go to <code>http://127.0.0.1:3000/api/login</code></li>
  </ul>
  <h2 id="fails-to-build-for-cf-workers">Fails to build for CF Workers</h2>
  <ul>
    <li><code>npm i</code></li>
    <li><code>NITRO_PRESET=cloudflare npm run build</code></li>
  </ul>
  <h1 id="the-library">The library</h1>
  <p>I&#39;m trying to build a project for Cloudflare Workers, a project which uses the <code>panva/jose</code> JWT-library.
    <code>panva/jose</code> is the only library (AFAIK) which will allow me to do a wide variety of JWT-related tasks, on a wide variety of platforms. Tasks include encrypting, decrypting, signing and verifying tokens. Platforms like CF workers, Deno, Node, Browser.</p>
  <h1 id="the-error-message">The error message</h1>
  <p>When I build with <code>NITRO_PRESET=cloudflare</code>, it builds in the node environment, which makes sense because that is what is available locally. However, it crashes with the following error: <code>&#39;randomFillSync&#39; is not exported by node_modules/unenv/runtime/mock/proxy.mjs, imported by node_modules/jose/dist/node/esm/runtime/random.js</code></p>
  <h1 id="reflection">Reflection</h1>
  <p>This, I find strange because <code>panva/jose</code> only uses <code>randomFillSync</code> on the node platform, but I only want to build for the CF Workers-runtime, which is (AFAIK) at least compatible with the browser runtime, which <code>panva/jose</code> supports (see the two links below for proof).</p>
  <ul>
    <li><a href="https://github.com/panva/jose/blob/main/src/runtime/node/random.ts">https://github.com/panva/jose/blob/main/src/runtime/node/random.ts</a></li>
    <li><a href="https://github.com/panva/jose/blob/main/src/runtime/browser/random.ts">https://github.com/panva/jose/blob/main/src/runtime/browser/random.ts</a></li>
  </ul>
  <p>I get the error only when my project calls <code>signJWT</code> from <code>panva/jose</code>.</p>
  <h1 id="a-few-rough-hypotheses">A few rough hypotheses</h1>
  <ul>
    <li><code>unenv</code> does some magic, and requires something to be polyfilled or mocked in order to be able to build with <code>panva/jose</code></li>
    <li><code>unenv</code> doesn&#39;t find and pick the runtime-specific code from <code>panva/jose/runtime/browser</code>, instead defaulting to the node-specific one</li>
    <li>Nuxt builds the project under the local node-runtime, and therefore picks <code>panva/jose/runtime/node</code>, but then <code>unenv</code> comes in and fails with the message that runtime-specific code from node will absolutely not work on deployment target cloudflare</li>
  </ul>
</template>
