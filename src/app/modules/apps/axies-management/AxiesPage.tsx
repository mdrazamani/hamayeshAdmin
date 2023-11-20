import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const AxiesPage = () => {
  const intl = useIntl()
  const axiesManagementTitle = intl.formatMessage({
    id: 'MENU.AXIES.MANAGEMENT',
    defaultMessage: 'مدیریت اخبار',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.AXIES.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })

  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: axiesManagementTitle,
      path: '/apps/axies-management/axies',
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
          path='axies'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/axies-management/axies' />} />
    </Routes>
  )
}

export default AxiesPage
