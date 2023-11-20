import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const SecretariatsPage = () => {
  const intl = useIntl()
  const secretariateManagementTitle = intl.formatMessage({
    id: 'MENU.SECRETARIATES.MANAGEMENT',
    defaultMessage: 'مدیریت حامیان',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.SECRETARIAT.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })
  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: secretariateManagementTitle,
      path: '/users/secretariat-management/secretariats',
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
          path='secretariats'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/users/secretariat-management/secretariats' />} />
    </Routes>
  )
}

export default SecretariatsPage
