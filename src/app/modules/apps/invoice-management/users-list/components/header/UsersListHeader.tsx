import {useAuth} from '../../../../../auth'
import {useListView} from '../../core/ListViewProvider'
import {UsersListToolbar} from './UserListToolbar'
import {UsersListGrouping} from './UsersListGrouping'
import {UsersListSearchComponent} from './UsersListSearchComponent'

const UsersListHeader = () => {
  const {selected} = useListView()
  const {currentUser} = useAuth()
  return (
    <div className='card-header border-0 pt-6'>
      <UsersListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? (
          <UsersListGrouping />
        ) : currentUser?.role === 'user' ? (
          <UsersListToolbar />
        ) : null}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {UsersListHeader}
