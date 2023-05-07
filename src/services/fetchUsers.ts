export const fetchUsers = async ({ pageParam = 1 }: { pageParam?: number }) => {
  return await fetch(`https://randomuser.me/api/?results=10&seed=midudev&page=${pageParam}`)
    .then(async (res) => {
      if (!res.ok) throw new Error('Error at fetch')
      return await res.json()
    })
    .then((res) => {
      const currentPage = Number(res.info.page)
      return {
        users: res.results,
        currentPage,
        nextPage: currentPage > 10 ? undefined : currentPage + 1
      }
    })
}
