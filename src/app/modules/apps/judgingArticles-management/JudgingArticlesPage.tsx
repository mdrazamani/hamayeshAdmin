import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const JudgingArticlesPage = () => {
  const intl = useIntl()
  const articlesManagementTitle = intl.formatMessage({
    id: 'MENU.ARTICLES.MANAGEMENT',
    defaultMessage: 'مدیریت اخبار',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.ARTICLES.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })

  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: articlesManagementTitle,
      path: '/articles/judgement-management/judgement',
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
          path='judgement'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/articles/judgement-management/judgement' />} />
    </Routes>
  )
}

export default JudgingArticlesPage
