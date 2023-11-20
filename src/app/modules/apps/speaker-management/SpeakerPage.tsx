import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const SpeakerPage = () => {
  const intl = useIntl()
  const speakerManagementTitle = intl.formatMessage({
    id: 'MENU.SPEAKERS.MANAGEMENT',
    defaultMessage: 'مدیریت حامیان',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.SPEAKERS.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })
  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: speakerManagementTitle,
      path: '/users/speaker-management/speakers',
      isSeparator: false,
      isActive: false,
    },
    {
      title: '',
      path: '',
      isSeparator: true,
      isActive: false,
    },
  ]

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='speakers'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/speaker-management/speakers' />} />
    </Routes>
  )
}

export default SpeakerPage
