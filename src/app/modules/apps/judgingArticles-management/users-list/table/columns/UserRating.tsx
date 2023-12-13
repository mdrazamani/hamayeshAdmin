import {FC} from 'react'
import {KTSVG} from '../../../../../../../_metronic/helpers'

type Props = {
  rate?: number
}

const UserRating: FC<Props> = ({rate = 0}) => {
  // Convert 1-100 scale rate to 1-5 scale for stars
  const starRating = Math.ceil(rate / 20)

  // Function to render stars based on rating
  const renderStars = () => {
    let stars: any = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <div className={`rating-label ${i <= starRating ? 'checked' : ''}`}>
          <KTSVG path='/media/icons/duotune/general/gen029.svg' className='svg-icon svg-icon-1' />
        </div>
      )
    }
    return stars
  }

  return <>{<div className='rating'>{renderStars()}</div>}</>
}
export {UserRating}
