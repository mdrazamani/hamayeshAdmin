import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const NewsCommentPage = () => {
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
      path: '/news/newscomment-management/newscomments',
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
          path='newscomments'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/news/newscomment-management/newscomments' />} />
    </Routes>
  )
}

export default NewsCommentPage
