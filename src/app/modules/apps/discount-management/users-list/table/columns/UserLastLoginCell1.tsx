import {FC} from 'react'

type Props = {
  national_id?: string
}

const UserLastLoginCell1: FC<Props> = ({national_id}) => (
  <div className='badge badge-light fw-bolder'>{national_id ? `${national_id} ریال` : null}</div>
)

export {UserLastLoginCell1}
