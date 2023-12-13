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
import {useAuth} from '../../../../auth'

import {profileImage} from '../../../../auth/core/_requests'

import {useLang} from '../../../../../../_metronic/i18n/Metronici18n'
import RangeInput2 from '../../../../../../_metronic/helpers/components/RangeInput2'

type Props = {
  isUserLoading: boolean
  user: User
}

const UserEditModalForm: FC<Props> = ({user, isUserLoading}) => {
  console.log(user)
  const intl = useIntl()
  const lang = useLang()
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

  const {currentUser} = useAuth()

  const [userForEdit] = useState({
    ...user,
    rates: user.rates.map((rate) => ({...rate})), // Initialize rateValue for each rate
  })

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
      files: currentValues.files,
    }
  }

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, {setSubmitting, setFieldError}) => {
      setSubmitting(true)

      const transformedRates = values.rates.map((rate) => ({
        _id: rate._id,
        rate: rate.rate,
      }))

      const changedValues = {
        ...getChangedValues(formik.initialValues, values),
        rates: transformedRates, // Use the transformed rates here
      }

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

  useEffect(() => {
    console.log(formik.values)
  }, [formik.values])

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
              onChange={(e) => handleImageChange(e, 'files')}
              multiple
            />
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'REFEREE.MESSAGE_SCIENTIFIC'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <textarea
              placeholder={intl.formatMessage({id: 'REFEREE.MESSAGE_SCIENTIFIC'})}
              {...formik.getFieldProps('scientificMessage')}
              name='scientificMessage'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.scientificMessage && formik.errors.scientificMessage},
                {
                  'is-valid': formik.touched.scientificMessage && !formik.errors.scientificMessage,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.scientificMessage && formik.errors.scientificMessage && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.scientificMessage}</span>
                </div>
              </div>
            )}
          </div>

          <div className='fv-row mb-7'>
            <label className='fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'REFEREE.MESSAGE_USER'})}
            </label>

            <textarea
              placeholder={intl.formatMessage({id: 'REFEREE.MESSAGE_USER'})}
              {...formik.getFieldProps('message')}
              name='message'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {
                  'is-invalid': formik.touched?.message && formik.errors?.message,
                },
                {
                  'is-valid': formik.touched?.message && !formik.errors?.message,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading || currentUser?.role === 'user'}
            />
            {formik.touched?.message && formik.errors?.message && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors?.message}</span>
                </div>
              </div>
            )}
          </div>

          <label className='fw-bold fs-3 mb-2 mt-10'>
            {intl.formatMessage({id: 'AUTH.INPUT.RATE_FORM'})}
          </label>
          <div className='separator border-5 mb-15'></div>
          <table className='table table-rounded table-striped border gy-7 gs-7'>
            <thead>
              <tr className='fw-bold fs-6 text-gray-800 border-bottom border-gray-200'>
                <th>{intl.formatMessage({id: 'RATE.REFEREE_TITLE'})}</th>
                <th>{intl.formatMessage({id: 'RATE.REFEREE_RATE'})}</th>
              </tr>
            </thead>
            <tbody>
              {userForEdit.rates.map((rate, index) => (
                <tr key={rate._id}>
                  <td>{lang === 'fa' ? rate.faTitle : rate.enTitle}:</td>
                  <td>
                    <RangeInput2
                      formik={formik}
                      intl={intl}
                      isUserLoading={isUserLoading}
                      rateIndex={index}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-5'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.STATUS'})}
            </label>

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

                <label className='form-check-label' htmlFor='kt_modal_update_role_option_2'>
                  <div className='fw-bolder text-gray-800'>
                    {' '}
                    {intl.formatMessage({id: 'AUTH.INPUT.SUCCESS'})}
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

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
