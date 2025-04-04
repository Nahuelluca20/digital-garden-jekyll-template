---
title: TanStack Query - Queries
publishedAt: 2025-04-01
tags:
  - programming
  - tsq
summary: How the queries work in TanStack Query, what are the query keys, what are the QueryFn.
---
## Query Basics
For make a `query` we need 2 things, a **unique key** and a function that return a promise.
The unique key is used for caching, refetching and share the queries in our application.

```jsx
import { useQuery } from '@tanstack/react-query'

function App() {
  const result = useQuery({ queryKey: ['todos'], queryFn: fetchTodoList })
}
```

The `result` object of the query give us different `primary states` that also have a more information depending of the state.
- `isPending` 
- `isFetching` in any state, if the query is fetching at any time `isFetching` will be true
- `isError` that have `error` property
- `isSuccess` that have `data` property

```jsx
function Todos() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
  })

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  // You can use `status` instead
  if (status === 'pending') {
    return <span>Loading...</span>
  }

  if (status === 'error') {
    return <span>Error: {error.message}</span>
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

Also exists the `fetchStatus` property that have these options:
- `fetchStatus === 'fetching'` - The query is currently fetching.
- `fetchStatus === 'paused'` - The query wanted to fetch, but it is paused
- `fetchStatus === 'idle'` - The query is not doing anything at the moment.

> - The status gives information about the data: Do we have any or not?
> - The fetchStatus gives information about the queryFn: Is it running or not?

## Query Keys
The `Query Keys` allow TanStack Query to manage the cache of our fetched data. We use this keys in a Array and in a object that is useful for distinguish a filter queries for example.

We can use a combination of query keys, so we need to keep this in mind:
- The order matters in Array keys
- The order not matters in object

```jsx
// Simple list of 2 Query Keys
useQuery({ queryKey: ['something', 'special'], ... })

// Query Key with object, that are equals
useQuery({ queryKey: ['todo', 5, { preview: true, type: 'done'}], ...})
useQuery({ queryKey: ['todo', 5, { type: 'done', preview: true }], ...})

// Query keys that are not equal
useQuery({ queryKey: ['todos', status, page], ... })
useQuery({ queryKey: ['todos', page, status], ...})
```

Also we can include variables in queries keys
```jsx
function Todos({ todoId }) {
  const result = useQuery({
    queryKey: ['todos', todoId],
    queryFn: () => fetchTodoById(todoId),
  })
}
```

## Query Functions
The `query function` can be a function that return a promise and should `resolve the data` or `throw a error`

```jsx
useQuery({ queryKey: ['todos', todoId], queryFn: () => fetchTodoById(todoId) })
useQuery({
  queryKey: ['todos', todoId],
  queryFn: async () => {
    const data = await fetchTodoById(todoId)
    return data
  },
})
```

### Handling and throw errors
The function `must throw` or return a `rejected Promise`. Any `error` persist in the `error state` of the query
```jsx
const { error } = useQuery({
  queryKey: ['todos', todoId],
  queryFn: async () => {
    if (somethingGoesWrong) {
      throw new Error('Oh no!')
    }
    if (somethingElseGoesWrong) {
      return Promise.reject(new Error('Oh no!'))
    }

    return data
  },
})
```

Some API like `fetch` not throw a error by default so in this case we need to throw a error by our own.
```jsx
useQuery({
  queryKey: ['todos', todoId],
  queryFn: async () => {
    const response = await fetch('/todos/' + todoId)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  },
})
```

### Query functions variables
Also we can pass the key to query function.
```jsx
function Todos({ status, page }) {
  const result = useQuery({
    queryKey: ['todos', { status, page }],
    queryFn: fetchTodoList,
  })
}

// Access the key, status and page variables in your query function!
function fetchTodoList({ queryKey }) {
  const [_key, { status, page }] = queryKey
  return new Promise()
}
```

### Query Options 
Its a best way for share `queryKey` and `QueryFn` between different places.
```js
import { queryOptions } from '@tanstack/react-query'

function groupOptions(id: number) {
  return queryOptions({
    queryKey: ['groups', id],
    queryFn: () => fetchGroups(id),
    staleTime: 5 * 1000,
  })
}

// usage:
useQuery(groupOptions(1))
useSuspenseQuery(groupOptions(5))
useQueries({
  queries: [groupOptions(1), groupOptions(2)],
})
queryClient.prefetchQuery(groupOptions(23))
queryClient.setQueryData(groupOptions(42).queryKey, newGroups)
```
