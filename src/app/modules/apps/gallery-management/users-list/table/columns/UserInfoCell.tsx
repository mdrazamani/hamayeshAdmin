/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {User} from '../../core/_models'

type Props = {
  user: User
}

const UserInfoCell: FC<Props> = ({user}) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}

    <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {user.category}
      </a>
    </div>
  </div>
)

export {UserInfoCell}
