/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect} from 'react'
import {useIntl} from 'react-intl'
import {useMutation, useQueryClient} from 'react-query'
import {MenuComponent} from '../../../../../../../_metronic/assets/ts/components'
import {ID, KTIcon, QUERIES} from '../../../../../../../_metronic/helpers'
import {useAuth} from '../../../../../auth'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {deleteUser} from '../../core/_requests'

type Props = {
  id: ID
}

const UserActionsCell: FC<Props> = ({id}) => {
  const {setItemIdForUpdate, setPayment} = useListView()
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()
  const intl = useIntl()
  const {currentUser} = useAuth()

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = () => {
    setItemIdForUpdate(id)
  }

  const openPaymentModal = () => {
    setPayment?.(id)
  }

  const deleteItem = useMutation(() => deleteUser(id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
    },
  })

  return (
    <>
      <a
        href='#'
        className='btn btn-light btn-active-light-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        {intl.formatMessage({
          id: 'COL.ACTIONS',
        })}{' '}
        <KTIcon iconName='down' className='fs-5 m-0' />
      </a>
      {/* begin::Menu */}
      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
        data-kt-menu='true'
      >
        {currentUser?.role === 'admin' && (
          <div className='menu-item px-3'>
            <a className='menu-link px-3' onClick={openEditModal}>
              {intl.formatMessage({
                id: 'COL.ACTIONS.EDIT',
              })}{' '}
            </a>
          </div>
        )}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={openPaymentModal}>
            {intl.formatMessage({
              id: 'COL.ACTIONS.PAYMENT',
            })}{' '}
          </a>
        </div>
        {/* begin::Menu item */}

        {/* end::Menu item */}

        {/* begin::Menu item */}
        <div className='menu-item px-3'>
          <a
            className='menu-link px-3'
            data-kt-users-table-filter='delete_row'
            onClick={async () => await deleteItem.mutateAsync()}
          >
            {intl.formatMessage({
              id: 'COL.ACTIONS.REMOVE',
            })}{' '}
          </a>
        </div>
        {/* end::Menu item */}
      </div>
      {/* end::Menu */}
    </>
  )
}

export {UserActionsCell}
