/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../../../_metronic/helpers'
import {PricingRule, User} from '../../core/_models'

type Props = {
  user: string
}

const UserInfoCell: FC<Props> = ({user}) => {
  console.log(user)

  return (
    <>
      <div className='d-flex align-items-center'>
        {/* begin:: Avatar */}
        <div className='d-flex flex-column'>
          <a href='#' className='text-gray-800 text-hover-primary mb-1'>
            {user}
          </a>
        </div>
      </div>
    </>
  )
}

export {UserInfoCell}
