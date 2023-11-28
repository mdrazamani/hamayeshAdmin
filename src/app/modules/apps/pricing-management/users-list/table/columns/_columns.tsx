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

const savedLangSetting = JSON.parse(localStorage.getItem('i18nConfig') || '{}')
const savedLanguage = savedLangSetting.selectedLang

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='BILLING.TABLE.TYPE' className='min-w-125px' />
    ),
    id: 'type',
    Cell: ({...props}) => (
      <UserInfoCell
        user={
          savedLanguage === 'fa'
            ? props.data[props.row.index].typeFa
            : props.data[props.row.index].type
        }
      />
    ),
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='BILLING.TABLE.PLANS' className='min-w-125px' />
    ),
    id: 'rules',
    Cell: ({...props}) => <UserLastLoginCell national_id={props.data[props.row.index].rules} />,
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
