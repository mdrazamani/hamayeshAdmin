// @ts-nocheck

import React, {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, KTSVG} from '../../../../../../_metronic/helpers'
import {User} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, getAllCategories, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useIntl} from 'react-intl'
import Select from 'react-select'
import {useAuth} from '../../../../auth'

import {profileImage} from '../../../../auth/core/_requests'

import RangeInput from '../../../../../../_metronic/helpers/components/RangeInput'

type Props = {
  isUserLoading: boolean
  user: User
}
type SelectOption = {
  value: string
  label: string
}
const UserEditModalForm: FC<Props> = ({user, isUserLoading}) => {
  console.log(user)
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

  const [categoryList, setCategoryList] = useState<any>([])
  const [selectedCategory, setSelectedCategory] = useState<SelectOption | null>(null)

  useEffect(() => {
    if (user?.category) {
      setSelectedCategory({
        value: user.category?.id,
        label: `${user.category.title}`,
      })
    }
  }, [user])
  const {currentUser} = useAuth()

  // useEffect(() => {
  //   if (categoryList?.length) {
  //     const selected = user?.referees
  //       ?.map((userId) => {
  //         const userDetail = categoryList.find((u) => u.id === userId.id)
  //         if (userDetail) {
  //           return {
  //             value: userDetail.id,
  //             label: `${userDetail?.firstName} ${userDetail?.lastName}`,
  //           }
  //         }
  //         return null
  //       })
  //       .filter(Boolean) as SelectOption[] // Filter out null values and assert the type
  //     setSelectedUsers(selected || [])
  //   }
  // }, [user, categoryList])

  const [userForEdit] = useState({
    ...user,
    description: user.description,
    title: user.title,
    ...(currentUser?.role === 'admin' || currentUser?.role === 'referee'
      ? {
          arbitration: {
            ...user.arbitration,
            refereeId: user.arbitration?.refereeId || currentUser?.id,
          },
        }
      : {}),
    ...(currentUser?.role === 'user' ? {userId: currentUser?.id} : {}),
    articleFiles: user.articleFiles,
  })

  useEffect(() => {
    getAllCategories()
      .then((res) => setCategoryList(res.data))
      .catch()
  }, [])

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }
  const getChangedValues = (initialValues, currentValues) => {
    let changes = {}
    Object.keys(currentValues).forEach((key) => {
      // If the current form values are different from the initial ones, add them to the changes object.
      if (currentValues[key] !== initialValues[key]) {
        changes[key] = currentValues[key]
      }
    })
    return {
      ...changes,
      articleFiles: currentValues.articleFiles,
      presentationFiles: currentValues.presentationFiles,
    }
  }

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, {setSubmitting, setFieldError}) => {
      setSubmitting(true)

      const changedValues = getChangedValues(formik.initialValues, values)
      try {
        if (isNotEmpty(values.id)) {
          await updateUser(values.id, changedValues)
        } else {
          await createUser(values)
        }
        cancel(true)
      } catch (error: any) {
        const fieldErrors = error.response.data.errors
        if (fieldErrors) {
          Object.keys(fieldErrors).forEach((field) => {
            setFieldError(field, fieldErrors[field].join(', '))
          })
        }
      } finally {
        setSubmitting(true)
      }
    },
  })

  const userOptions = categoryList.map((user) => ({
    value: user.id || '', // Ensure it's always a string
    label: `${user.title}`,
  }))

  const handleImageChange = async (event, name) => {
    const files = event.currentTarget.files
    if (!files) return

    try {
      // Initialize the array if it doesn't exist in formik
      const currentPaths = formik.values[name] || []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        const response = await profileImage(file, name)

        if (response.data.status === 'success') {
          const imagePath = response.data.data[name][0].path

          // Push the imagePath to the array
          currentPaths.push(imagePath)
        } else {
          // Handle errors for each file if necessary
          console.error(
            `Error uploading file ${i + 1}:`,
            response.data.message || 'Error uploading file.'
          )
        }
      }

      // Set the updated array in formik
      formik.setFieldValue(name, currentPaths)
    } catch (error: any) {
      // Handle any errors that occurred during the request
      console.error('Error during image upload:', error)

      const errorMessage = error.response ? error.response.data.message : error.message

      // Set formik field error for the first file (or handle errors globally as needed)
      formik.setFieldError(name, errorMessage)

      // If you have a general 'status' field for displaying global form messages, you can use this too
      formik.setStatus('Failed to upload image(s)')
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

          {currentUser?.role === 'user' && (
            <>
              <div className='fv-row mb-7'>
                {/* begin::Label */}
                <label className='fw-bold fs-6 mb-2'>
                  {' '}
                  {intl.formatMessage({id: 'AUTH.INPUT.ARTICLES'})}
                </label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  type='file'
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  onChange={(e) => handleImageChange(e, 'articleFiles')}
                  multiple
                />
              </div>

              <div className='fv-row mb-7'>
                {/* begin::Label */}
                <label className='fw-bold fs-6 mb-2'>
                  {' '}
                  {intl.formatMessage({id: 'AUTH.INPUT.PRESENTAIONS'})}
                </label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  type='file'
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  onChange={(e) => handleImageChange(e, 'presentationFiles')}
                  multiple
                />
              </div>
            </>
          )}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.TITLE'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.TITLE'})}
              {...formik.getFieldProps('title')}
              type='text'
              name='title'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.title && formik.errors.title},
                {
                  'is-valid': formik.touched.title && !formik.errors.title,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading || currentUser?.role !== 'user'}
            />
            {formik.touched.title && formik.errors.title && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.title}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.DESCRIPTION'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <textarea
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.DESCRIPTION'})}
              {...formik.getFieldProps('description')}
              name='description'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.description && formik.errors.description},
                {
                  'is-valid': formik.touched.description && !formik.errors.description,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading || currentUser?.role !== 'user'}
            />
            {formik.touched.description && formik.errors.description && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.description}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.CATEGORY'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
              options={userOptions}
              value={selectedCategory}
              onChange={(selectedOption: SelectOption | null) => {
                formik.setFieldValue('category', selectedOption ? selectedOption.value : null)
                setSelectedCategory(selectedOption)
              }}
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.CATEGORY'})}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.category && formik.errors.category},
                {
                  'is-valid': formik.touched.category && !formik.errors.category,
                }
              )}
              name='category'
              isDisabled={formik.isSubmitting || isUserLoading || currentUser?.role !== 'user'}
            />

            {/* end::Input */}
            {formik.touched.category && formik.errors.category && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.category}</span>
              </div>
            )}
          </div>

          {/* {(currentUser?.role === 'admin' || currentUser?.role === 'referee') && (
            <>
              <div className='fv-row mb-7'>
                <label className='fw-bold fs-6 mb-2'>
                  {' '}
                  {intl.formatMessage({id: 'AUTH.INPUT.FILES'})}
                </label>

                <input
                  type='file'
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  onChange={(e) => handleImageChange(e, 'arbitration.files')}
                  multiple
                />
              </div>
            </>
          )} */}

          {/* <div className='fv-row mb-7'>
            <label className='fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.MESSAGE'})}
            </label>

            <textarea
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.MESSAGE'})}
              {...formik.getFieldProps('arbitration.message')}
              name='arbitration.message'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {
                  'is-invalid':
                    formik.touched.arbitration?.message && formik.errors.arbitration?.message,
                },
                {
                  'is-valid':
                    formik.touched.arbitration?.message && !formik.errors.arbitration?.message,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading || currentUser?.role === 'user'}
            />
            {formik.touched.arbitration?.message && formik.errors.arbitration?.message && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.arbitration?.message}</span>
                </div>
              </div>
            )}
          </div> */}

          {/* begin::Input group */}

          {/* {(currentUser?.role === 'admin' || currentUser?.role === 'referee') && (
            <div className='fv-row mb-7'>
              <label className='required fw-bold fs-6 mb-2'>
                {' '}
                {intl.formatMessage({id: 'AUTH.INPUT.MESSAGE'})}
              </label>

              <MainCkeditor
                formik={formik}
                formikValue={formik.values?.arbitration?.message}
                formikName={'arbitration.message'}
              />

              {formik.touched?.arbitration?.message && formik.errors?.arbitration?.message && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors?.arbitration?.message}</span>
                  </div>
                </div>
              )}
            </div>
          )} */}
          {(currentUser?.role === 'admin' || currentUser?.role === 'scientific') && (
            <>
              <label className='fw-bold fs-3 mb-2 mt-10'>
                {intl.formatMessage({id: 'AUTH.INPUT.REFEREESEC'})}
              </label>
              <div className='separator border-5 mb-15'></div>
            </>
          )}

          {(currentUser?.role === 'admin' || currentUser?.role === 'scientific') && (
            <div className='mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-5'>
                {' '}
                {intl.formatMessage({id: 'AUTH.INPUT.STATUS'})}
              </label>
              {/* end::Label */}
              {/* begin::Roles */}
              {/* begin::Input row */}
              <div className='d-flex fv-row'>
                {/* begin::Radio */}
                <div className='form-check form-check-custom form-check-solid'>
                  {/* begin::Input */}
                  <input
                    className='form-check-input me-3'
                    {...formik.getFieldProps('status')}
                    name='status'
                    type='radio'
                    value='review'
                    id='kt_modal_update_role_option_0'
                    checked={formik.values.status === 'review'}
                    disabled={formik.isSubmitting || isUserLoading}
                  />

                  {/* end::Input */}

                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                    <div className='fw-bolder text-gray-800'>
                      {intl.formatMessage({id: 'AUTH.INPUT.REVIEW'})}
                    </div>
                  </label>
                  {/* end::Label */}
                </div>
                {/* end::Radio */}
              </div>
              {/* end::Input row */}
              <div className='separator separator-dashed my-5'></div>
              {/* begin::Input row */}
              <div className='d-flex fv-row'>
                {/* begin::Radio */}
                <div className='form-check form-check-custom form-check-solid'>
                  {/* begin::Input */}
                  <input
                    className='form-check-input me-3'
                    {...formik.getFieldProps('status')}
                    name='status'
                    type='radio'
                    value='failed'
                    id='kt_modal_update_role_option_1'
                    checked={formik.values.status === 'failed'}
                    disabled={formik.isSubmitting || isUserLoading}
                  />
                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                    <div className='fw-bolder text-gray-800'>
                      {' '}
                      {intl.formatMessage({id: 'AUTH.INPUT.FAILED'})}
                    </div>
                  </label>
                  {/* end::Label */}
                </div>
                {/* end::Radio */}
              </div>
              {/* end::Input row */}
              <div className='separator separator-dashed my-5'></div>
              {/* begin::Input row */}
              <div className='d-flex fv-row'>
                {/* begin::Radio */}
                <div className='form-check form-check-custom form-check-solid'>
                  {/* begin::Input */}
                  <input
                    className='form-check-input me-3'
                    {...formik.getFieldProps('status')}
                    name='status'
                    type='radio'
                    value='accepted'
                    id='kt_modal_update_role_option_2'
                    checked={formik.values.status === 'accepted'}
                    disabled={formik.isSubmitting || isUserLoading}
                  />

                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_2'>
                    <div className='fw-bolder text-gray-800'>
                      {' '}
                      {intl.formatMessage({id: 'AUTH.INPUT.SUCCESS'})}
                    </div>
                  </label>
                  {/* end::Label */}
                </div>
                {/* end::Radio */}
              </div>
            </div>
          )}
          {(currentUser?.role === 'admin' || currentUser?.role === 'scientific') && (
            <RangeInput formik={formik} intl={intl} isUserLoading={isUserLoading} />
          )}

          {/* {(currentUser?.role === 'admin' || currentUser?.role === 'referee') && (
            <div className='rating'>
              <label className='fw-bold fs-6 mb-2'>
                {' '}
                {intl.formatMessage({id: 'AUTH.INPUT.RATE'})}
              </label>

              {[1, 2, 3, 4, 5].map((value) => (
                <React.Fragment key={value}>
                  <label className='rating-label' htmlFor={`kt_rating_2_input_${value}`}>
                    <KTSVG
                      path='/media/icons/duotune/general/gen029.svg'
                      className='svg-icon svg-icon-1'
                    />
                  </label>
                  <input
                    className='rating-input'
                    name='rating'
                    value={value}
                    type='radio'
                    id={`kt_rating_2_input_${value}`}
                    checked={formik.values.arbitration.rate === value}
                    onChange={() => formik.setFieldValue('arbitration.rate', value)}
                  />
                </React.Fragment>
              ))}
            </div>
          )} */}

          {/* begin::Input group */}

          {/* <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.GENDER'})}
            </label>

            <Select
              isMulti
              options={userOptions}
              value={selectedUsers}
              onChange={(selectedOptions: readonly SelectOption[] | null) => {
                const selectedIds = selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : []
                formik.setFieldValue('referees', selectedIds)
                setSelectedUsers(selectedOptions ? Array.from(selectedOptions) : [])
              }}
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.GENDER'})}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.referees && formik.errors.referees},
                {
                  'is-valid': formik.touched.referees && !formik.errors.referees,
                }
              )}
              name='referees'
              isDisabled={formik.isSubmitting || isUserLoading}
            />

            {formik.touched.referees && formik.errors.referees && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.referees}</span>
              </div>
            )}
          </div> */}

          {/* end::Input group */}
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
