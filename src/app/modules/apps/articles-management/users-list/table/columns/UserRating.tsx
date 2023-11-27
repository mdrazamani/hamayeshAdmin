import {FC} from 'react'
import {KTSVG} from '../../../../../../../_metronic/helpers'

type Props = {
  rate?: number
}

const UserRating: FC<Props> = ({rate = 0}) => {
  // Function to render stars based on rating
  const renderStars = () => {
    let stars: any = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <div className={`rating-label ${i <= rate ? 'checked' : ''}`}>
          <KTSVG path='/media/icons/duotune/general/gen029.svg' className='svg-icon svg-icon-1' />
        </div>
      )
    }
    return stars
  }

  return <>{<div className='rating'>{renderStars()}</div>}</>
}

export {UserRating}
