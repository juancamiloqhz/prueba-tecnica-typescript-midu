import { useMemo, useState } from 'react'
import './App.css'
import { SortBy } from './types.d'
import UsersList from './components/UsersList'
import useUsers from './hooks/useUsers'

function App() {
  const { fetchNextPage, hasNextPage, isError, isLoading, refetch, users } = useUsers()
  const [showColors, setShowColors] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [search, setSearch] = useState('')
  // const originalUsers = useRef<User[]>([])

  function toggleColors() {
    setShowColors(!showColors)
  }

  function toggleSortByCountry() {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  function handleDelete(uuid: string) {
    // const filteredUsers = users.filter(user => user.login.uuid !== uuid)
    // setUsers(filteredUsers)
  }

  function handleReset() {
    void refetch()
    // console.log('reset')
    // setUsers(originalUsers.current)
  }

  function handleChangeSort(sort: SortBy) {
    setSorting(sort)
  }

  const filteredUsers = useMemo(() => {
    // console.log('filteredUsers')
    return typeof search === 'string' && search.length > 0
      ? users.filter(user => user.location.country.toLowerCase().includes(search.toLowerCase()))
      : users
  }, [search, users])

  const sortUsersByCountry = useMemo(() => {
    // console.log('sortUsersByCountry')
    if (sorting === SortBy.NONE) return filteredUsers

    if (sorting === SortBy.NAME) {
      return filteredUsers.toSorted((a, b) => a.name.first.localeCompare(b.name.first))
    }

    if (sorting === SortBy.LAST) {
      return filteredUsers.toSorted((a, b) => a.name.last.localeCompare(b.name.last))
    }

    if (sorting === SortBy.COUNTRY) {
      return filteredUsers.toSorted((a, b) => a.location.country.localeCompare(b.location.country))
    }

    return filteredUsers
  }, [filteredUsers, sorting])

  return (
    <div className="App">
      <h1>Prueba Técnica</h1>
      <header>
        <button onClick={toggleColors}>Cambiar color de filas</button>
        <button onClick={toggleSortByCountry}>{sorting === SortBy.COUNTRY ? 'No ordenar por país' : 'Ordenar por país'}</button>
        <button onClick={handleReset}>Reset</button>
        <input type="text" placeholder="Buscar por país..." value={search} onChange={e => { setSearch(e.target.value) }} />
      </header>
      <main>
        {!isError && sortUsersByCountry.length > 0 && (
          <UsersList users={sortUsersByCountry} showColors={showColors} handleDelete={handleDelete} handleChangeSort={handleChangeSort} />
        )}
        {isLoading && <p>Cargando...</p>}
        {isError && <p>Hubo un error</p>}
        {!isLoading && !isError && sortUsersByCountry.length === 0 && <p>No hay usuarios</p>}
        {!isLoading && !isError && sortUsersByCountry.length > 0 && hasNextPage === true && (
          <button onClick={() => { void fetchNextPage() }}>Cargar más</button>
        )}
        {!isLoading && !isError && sortUsersByCountry.length > 0 && hasNextPage === false && <p>No hay más usuarios</p>}
      </main>
    </div>
  )
}

export default App
