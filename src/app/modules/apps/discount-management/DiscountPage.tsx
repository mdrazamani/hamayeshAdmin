import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const DiscountPage = () => {
  const intl = useIntl()
  const newsManagementTitle = intl.formatMessage({
    id: 'MENU.DISCOUNT.MANEGMENT',
    defaultMessage: 'مدیریت اخبار',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.DISCOUNT.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })
  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: newsManagementTitle,
      path: '/billing/discount-management/discount',
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
          path='discount'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/billing/discount-management/discount' />} />
    </Routes>
  )
}

export default DiscountPage
