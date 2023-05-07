import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchUsers } from '../services/fetchUsers'
import { type User } from '../types'

export default function useUsers() {
  const {
    isLoading,
    isError,
    data,
    refetch,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery<{ users: User[], currentPage: number, nextPage?: number }>(
    ['users'],
    fetchUsers,
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextPage,
      refetchOnWindowFocus: false
    }
  )
  return {
    isLoading,
    isError,
    users: data?.pages.flatMap((page) => page.users) ?? [],
    refetch,
    fetchNextPage,
    hasNextPage
  }
}
