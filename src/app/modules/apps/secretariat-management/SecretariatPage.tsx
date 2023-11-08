import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'مدیریت دبیرخانه',
    path: '/users/secretariat-management/secretariats',
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

const SecretariatsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='secretariats'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>لیست دبیرخانه ها</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/users/secretariat-management/secretariats' />} />
    </Routes>
  )
}

export default SecretariatsPage
