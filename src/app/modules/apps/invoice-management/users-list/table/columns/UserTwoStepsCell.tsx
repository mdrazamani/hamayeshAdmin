import {FC} from 'react'

type Props = {
  phoneNumber?: number
}

const UserTwoStepsCell: FC<Props> = ({phoneNumber}) => (
  <> {phoneNumber && <div className='fw-bolder'>{phoneNumber?.toLocaleString('fa-IR')}</div>}</>
)

export {UserTwoStepsCell}
