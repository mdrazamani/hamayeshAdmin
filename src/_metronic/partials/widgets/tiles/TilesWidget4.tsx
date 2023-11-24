/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {useIntl} from 'react-intl'
import {Link} from 'react-router-dom'

type Props = {
  className?: string
}
const TilesWidget4 = ({className}: Props) => {
  const intl = useIntl()

  return (
    <div className={clsx('card h-150px', className)}>
      <div className='card-body d-flex align-items-center justify-content-between flex-wrap'>
        <div className='me-2'>
          <h2 className='fw-bold text-gray-800 mb-3'>
            {intl.formatMessage({id: 'DASH.CREATE.USER'})}
          </h2>

          <div className='text-muted fw-semibold fs-6'>
            {intl.formatMessage({id: 'DASH.CREATE.USER.DESC'})}
          </div>
        </div>
        <Link
          to='/users/user-management/users'
          className='btn btn-primary fw-semibold'
          // data-bs-toggle='modal'
          // data-bs-target='#kt_modal_create_campaign'
        >
          {intl.formatMessage({id: 'DASH.CREATE.USER.BTN'})}
        </Link>
      </div>
    </div>
  )
}

export {TilesWidget4}
