// @ts-nocheck
import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
import {UserTwoStepsCell} from './UserTwoStepsCell'
import {UserActionsCell} from './UserActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {User} from '../../core/_models'
import {UserCreatedAt} from './UserCreatedAt'
import {UserInfoCell1} from './UserInfoCell1'
import {UserLastLoginCell} from './UserLastLoginCell'
import {UserLastLoginCell1} from './UserLastLoginCell1'

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='DISCOUNT.TABLE.CODE' className='min-w-125px' />
    ),
    id: 'code',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index]} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='DISCOUNT.TABLE.TYPE' className='min-w-125px' />
    ),
    id: 'type',
    Cell: ({...props}) => <UserInfoCell1 user={props.data[props.row.index]} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='DISCOUNT.TABLE.AMOUNT' className='min-w-125px' />
    ),
    id: 'amount',
    Cell: ({...props}) => <UserLastLoginCell1 national_id={props.data[props.row.index].amount} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='DISCOUNT.TABLE.PERCENT' className='min-w-125px' />
    ),
    id: 'percent',
    Cell: ({...props}) => <UserLastLoginCell national_id={props.data[props.row.index].percent} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='DISCOUNT.TABLE.USENUMBER'
        className='min-w-125px'
      />
    ),
    id: 'useNumber',
    Cell: ({...props}) => <UserTwoStepsCell phoneNumber={props.data[props.row.index].useNumber} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='DISCOUNT.TABLE.EXPIRESAT'
        className='min-w-125px'
      />
    ),
    id: 'expiresAt',
    Cell: ({...props}) => <UserCreatedAt created_at={props.data[props.row.index].expiresAt} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='NEWS.TABLE.CREATEDAT' className='min-w-125px' />
    ),
    id: 'createdAt',
    Cell: ({...props}) => <UserCreatedAt created_at={props.data[props.row.index].createdAt} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='USER.TABLE.ACTIONS'
        className='text-end min-w-100px'
      />
    ),
    id: 'actions',
    Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index].id} />,
  },
]

export {usersColumns}
