// @ts-nocheck
import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
import {UserLastLoginCell} from './UserLastLoginCell'
import {UserTwoStepsCell} from './UserTwoStepsCell'
import {UserActionsCell} from './UserActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {User} from '../../core/_models'
import {UserCreatedAt} from './UserCreatedAt'
import {UserStatus} from './UserStatus'

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='TRANSACTION.TABLE.USER' className='min-w-125px' />
    ),
    id: 'invoice.user',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index].invoice?.user} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='TRANSACTION.TABLE.TOTAL'
        className='min-w-125px'
      />
    ),
    id: 'invoice.total',
    Cell: ({...props}) => <UserTwoStepsCell comment={props.data[props.row.index].invoice?.total} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='TRANSACTION.TABLE.STATUS'
        className='min-w-125px'
      />
    ),
    id: 'status',
    Cell: ({...props}) => <UserStatus national_id={props.data[props.row.index].status} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='TRANSACTION.TABLE.GATEWAY'
        className='min-w-125px'
      />
    ),
    id: 'gateway',
    Cell: ({...props}) => (
      <UserLastLoginCell national_id={props.data[props.row.index].gateway?.name} />
    ),
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='TRANSACTION.TABLE.INVOICENUMBER'
        className='min-w-125px'
      />
    ),
    id: 'invoice.invoiceNumber',
    Cell: ({...props}) => (
      <UserTwoStepsCell comment={props.data[props.row.index].invoice?.invoiceNumber} />
    ),
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='COMMENT.TABLE.CREATEDAT'
        className='min-w-125px'
      />
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
