import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const ArticleCategoriesPage = () => {
  const intl = useIntl()
  const articlesManagementTitle = intl.formatMessage({
    id: 'MENU.ARTICLECATEGORY.MANAGEMENT',
    defaultMessage: 'مدیریت اخبار',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.ARTICLECATEGORY.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })

  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: articlesManagementTitle,
      path: '/articles/articlecategories-management/articlecategories',
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
          path='articlecategories'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route
        index
        element={<Navigate to='/articles/articlecategories-management/articlecategories' />}
      />
    </Routes>
  )
}

export default ArticleCategoriesPage
