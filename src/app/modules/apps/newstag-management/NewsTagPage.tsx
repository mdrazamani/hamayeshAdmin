import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const NewsTagPage = () => {
  const intl = useIntl()
  const newsTagManagementTitle = intl.formatMessage({
    id: 'MENU.NEWSTAG.MANEGMENT',
    defaultMessage: 'مدیریت تگ ها',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.NEWSTAG.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })
  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: newsTagManagementTitle,
      path: '/news/newstag-management/newstags',
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
          path='newstags'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/news/newstag-management/newstags' />} />
    </Routes>
  )
}

export default NewsTagPage
