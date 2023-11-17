import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'مدیریت گالری',
    path: '/apps/gallery-management/galleries',
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

const GalleryPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='galleries'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>لیست گالری ها</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/gallery-management/galleries' />} />
    </Routes>
  )
}

export default GalleryPage
