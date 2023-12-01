/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../../../_metronic/helpers'
import {PricingRule, User} from '../../core/_models'

type Props = {
  user: any
}

const UserInfoCell: FC<Props> = ({user}) => {
  console.log(user)

  return (
    <>
      <div className='d-flex align-items-center'>
        {/* begin:: Avatar */}
        {user?.items ? (
          <div className='d-flex flex-column'>
            <a href='#' className='text-gray-800 text-hover-primary mb-1'>
              {user?.items[0]?.item?.name}
            </a>
            <span>{user?.items[0]?.item?.description}</span>
          </div>
        ) : null}
      </div>
    </>
  )
}

export {UserInfoCell}
