import {useQuery} from 'react-query'
import {UserEditModalForm} from './UserEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getUserById} from '../core/_requests'
import {UserTrackerModal} from './UserTrackerModal'
import {UserAddRefereeModal} from './UserAddRefereeModal'
import {UserRefereeResultModal} from './UserRefereeResultModal'

const UserEditModalFormWrapper = () => {
  const {
    itemIdForUpdate,
    setItemIdForUpdate,
    itemIdForTrack,
    itemIdForReferee,
    itemIdForRefereeResult,
  } = useListView()
  const enabledQuery: boolean = isNotEmpty(
    itemIdForUpdate || itemIdForTrack || itemIdForReferee || itemIdForRefereeResult
  )
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${
      itemIdForUpdate || itemIdForTrack || itemIdForReferee || itemIdForRefereeResult
    }`,
    () => {
      return getUserById(
        itemIdForUpdate || itemIdForTrack || itemIdForReferee || itemIdForRefereeResult
      )
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
    }
  )
  if (itemIdForRefereeResult) {
    return <UserRefereeResultModal isUserLoading={isLoading} user={user} />
  }

  if (itemIdForReferee) {
    return <UserAddRefereeModal isUserLoading={isLoading} user={user} />
  }
  if (itemIdForTrack) {
    return <UserTrackerModal isUserLoading={isLoading} user={user} />
  }
  if (!itemIdForUpdate) {
    return <UserEditModalForm isUserLoading={isLoading} user={{id: undefined}} />
  }
  if (!isLoading && !error && user) {
    return <UserEditModalForm isUserLoading={isLoading} user={user} />
  }

  return null
}

export {UserEditModalFormWrapper}
