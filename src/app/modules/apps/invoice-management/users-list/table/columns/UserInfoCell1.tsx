/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../../../_metronic/helpers'

type Props = {
  user: any
}

const UserInfoCell1: FC<Props> = ({user}) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
      <a href='#'>
        {user?.profileImage ? (
          <div className='symbol-label'>
            <img
              src={`${process.env.REACT_APP_BASE_URL}/${user?.profileImage}`}
              alt={user?.firstName}
              className='w-100'
            />
          </div>
        ) : (
          <div
            className={clsx(
              'symbol-label fs-3'
              // `bg-light-${user.initials?.state}`,
              // `text-${user.initials?.state}`
            )}
          >
            {/* {user.initials?.label} */}
          </div>
        )}
      </a>
    </div>
    <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {user?.firstName} {user?.lastName}
      </a>
      <span>{user?.email}</span>
    </div>
  </div>
)

export {UserInfoCell1}
