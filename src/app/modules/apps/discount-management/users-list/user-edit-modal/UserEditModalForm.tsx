// @ts-nocheck

import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty} from '../../../../../../_metronic/helpers'
import {User} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, getAllRules, getAllTags, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useIntl} from 'react-intl'

import Select from 'react-select'
import DatePicker from '../../../../d-components/calendar'
import changeFormat from '../../../../d-components/dateConverter'
import {getAllUsers} from '../../../secretariat-management/users-list/core/_requests'
import {NumericFormat} from 'react-number-format'

type Props = {
  isUserLoading: boolean
  user: User
}
type SelectOption = {
  value: string
  label: string
}

const UserEditModalForm: FC<Props> = ({user, isUserLoading}) => {
  const intl = useIntl()
  const editUserSchema = Yup.object().shape({
    // email: Yup.string()
    //   .email('Wrong email format')
    //   .min(3, 'Minimum 3 symbols')
    //   .max(50, 'Maximum 50 symbols')
    //   .required('Email is required'),
    // password: Yup.string()
    //   .min(3, intl.formatMessage({id: 'errors.password.min'}))
    //   .max(50, intl.formatMessage({id: 'errors.password.max'}))
    //   .optional(),
    // passwordConfirmation: Yup.string()
    //   .min(3, 'Minimum 3 symbols')
    //   .max(50, 'Maximum 50 symbols')
    //   .optional()
    //   .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    // name: Yup.string()
    //   .min(3, 'Minimum 3 symbols')
    //   .max(50, 'Maximum 50 symbols')
    //   .required('Name is required'),
  })

  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const [isRulesDisabled, setIsRulesDisabled] = useState<boolean>(false)

  const [ruleList, setRuleList] = useState<any[]>([])
  const [selectedRules, setSelectedRules] = useState<SelectOption[]>([])
  const [selectedUsers, setSelectedUsers] = useState<SelectOption[]>([])
  const [userList, setUserList] = useState<speakerUser[]>([])
  const [discountType, setDiscountType] = useState<string>('')

  // Handle change in the discount type select box
  const handleDiscountTypeChange = (event) => {
    setDiscountType(event.target.value)
    // Clear the values in formik when discount type changes
    formik.setFieldValue('percent', '')
    formik.setFieldValue('amount', '')
  }
  useEffect(() => {
    getAllUsers()
      .then((res) => setUserList(res.data))
      .catch()
  }, [])
  useEffect(() => {
    getAllRules().then((data) => {
      setRuleList(data.data?.flatMap((item) => item.rules))
    })
  }, [])

  useEffect(() => {
    console.log(selectedRules)
  }, [selectedRules])

  useEffect(() => {
    if (ruleList?.length) {
      const selected = user?.rules
        ?.map((item) => {
          const userDetail = ruleList.find((u) => u._id === item._id)
          if (userDetail) {
            return {
              value: userDetail._id,
              label: `${userDetail?.name} `,
            }
          }
          return null
        })
        .filter(Boolean) as SelectOption[] // Filter out null values and assert the type
      setSelectedRules(selected || [])
    }
  }, [user, ruleList])

  useEffect(() => {
    if (userList?.length) {
      const selected = user?.users
        ?.map((userId) => {
          const userDetail = userList.find((u) => u.id === userId.id)
          if (userDetail) {
            return {
              value: userDetail.id,
              label: `${userDetail?.firstName} ${userDetail?.lastName}`,
            }
          }
          return null
        })
        .filter(Boolean) as SelectOption[] // Filter out null values and assert the type
      setSelectedUsers(selected || [])
    }
  }, [user, userList])

  const [userForEdit] = useState<User>({
    ...user,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const getChangedValues = (initialValues, currentValues) => {
    debugger
    let changes = {}
    Object.keys(currentValues).forEach((key) => {
      // Check if the value is different from the initial value and is not an empty string.
      if (currentValues[key] !== initialValues[key] && currentValues[key]) {
        changes[key] = currentValues[key]
      }
    })
    return {...changes, expiresAt: changeFormat(currentValues.expiresAt)}
  }

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          const changedValues = getChangedValues(formik.initialValues, values)
          await updateUser(values.id, changedValues)
        } else {
          await createUser(values)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
        cancel(true)
      }
    },
  })

  const rulesOption = ruleList.map((user) => ({
    value: user._id || '', // Ensure it's always a string
    label: `${user.name}`,
  }))
  const userOptions = userList.map((user) => ({
    value: user.id || '', // Ensure it's always a string
    label: `${user.firstName} ${user.lastName}`,
  }))

  // Update the state based on the 'type' field value
  useEffect(() => {
    const type = formik.values.type
    if (type && type !== '') {
      setIsRulesDisabled(true)
      formik.setFieldValue('rules', []) // Clear the rules if type is selected
      setSelectedRules([]) // Reset selected rules
    } else {
      setIsRulesDisabled(false)
    }
  }, [formik.values.type])

  // Handle changes in the rules select box
  const handleRulesChange = (selectedOptions: readonly SelectOption[] | null) => {
    const selectedIds = selectedOptions ? selectedOptions.map((option) => option.value) : []
    formik.setFieldValue('rules', selectedIds)
    setSelectedRules(selectedOptions ? Array.from(selectedOptions) : [])

    if (selectedIds.length > 0) {
      formik.setFieldValue('type', '') // Clear the type if rules are selected
    }
  }

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          {/* begin::Input group */}

          <div className='fv-row mb-7'>
            {/* Discount Type Select Box */}
            <select
              value={discountType}
              onChange={handleDiscountTypeChange}
              className='form-control  bg-transparent form-control-solid mb-3 mb-lg-0'
              disabled={formik.isSubmitting || isUserLoading}
            >
              <option value=''>{intl.formatMessage({id: 'AUTH.SELECT_DISCOUNT_TYPE'})}</option>
              <option value='percent'>{intl.formatMessage({id: 'AUTH.INPUT.PERCENT'})}</option>
              <option value='amount'>{intl.formatMessage({id: 'AUTH.INPUT.AMOUNT'})}</option>
            </select>
          </div>
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.PERCENT'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.PERCENT'})}
              {...formik.getFieldProps('percent')}
              type='number'
              name='percent'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.percent && formik.errors.percent},
                {
                  'is-valid': formik.touched.percent && !formik.errors.percent,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading || discountType !== 'percent'}
            />
            {formik.touched.percent && formik.errors.percent && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.percent}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

          <div className='fv-row mb-7'>
            <label className='fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.BILLING.PRICE'})}
            </label>
            <NumericFormat
              thousandSeparator={','}
              prefix={'ریال'} // Change to your desired currency symbol
              value={formik.values.amount}
              onValueChange={(values) => {
                const {value} = values
                formik.setFieldValue(`amount`, value)
              }}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.amount && formik.errors.amount},
                {
                  'is-valid': formik.touched.amount && !formik.errors.amount,
                }
              )}
              disabled={formik.isSubmitting || isUserLoading || discountType !== 'amount'}
            />
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.PERCENT'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.PERCENT'})}
              {...formik.getFieldProps('useNumber')}
              type='number'
              name='useNumber'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.useNumber && formik.errors.useNumber},
                {
                  'is-valid': formik.touched.useNumber && !formik.errors.useNumber,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.useNumber && formik.errors.useNumber && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.useNumber}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.PUBLISHDATE'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <DatePicker
              containerClass='col-lg-12'
              class='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
              name={'expiresAt'}
              value={formik.values.expiresAt}
              formik={formik}
            />
            {/* end::Input */}
            {formik.touched.expiresAt && formik.errors.expiresAt && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.expiresAt}</span>
              </div>
            )}
          </div>

          <div className='fv-row mb-8'>
            <label className='form-label fw-bolder text-dark fs-6'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.DISCOUNT.TYPE'})}
            </label>
            <select
              {...formik.getFieldProps('type')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.type && formik.errors.type,
                },
                {
                  'is-valid': formik.touched.type && !formik.errors.type,
                }
              )}
            >
              <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.DISCOUNT.TYPE'})}</option>
              <option value='article'>{intl.formatMessage({id: 'AUTH.INPUT.ARTICLE'})}</option>
              <option value='freeRegistration'>
                {intl.formatMessage({id: 'AUTH.INPUT.freeRegistration'})}
              </option>
              {/* other options if needed */}
            </select>
            {formik.touched.type && formik.errors.type ? (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>{formik.errors.type}</div>
              </div>
            ) : null}
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.RULES'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
              isMulti
              options={rulesOption}
              value={selectedRules}
              onChange={handleRulesChange}
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.RULES'})}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.rules && formik.errors.rules},
                {
                  'is-valid': formik.touched.rules && !formik.errors.rules,
                }
              )}
              name='rules'
              isDisabled={formik.isSubmitting || isUserLoading || isRulesDisabled}
            />

            {/* end::Input */}
            {formik.touched.rules && formik.errors.rules && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.rules}</span>
              </div>
            )}
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.USERS'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
              isMulti
              options={userOptions}
              value={selectedUsers}
              onChange={(selectedOptions: readonly SelectOption[] | null) => {
                const selectedIds = selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : []
                formik.setFieldValue('users', selectedIds)
                setSelectedUsers(selectedOptions ? Array.from(selectedOptions) : [])
              }}
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.USERS'})}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.users && formik.errors.users},
                {
                  'is-valid': formik.touched.users && !formik.errors.users,
                }
              )}
              name='users'
              isDisabled={formik.isSubmitting || isUserLoading}
            />

            {/* end::Input */}
            {formik.touched.users && formik.errors.users && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.users}</span>
              </div>
            )}
          </div>
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}

        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isUserLoading}
          >
            {intl.formatMessage({id: 'AUTH.BOTTUN.CANCEL'})}
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>
              {' '}
              {intl.formatMessage({id: 'AUTH.BOTTUN.SUBMIT'})}
            </span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className='indicator-progress'>
                {intl.formatMessage({id: 'AUTH.BOTTUN.LOADING'})}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export {UserEditModalForm}
