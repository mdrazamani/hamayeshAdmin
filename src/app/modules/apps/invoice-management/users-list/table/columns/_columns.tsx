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
import {UserInfoCell1} from './UserInfoCell1'

const savedLangSetting = JSON.parse(localStorage.getItem('i18nConfig') || '{}')
const savedLanguage = savedLangSetting.selectedLang || 'fa'

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='INVOICE.TABLE.USER' className='min-w-300px' />
    ),
    id: 'user',
    Cell: ({...props}) => <UserInfoCell1 user={props.data[props.row.index].user} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='INVOICE.TABLE.TYPE' className='min-w-300px' />
    ),
    id: 'items',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index]} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='INVOICE.TABLE.STATUS' className='min-w-125px' />
    ),
    id: 'paymentStatus',
    Cell: ({...props}) => (
      <UserLastLoginCell national_id={props.data[props.row.index].paymentStatus} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='INVOICE.TABLE.NUMBER' className='min-w-125px' />
    ),
    id: 'articleNumber',
    Cell: ({...props}) => (
      <UserLastLoginCell national_id={props.data[props.row.index].articleNumber} />
    ),
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='INVOICE.TABLE.TAX' className='min-w-125px' />
    ),
    id: 'taxPrice',
    Cell: ({...props}) => <UserTwoStepsCell phoneNumber={props.data[props.row.index].taxPrice} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='INVOICE.TABLE.DISCOUNT' className='min-w-125px' />
    ),
    id: 'discountPrice',
    Cell: ({...props}) => (
      <UserTwoStepsCell phoneNumber={props.data[props.row.index].discountPrice} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='INVOICE.TABLE.TOTAL' className='min-w-125px' />
    ),
    id: 'total',
    Cell: ({...props}) => <UserTwoStepsCell phoneNumber={props.data[props.row.index].total} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='INVOICE.TABLE.INVOICE.NUMBER'
        className='min-w-125px'
      />
    ),
    id: 'invoiceNumber',
    Cell: ({...props}) => (
      <UserTwoStepsCell phoneNumber={props.data[props.row.index].invoiceNumber} />
    ),
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='BILLING.TABLE.UPDATEDAT'
        className='min-w-125px'
      />
    ),
    id: 'updatedAt',
    Cell: ({...props}) => <UserCreatedAt created_at={props.data[props.row.index].updatedAt} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='BILLING.TABLE.CREATEDAT'
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
