---
title: Routing in Next.js
publishedAt: 2025-03-17
tags:
  - programming
  - web
summary: '"How routing works in Nextjs"'
---

Next.js use a folders and files to define routes. All routes must be in the `app` folder.

## Page

A page where we render our UI in a specific route. For example, for add a `/about` route we need create a folder `about` add a `page.tsx` inside.

```javascript
// app/about/page.tsx
export default function Page() {
  return <div>about</div>;
}
```

## Layout

A layout is a piece of UI that be shared across of multiple pages that are inside of the same nested routes. For example, you have a `dashboard` folder and inside you have a `layout.tsx` file that defines the same UI part for all `children routes`. So, if in your design there is a `Sidebar` all routes in the dashboard have this `Sidebar`.

```javascript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

If you go to routes `/dashboard/me` or `/dashboard/items` the content render in `children` change but the `Sidebar` component still across of different routes

## Nested Routes

Are routes composed of multiple URL segments how we see above `dashboard/me` or `/dashboard/items`.

We need keep this in mind:

- **Folders** are used to define the route segments that map to URL segments.
- **Files** (like `page` and `layout`) are used to create UI that is shown for a segment.

So to create nested routes in `dashboard` we do something like this:

```shell
app/
	dashboard/
		page.tsx
		layout.tsx
		items/
			page.tsx
		me/
			page.tsx
```

## Route Groups

We can create a group of paths that will not share segments of the url by putting the folder name in parentheses `(foldername)`. These routes can share layout.

## Dynamic Routes

For create dynamic routes we use `[]`, For example `blog/[id]/page.tsx`

> Dynamic Segments are passed as the `params` prop to [`layout`](https://nextjs.org/docs/app/api-reference/file-conventions/layout), [`page`](https://nextjs.org/docs/app/api-reference/file-conventions/page), [`route`](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), and [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function) functions.

```javascript
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>,
}) {
  const { slug } = await params;
  return <div>My Post: {slug}</div>;
}
```

## Catch-all Segments

For example, `app/shop/[...slug]/page.js` will match `/shop/clothes`, but also `/shop/clothes/tops`, `/shop/clothes/tops/t-shirts`, and so on.

## Error Handling

Next.js uses error boundaries to handle uncaught exceptions. Error boundaries catch errors in their child components and display a fallback UI instead of the component tree that crashed.

### Handling Errors in Nested Routes

Errors will bubble up to the nearest parent error boundary.

```javascript
"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string },
  reset: () => void,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
```

## Loading UI and Streming

### Loading

In the same folder, `loading.js` will be nested inside `layout.js`. It will automatically wrap the `page.js` file and any children below in a `<Suspense>` boundary. See [[Rendering in Next.js]]

```javascript
export default function Loading() {
  return <Spinner />;
}
```

### Streaming

**Server Side Rendering (SSR)** involves several steps that must be completed before a user can view and interact with a page.

1. All data for a page is fetched on the server
2. The server then renders the HTML
3. The HTML, CSS, and JavaScript for the page are sent to the client.
4. A non-interactive user interface is shown using the generated HTML, and CSS.
5. React [hydrates](https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) the user interface

> In React, “hydration” is how React “attaches” to existing HTML that was already rendered by React in a server environment. During hydration, React will attempt to attach event listeners to the existing markup and take over rendering the app on the client.

These step are sequential and blocking

```shell
|Fetch data on server|->|Render HTML on server|->|loding on client|->|hydration|
```

**Streaming** allows you to break down the page's HTML into smaller chunks and progressively send those chunks from the server to the client.

```javascript
import { Suspense } from 'react'
import { PostFeed, Weather } from './Components'

export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  )
```

## Navigating

### Using `<Link>` Component

Is a Next.js component that provide `prefetching` and client-side navigation between routes.

```javascript
import Link from "next/link";

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>;
}
```

### Use `redirect` function

For [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components), use the `redirect` function instead.

```js
const { id } = await params;
if (!id) {
  redirect("/login");
}
```
