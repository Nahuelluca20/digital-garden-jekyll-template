---
title: Rendering in Next.js
tags:
  - programming
  - web
publishedAt: 2025-03-18
summary: '"Types of renders in Next.js"'
---

## Static Rendering

The routes are rendered at build time or in the background after [data revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

> Data revalidation is a technique used in Incremental Static Regeneration (ISR) that allow us revalidate data after a user action, for example a click in a submit button

The result of this rendered is cached and can be pushed to a **CDN** (Content Delivery Network).

## Dynamic Rendering

With Dynamic Rendering, routes are rendered for each user at **request time**.

### Switching to Dynamic Rendering

During rendering, if a [Dynamic API](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-apis) or a [fetch](https://nextjs.org/docs/app/api-reference/functions/fetch) option of `{ cache: 'no-store' }` is discovered, Next.js will switch to dynamically rendering the whole route.

- [`cookies`](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [`headers`](https://nextjs.org/docs/app/api-reference/functions/headers)
- [`connection`](https://nextjs.org/docs/app/api-reference/functions/connection)
- [`draftMode`](https://nextjs.org/docs/app/api-reference/functions/draft-mode)
- [`searchParams` prop](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional)
- [`unstable_noStore`](https://nextjs.org/docs/app/api-reference/functions/unstable_noStore)

## Streaming

Streaming enables you to progressively render UI from the server. Work is split into chunks and streamed to the client as it becomes ready.

## Server Components

For use this strategies Next.js have a `Server Components`

> React Server Components allow you to write UI that can be rendered and optionally cached on the server.

### How are Server Components rendered?

1. React renders Server Components into a special data format called the **React Server Component Payload (RSC Payload)**.
2. Next.js uses the RSC Payload and Client Component JavaScript instructions to render **HTML** on the server.

Then, on the client:

1. The HTML is used to immediately show a fast non-interactive preview of the route - this is for the initial page load only.
2. The React Server Components Payload is used to reconcile the Client and Server Component trees, and update the DOM.
3. The JavaScript instructions are used to [hydrate](https://react.dev/reference/react-dom/client/hydrateRoot) Client Components and make the application interactive.

> The RSC Payload is a compact binary representation of the rendered React Server Components tree. It's used by React on the client to update the browser's DOM. The RSC Payload contains:
>
> - The rendered result of Server Components
> - Placeholders for where Client Components should be rendered and references to their JavaScript files
> - Any props passed from a Server Component to a Client Component

## Client components

The UI of `client components` are pre-rendered on the server and then use client JavaScript to run in the browser.

### Full page vs Subsequent Navigations

At the first user navigation Next.js will use React's APIs to render a static HTML preview on the server for both Client and Server Components. On subsequent navigations, Client Components are rendered entirely on the client, without the server-rendered HTML.

For use `client components` we need to put the `"use client"` directive at the top of a file with this we already for use client stuff like Hooks, Event, etc

```js
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## Server Actions

[Server Actions](https://react.dev/reference/rsc/server-actions) are **asynchronous functions** that are executed on the server. They can be called in Server and Client Components to handle form submissions and data mutations in Next.js applications. See [[Data fetching in Next.js]]

For use these functions on the cliente you want to use the directive `"use server"` at the top a file or above of function

```js
// app/actions.js
"use server";

export async function create() {}
```

```js
export default function Page() {
  // Server Action
  async function create() {
    "use server";
    // Mutate data
  }

  return "...";
}
```
