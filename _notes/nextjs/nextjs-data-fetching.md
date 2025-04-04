---
title: Data fetching in Next.js
publishedAt: 2025-03-19
tags:
  - web
  - programming
summary: How fetch data works in Next.js
---
Next.js have 3 way to fetch data
 - Fetch on the Server with `fetch`
 - Fetch on the Server with a `ORM` or a `DB query`
 - Fetch data on the Client

We will focus on the `Fetch on the Server` variants. Because fetching data on the client is how it is traditionally done in any React app.

## Incremental Static Regeneration
To be clear, in these 2 way to fetch data. The route is always `pre-rendered` during the build (`next build`) to a static page. But the response from the API/database is not cached by default.

For avoid that you have 2 paths
### Dynamic APIs
You can use these APIs for indicate that the route is dynamic.
- [`cookies`](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [`headers`](https://nextjs.org/docs/app/api-reference/functions/headers)
- [`connection`](https://nextjs.org/docs/app/api-reference/functions/connection)
- [`draftMode`](https://nextjs.org/docs/app/api-reference/functions/draft-mode)
- [`searchParams` prop](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional)
- [`unstable_noStore`](https://nextjs.org/docs/app/api-reference/functions/unstable_noStore)
Also you can force the dynamic route with this:
```js
export const dynamic = 'force-dynamic'
```

### Incremental Static Regeneration (ISR)
With ISR you can update the static content without rebuilding the entire site. In Next.js you can use functions like `revalidatePath` or `revalidateTag` for `"invalid the cache"` and rebuild one specific part of the application. 

These functions are used in [On-demand revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation-with-revalidatepath), means that when the user do some specific action we shot one of this functions for revalidate the page. For example, the user upload one post.
```js
"use server";
import { revalidatePath } from "next/cache";

export async function createPost() {
  // Invalidate the /posts route in the cache
  revalidatePath("/posts");
}
```

## Fetch on the Server with `fetch`
By default the components are `Server Components` running on the server so we can use the fetch function for get data.
```js
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## Fetch on the Server with a `ORM` or a `DB query`
Using databases (like D1, Supabase) and a ORM (like prisma, drizzle) we can do something like  this:
```js
import { db, posts } from '@/lib/db'
 
export default async function Page() {
  const allPosts = await db.select().from(posts)
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## Server Actions

> [Server Actions](https://react.dev/reference/rsc/server-actions) are **asynchronous functions** that are executed on the server. They can be called in Server and Client Components to handle form submissions and data mutations in Next.js applications.

For use `Server actions` in client components we need to create the functions in a separated file and use a `"use server"` directive.
```js
// app/actions.ts
'use server' 
export async function create() {}
```
```js
// app/buttons.tsx
'use client'
 
import { create } from './actions'
 
export function Button() {
  return <button onClick={() => create()}>Create</button>
}
```

In server components we can use the directive above of function
```js
// page.tsx
export default function Page() {
  // Server Action
  async function create() {
    'use server'
    // Mutate data
  }
 
  return '...'
}
```

## Incremental Static Regeneration (ISR)
Incremental Static Regeneration (ISR) enables you to:
- Update static content without rebuilding the entire site
- Reduce server load by serving prerendered, static pages for most requests
- Ensure proper `cache-control` headers are automatically added to pages
- Handle large amounts of content pages without long `next build` times

### Time-based revalidation
We define how long it takes to revalidate the data.
After one hour, the cache is invalidated and a new version of the page is generated in the background.
```js
interface Post {
  id: string
  title: string
  content: string
}
 
export const revalidate = 3600 // invalidate every hour
 
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts: Post[] = await data.json()
  return (
    <main>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  )
}
```

### On demand Revalidation `revalidatePath`/`revalidateTag
After a user action we can revalidate the data. For example after publishing a post.
```js
'use server'
 
import { revalidatePath } from 'next/cache'
 
export async function createPost() {
  // Invalidate the /posts route in the cache
  revalidatePath('/posts')
}
```