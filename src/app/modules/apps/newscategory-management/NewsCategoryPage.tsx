import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const NewsCategoryPage = () => {
  const intl = useIntl()
  const newsCategoryManagementTitle = intl.formatMessage({
    id: 'MENU.NEWSCATEGORY.MANEGMENT',
    defaultMessage: 'مدیریت دسته بندی ها',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.NEWSCATEGORY.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })
  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: newsCategoryManagementTitle,
      path: '/news/newscategory-management/newscategories',
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
          path='newscategories'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/news/newscategory-management/newscategories' />} />
    </Routes>
  )
}

export default NewsCategoryPage
