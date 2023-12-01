import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const TransactionPage = () => {
  const intl = useIntl()
  const newsCommentManagementTitle = intl.formatMessage({
    id: 'MENU.NEWSCOMMENT.MANEGMENT',
    defaultMessage: 'مدیریت تگ ها',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.NEWSCOMMENT.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })
  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: newsCommentManagementTitle,
      path: '/billing/transaction-management/transactions',
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
          path='transactions'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/billing/transaction-management/transactions' />} />
    </Routes>
  )
}

export default TransactionPage
