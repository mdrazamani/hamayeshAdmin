/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import clsx from 'clsx'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {
  HeaderNotificationsMenu,
  HeaderUserMenu,
  QuickLinks,
  Search,
  ThemeModeSwitcher,
} from '../../../partials'
import {useAuth} from '../../../../app/modules/auth'
import axios from 'axios'

const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
  toolbarButtonHeightClass = 'btn-active-light-primary btn-custom w-30px h-30px w-md-40px h-md-40p',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px',
  toolbarButtonIconSizeClass = 'fs-1'

const API_URL = process.env.REACT_APP_API_URL
const URL = `${API_URL}/activity-log`
const Topbar: FC = () => {
  const {currentUser} = useAuth()

  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      const fetchLogs = async () => {
        try {
          const response = await axios.get(URL)
          const transformedLogs = transformLogs(response.data.data.data)
          setLogs(transformedLogs)
        } catch (error) {
          console.error('Error fetching logs:', error)
        }
      }

      fetchLogs()
    }
  }, [])

  const transformLogs = (logsData) => {
    return logsData.map((log) => {
      return {
        code: `${log.status} ${getStatusText(log.status)}`,
        state: getState(log.status),
        message: `${log.method} request on ${log.collectionName}`,
        time: formatTime(log.date),
      }
    })
  }
  const getStatusText = (status) => {
    if (status >= 200 && status < 300) return 'OK'
    if (status >= 300 && status < 400) return 'WRN'
    if (status >= 400) return 'ERR'
    return 'UNK' // Unknown status
  }

  const getState = (status) => {
    if (status >= 200 && status < 300) return 'success'
    if (status >= 300 && status < 400) return 'warning'
    return 'danger' // For 400 and above
  }
  const formatTime = (dateString) => {
    const logDate = new Date(dateString).getTime() // Convert to timestamp (number)
    const now = new Date().getTime() // Current time as timestamp (number)

    if (!logDate) {
      return 'Invalid date' // Handle invalid dates
    }

    const differenceInSeconds = Math.floor((now - logDate) / 1000)

    if (differenceInSeconds < 60) {
      return 'Just now'
    } else if (differenceInSeconds < 3600) {
      return `${Math.floor(differenceInSeconds / 60)} mins ago`
    } else if (differenceInSeconds < 86400) {
      return `${Math.floor(differenceInSeconds / 3600)} hrs ago`
    } else if (differenceInSeconds < 2592000) {
      return `${Math.floor(differenceInSeconds / 86400)} days ago`
    } else if (differenceInSeconds < 31536000) {
      return `${Math.floor(differenceInSeconds / 2592000)} months ago`
    } else {
      return `${Math.floor(differenceInSeconds / 31536000)} years ago`
    }
  }

  return (
    <div className='d-flex align-items-stretch flex-shrink-0'>
      <div className='topbar d-flex align-items-stretch flex-shrink-0'>
        {/* Search */}
        {/* <div className={clsx('d-flex align-items-stretch', toolbarButtonMarginClass)}>
          <Search />
        </div> */}
        {/* Activities */}
        <div className={clsx('d-flex align-items-center ', toolbarButtonMarginClass)}>
          {/* begin::Drawer toggle */}
          <div
            className={clsx(
              'btn btn-icon btn-active-light-primary btn-custom',
              toolbarButtonHeightClass
            )}
            id='kt_activities_toggle'
          >
            <KTIcon iconName='chart-simple' className={toolbarButtonIconSizeClass} />
          </div>
          {/* end::Drawer toggle */}
        </div>

        {/* NOTIFICATIONS */}
        {currentUser?.role === 'admin' && (
          <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
            <div
              className={clsx(
                'btn btn-icon btn-active-light-primary btn-custom',
                toolbarButtonHeightClass
              )}
              data-kt-menu-trigger='click'
              data-kt-menu-attach='parent'
              data-kt-menu-placement='bottom-end'
              data-kt-menu-flip='bottom'
            >
              <KTIcon iconName='element-plus' className={toolbarButtonIconSizeClass} />
            </div>
            <HeaderNotificationsMenu logs={logs} />
          </div>
        )}

        {/* CHAT */}
        {/* <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
          <div
            className={clsx(
              'btn btn-icon btn-active-light-primary btn-custom position-relative',
              toolbarButtonHeightClass
            )}
            id='kt_drawer_chat_toggle'
          >
            <KTIcon iconName='message-text-2' className={toolbarButtonIconSizeClass} />

            <span className='bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink'></span>
          </div>
        </div> */}

        {/* Quick links */}
        {/* <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
          <div
            className={clsx(
              'btn btn-icon btn-active-light-primary btn-custom',
              toolbarButtonHeightClass
            )}
            data-kt-menu-trigger='click'
            data-kt-menu-attach='parent'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='bottom'
          >
            <KTIcon iconName='element-11' className={toolbarButtonIconSizeClass} />
          </div>
          <QuickLinks />
        </div> */}

        {/* begin::Theme mode */}
        <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
          <ThemeModeSwitcher toggleBtnClass={toolbarButtonHeightClass} />
        </div>
        {/* end::Theme mode */}

        {/* begin::User */}
        <div
          className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}
          id='kt_header_user_menu_toggle'
        >
          {/* begin::Toggle */}
          <div
            className={clsx('cursor-pointer symbol', toolbarUserAvatarHeightClass)}
            data-kt-menu-trigger='click'
            data-kt-menu-attach='parent'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='bottom'
          >
            <img
              className='h-30px w-30px rounded'
              src={toAbsoluteUrl(
                currentUser?.profileImage
                  ? `${process.env.REACT_APP_BASE_URL}/${currentUser?.profileImage}`
                  : '/media/avatars/blank.png'
              )}
              alt='metronic'
            />
          </div>
          <HeaderUserMenu />
          {/* end::Toggle */}
        </div>
        {/* end::User */}
      </div>
    </div>
  )
}

export {Topbar}
