import { SortBy, type User } from '../types.d'

export default function UsersList({
  users,
  showColors,
  handleDelete,
  handleChangeSort
}: {
  users: User[]
  showColors: boolean
  handleDelete: (uuid: string) => void
  handleChangeSort(sort: SortBy): void
}) {
  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Foto</th>
          <th className="pointer" onClick={() => { handleChangeSort(SortBy.NAME) }}>Nombre</th>
          <th className="pointer" onClick={() => { handleChangeSort(SortBy.LAST) }}>Apellido</th>
          <th className="pointer" onClick={() => { handleChangeSort(SortBy.COUNTRY) }}>País</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, i) => {
          const backgroundColor = i % 2 === 0 ? '#ccc' : '#b2b2b2'
          const color = showColors ? backgroundColor : 'transparent'
          return (
            <tr key={user.login.uuid} style={{ backgroundColor: color }}>
              <td>
                <img src={user.picture.thumbnail} alt={`${user.name.first} ${user.name.last}'s Picture`} />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => { handleDelete(user.login.uuid) }}>Borrar</button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
