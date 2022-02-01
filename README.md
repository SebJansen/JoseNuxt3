# Reproduction of problem

## Runs locally in node

- `npm i`
- `npm run dev`
- Go to `http://127.0.0.1:3000/api/login`

## Fails to build for CF Workers 
- `npm i`
- `NITRO_PRESET=cloudflare npm run build`

# The library

I'm trying to build a project for Cloudflare Workers, a project which uses the `panva/jose` JWT-library.
`panva/jose` is the only library (AFAIK) which will allow me to do a wide variety of JWT-related tasks, on a wide variety of platforms. Tasks include encrypting, decrypting, signing and verifying tokens. Platforms like CF workers, Deno, Node, Browser.

# The error message

When I build with `NITRO_PRESET=cloudflare`, it builds in the node environment, which makes sense because that is what is available locally. However, it crashes with the following error: `'randomFillSync' is not exported by node_modules/unenv/runtime/mock/proxy.mjs, imported by node_modules/jose/dist/node/esm/runtime/random.js`

# Reflection

This, I find strange because `panva/jose` only uses `randomFillSync` on the node platform, but I only want to build for the CF Workers-runtime, which is (AFAIK) at least compatible with the browser runtime, which `panva/jose` supports (see the two links below for proof).
- https://github.com/panva/jose/blob/main/src/runtime/node/random.ts
- https://github.com/panva/jose/blob/main/src/runtime/browser/random.ts

I get the error only when my project calls `signJWT` from `panva/jose`.

# A few rough hypotheses
- `unenv` does some magic, and requires something to be polyfilled or mocked in order to be able to build with `panva/jose`
- `unenv` doesn't find and pick the runtime-specific code from `panva/jose/runtime/browser`, instead defaulting to the node-specific one
- Nuxt builds the project under the local node-runtime, and therefore picks `panva/jose/runtime/node`, but then `unenv` comes in and fails with the message that runtime-specific code from node will absolutely not work on deployment target cloudflare
