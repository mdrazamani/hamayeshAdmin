import {FC} from 'react'

type Props = {
  national_id?: any
}

const UserLastLoginCell: FC<Props> = ({national_id}) => (
  <div className='badge badge-light fw-bolder'>{national_id?.length}</div>
)

export {UserLastLoginCell}
