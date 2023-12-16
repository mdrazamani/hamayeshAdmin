import {useListView} from '../../core/ListViewProvider'
import {UsersListToolbar} from './UserListToolbar'
import {UsersListGrouping} from './UsersListGrouping'
import {UsersListSearchComponent} from './UsersListSearchComponent'

const UsersListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <UsersListSearchComponent />

      <div className='card-toolbar'>{selected.length > 0 ? <UsersListGrouping /> : null}</div>
    </div>
  )
}

export {UsersListHeader}
