---
title: Cloudflare Workers
---
Cloudflare workers are `serverless` applications that can run in the [Cloudflare's global network ↗](https://www.cloudflare.com/network) , each of the cloudflare machines host an instance of the Workers runtime.

Under the hood Workers use [V8 engine](https://www.cloudflare.com/learning/serverless/glossary/what-is-chrome-v8/) and implements many of standard [APIs](https://developers.cloudflare.com/workers/runtime-apis/) that the modern browser have. Workers use [Isolates](https://v8docs.nodesource.com/node-0.8/d5/dda/classv8_1_1_isolate.html) a feature that allow run isolated instances of V8 engine,  [V8](https://v8docs.nodesource.com/node-0.8/df/d43/classv8_1_1_v8.html) isolates have completely separate states.

> isolates: lightweight contexts that provide your code with variables it can access and a safe environment to be executed within.

A single instance of the runtime can run hundreds or thousands of isolates, seamlessly switching between them. Each isolate's memory is completely isolated, so each piece of code is protected from other untrusted or user-written code on the runtime. Isolates are also designed to start very quickly. Instead of creating a virtual machine for each function, an isolate is created within an existing environment. This model eliminates the cold starts of the virtual machine model.
![[Pasted image 20250413215400.png]]

<img src="{{ site.baseurl }}/assets/attachments/Pasted image 20250413215400.png"/>

## Handlers
Cloudflare workers use `Handlers` for manage the incoming external inputs.
> Handlers are methods on Workers that can receive and process external inputs, and can be invoked from outside your Worker.

```js
// fetch handler
export default {
	async fetch(request, env, ctx) {
		return new Response('Hello World!');
	},
};
```

Example with `scheduled() handler`
> When a Worker is invoked via a [Cron Trigger](https://developers.cloudflare.com/workers/configuration/cron-triggers/), the `scheduled()` handler handles the invocation.

```js
export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(doSomeTaskOnASchedule());
  },
};
```
