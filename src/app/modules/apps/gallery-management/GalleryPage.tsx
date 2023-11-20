import {useIntl} from 'react-intl'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const GalleryPage = () => {
  const intl = useIntl()
  const galleryManagementTitle = intl.formatMessage({
    id: 'MENU.GALLERY.MANAGEMENT',
    defaultMessage: 'مدیریت اخبار',
  })
  const usersListManagementTitle = intl.formatMessage({
    id: 'MENU.GALLERY.MANAGEMENT.LIST',
    defaultMessage: 'مدیریت کاربران',
  })

  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: galleryManagementTitle,
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
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='galleries'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{usersListManagementTitle}</PageTitle>
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
