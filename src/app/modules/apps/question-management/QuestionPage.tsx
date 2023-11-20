import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const QuestionPage = () => {
  const intl = useIntl()
  const questionManagementTitle = intl.formatMessage({
    id: 'MENU.QUESTIONS.MANAGEMENT',
    defaultMessage: 'مدیریت سوالات',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.QUESTIONS.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })
  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: questionManagementTitle,
      path: '/apps/question-management/questions',
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
          path='questions'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/question-management/questions' />} />
    </Routes>
  )
}

export default QuestionPage
