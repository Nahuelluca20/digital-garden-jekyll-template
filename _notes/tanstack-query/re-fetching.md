---
title: Re-fetching in TanStack Query
---
In the following section I put several ways for make a re-fetch in `TanStack Query`.

## Windows Focus Refetching
Basically when user leaves the tab and return it, the data is fetched again.

We can deactivate this option
```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
})

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
```

Also the `staleTime` modifies this behavior. If we set a `staleTime` the data will not be refetched until the time expires.
```jsx
const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 5 * 1000,
  });
```

> The **staleTime** is the time that TanStack Query considers the data “fresh”. As long as the data is “fresh”, TanStack Query will not automatically attempt to re-fetch

## Invalidate Queries
Using a `queryKey` we can invalidate the query for refetching the data. We don't need to provide a `queryFn` TanStack Query make the refetch automatically for us.
```jsx
import { useQuery, useQueryClient } from '@tanstack/react-query'

// Get QueryClient from the context
const queryClient = useQueryClient()

queryClient.invalidateQueries({ queryKey: ['todos'] })
```

## Invalidate from Mutations
### Mutations
They are typically used to create/update/delete data or perform side effects on the server. To do a mutation we use the `useMutation` hook which returns an object like the one that `useQuery` returns [[TanStack Query - Queries]], but without `isFetching` state.
```jsx
function App() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post('/todos', newTodo)
    },
  })

  return (
    <div>
      {mutation.isPending ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: 'Do Laundry' })
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  )
}
```

When a mutations is success we can use the option `onSuccess` for use `invalidateQueries`
```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

// When this mutation succeeds, invalidate any queries with the `todos` or `reminders` query key
const mutation = useMutation({
  mutationFn: addTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
    queryClient.invalidateQueries({ queryKey: ['reminders'] })
  },
})
```