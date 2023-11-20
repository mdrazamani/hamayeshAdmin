import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const SupporterPage = () => {
  const intl = useIntl()
  const supporterManagementTitle = intl.formatMessage({
    id: 'MENU.SUPPORTERS.MANAGEMENT',
    defaultMessage: 'مدیریت حامیان',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.SUPPORTER.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })
  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: supporterManagementTitle,
      path: '/users/supporter-management/supporters',
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
          path='supporters'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/users/supporter-management/supporters' />} />
    </Routes>
  )
}

export default SupporterPage
