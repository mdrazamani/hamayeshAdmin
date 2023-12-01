import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {UsersListHeader} from './components/header/UsersListHeader'
import {UsersTable} from './table/UsersTable'
import {UserEditModal} from './user-edit-modal/UserEditModal'
import {KTCard} from '../../../../../_metronic/helpers'
import {UserEditModal as UserEditModal1} from '../../invoice-management/users-list/user-edit-modal/UserEditModal'
import {useEffect} from 'react'
import {
  useListView as useListView1,
  ListViewProvider as ListViewProvider1,
} from '../../invoice-management/users-list/core/ListViewProvider'
const UsersList = () => {
  const {itemIdForUpdate} = useListView()
  const {itemIdForCreateInvoice} = useListView1()

  useEffect(() => {
    console.log('itemIdForCreateInvoice', itemIdForCreateInvoice)
  }, [itemIdForCreateInvoice])

  return (
    <>
      <KTCard>
        <UsersListHeader />
        <UsersTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
      {itemIdForCreateInvoice !== undefined && <UserEditModal1 />}
    </>
  )
}

const UsersListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ListViewProvider1>
          <UsersList />
        </ListViewProvider1>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {UsersListWrapper}
