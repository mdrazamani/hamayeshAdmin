import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'مدیریت کاربران',
    path: '/users/user-management/users',
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

const UsersPage = () => {
  const intl = useIntl()
  const usersManagementTitle = intl.formatMessage({
    id: 'MENU.USERS.MANAGEMENT',
    defaultMessage: 'مدیریت کاربران',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.USERS.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })

  // Define the breadcrumbs inside the component
  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: usersManagementTitle,
      path: '/users/user-management/users',
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
          path='users'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/users/user-management/users' />} />
    </Routes>
  )
}

export default UsersPage
