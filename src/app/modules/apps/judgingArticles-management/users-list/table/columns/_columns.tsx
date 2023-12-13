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
import {UserRating} from './UserRating'

const calculateAverageRate = (rates) => {
  const total = rates.reduce((acc, rate) => acc + rate?.rate, 0)
  return (total / rates.length).toFixed(2) // Two decimal places
}

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='ARTICLE.TABLE.USER' className='min-w-125px' />
    ),
    id: 'article',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index].article} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='ARTICLE.TABLE.RATE' className='min-w-125px' />
    ),
    id: 'rate',
    Cell: ({...props}) => (
      <UserRating rate={props.data[props.row.index]?.rates && calculateAverageRate(props.data[props.row.index]?.rates)} />
    ),
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='ARTICLE.TABLE.TITLE' className='min-w-125px' />
    ),
    id: 'article.title',
    Cell: ({...props}) => (
      <UserTwoStepsCell phoneNumber={props.data[props.row.index].article?.title} />
    ),
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='ARTICLE.TABLE.STATUS' className='min-w-125px' />
    ),
    id: 'status',
    Cell: ({...props}) => <UserLastLoginCell national_id={props.data[props.row.index].status} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='ARTICLE.TABLE.CREATEDAT'
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
    Cell: ({...props}) => (
      <UserActionsCell
        id={props.data[props.row.index].id}
        articleId={props.data[props.row.index].article?.id}
      />
    ),
  },
]

export {usersColumns}
