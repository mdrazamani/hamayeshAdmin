import {useQuery} from 'react-query'
import {UserEditModalForm} from './UserEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getGateway, getUserById} from '../core/_requests'
import {UserPaymentModal} from './UserPaymentModal'

const UserEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate, payment, setPayment} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate) || isNotEmpty(payment)

  const enabledQuery1: boolean = isNotEmpty(payment)

  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIdForUpdate || payment}`,
    () => {
      return getUserById(itemIdForUpdate || payment)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        setPayment?.(undefined)
        console.error(err)
      },
    }
  )

  if (!isLoading && !error && user && payment) {
    return <UserPaymentModal isUserLoading={isLoading} user={user} />
  }
  if (!itemIdForUpdate) {
    return <UserEditModalForm isUserLoading={isLoading} user={{id: undefined}} />
  }

  if (!isLoading && !error && user && itemIdForUpdate) {
    return <UserEditModalForm isUserLoading={isLoading} user={user} />
  }

  return null
}

export {UserEditModalFormWrapper}
