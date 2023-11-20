import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const OrganizerPage = () => {
  const intl = useIntl()
  const organizerManagementTitle = intl.formatMessage({
    id: 'MENU.ORGANIZER.MANAGEMENT',
    defaultMessage: 'مدیریت برگذارکنندگان',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.ORGANIZER.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })
  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: organizerManagementTitle,
      path: '/apps/organizer-management/organizers',
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
          path='organizers'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/organizer-management/organizers' />} />
    </Routes>
  )
}

export default OrganizerPage
