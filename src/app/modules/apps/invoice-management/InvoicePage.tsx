import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const InvoicePage = () => {
  const intl = useIntl()
  const supporterManagementTitle = intl.formatMessage({
    id: 'MENU.PRICING.MANAGEMENT',
    defaultMessage: 'مدیریت حامیان',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.PRICING.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })
  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: supporterManagementTitle,
      path: '/billing/invoice-management/invoice',
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
          path='invoice'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/billing/invoice-management/invoice' />} />
    </Routes>
  )
}

export default InvoicePage
