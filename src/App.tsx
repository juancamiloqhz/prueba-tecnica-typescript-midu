import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import UsersList from './components/UsersList'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [search, setSearch] = useState<string>('')
  const originalUsers = useRef<User[]>([])

  function toggleColors() {
    setShowColors(!showColors)
  }

  function toggleSortByCountry() {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  function handleDelete(uuid: string) {
    const filteredUsers = users.filter(user => user.login.uuid !== uuid)
    setUsers(filteredUsers)
  }

  function handleReset() {
    // console.log('reset')
    setUsers(originalUsers.current)
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

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(async (res) => await res.json())
      .then((data) => {
        setUsers(data.results)
        originalUsers.current = data.results
      })
      .catch((err) => { console.log(err) })
  }, [])

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

        <UsersList users={sortUsersByCountry} showColors={showColors} handleDelete={handleDelete} handleChangeSort={handleChangeSort} />
      </main>
    </div>
  )
}

export default App
