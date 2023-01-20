import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import Article from './Article'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: (60 * 1000) * 5,
    }
  }
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Article />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
