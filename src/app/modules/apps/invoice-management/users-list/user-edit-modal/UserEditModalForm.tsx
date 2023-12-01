import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {initialUser, User} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useIntl} from 'react-intl'
import {profileImage} from '../../../../auth/core/_requests'
import {Formik, FieldArray, Form, useFormik} from 'formik'
import {NumericFormat} from 'react-number-format'

type Props = {
  isUserLoading: boolean
  user: User
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

  const [userForEdit] = useState<User>({
    ...user,
    type: user.type || initialUser.type,
    rules: user.rules || initialUser.rules,
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
    return changes
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

  return (
    <>
      <Formik
        initialValues={userForEdit}
        validationSchema={editUserSchema}
        onSubmit={async (values, {setSubmitting, setFieldError}) => {
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
        }}
      >
        {(formik) => (
          <Form id='kt_modal_add_user_form' className='form' noValidate>
            {' '}
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
                <label className='required fw-bold fs-6 mb-2'>
                  {' '}
                  {intl.formatMessage({id: 'AUTH.INPUT.BILLING.TYPE'})}
                </label>

                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder={intl.formatMessage({id: 'AUTH.INPUT.BILLING.TYPE'})}
                  {...formik.getFieldProps('type')}
                  type='text'
                  name='type'
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    {'is-invalid': formik.touched.type && formik.errors.type},
                    {
                      'is-valid': formik.touched.type && !formik.errors.type,
                    }
                  )}
                  autoComplete='off'
                  disabled={formik.isSubmitting || isUserLoading || true}
                />
                {formik.touched.type && formik.errors.type && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.type}</span>
                    </div>
                  </div>
                )}
                {/* end::Input */}
              </div>

              <FieldArray
                name='rules'
                render={(arrayHelpers) => {
                  return (
                    <div className='p-3 mb-5'>
                      {formik.values.rules && formik.values.rules.length > 0 ? (
                        formik.values.rules.map((rule, index) => (
                          <div key={index} className='border p-5 mb-5 rounded '>
                            {/* ... Rule fields ... */}

                            <div className='d-flex justify-content-between'>
                              {' '}
                              {/* Flexbox for layout */}
                              {/* Rule Name */}
                              <div className='fv-row mb-7 flex-fill me-2'>
                                <label className='required fw-bold fs-6 mb-2'>
                                  {' '}
                                  {intl.formatMessage({id: 'AUTH.INPUT.BILLING.NAME'})}
                                </label>
                                <input
                                  type='text'
                                  {...formik.getFieldProps(`rules.${index}.name`)}
                                  className='form-control form-control-solid'
                                  autoComplete='off'
                                  disabled={formik.isSubmitting || isUserLoading}
                                />
                                {formik.touched.type && formik.errors.type && (
                                  <div className='fv-plugins-message-container'>
                                    <span role='alert'>{formik.errors.type}</span>
                                  </div>
                                )}
                              </div>
                              {/* Rule Description */}
                              <div className='fv-row mb-7 flex-fill ms-2'>
                                <label className='required fw-bold fs-6 mb-2'>
                                  {' '}
                                  {intl.formatMessage({id: 'AUTH.INPUT.BILLING.DESC'})}
                                </label>
                                <textarea
                                  {...formik.getFieldProps(`rules.${index}.description`)}
                                  className='form-control form-control-solid'
                                  autoComplete='off'
                                  disabled={formik.isSubmitting || isUserLoading}
                                />
                              </div>
                            </div>

                            <div className='d-flex justify-content-between'>
                              <div className='fv-row mb-7 flex-fill me-2'>
                                <label className='fw-bold fs-6 mb-2'>
                                  {' '}
                                  {intl.formatMessage({id: 'AUTH.INPUT.BILLING.NUM'})}
                                </label>
                                <input
                                  type='number'
                                  {...formik.getFieldProps(`rules.${index}.number`)}
                                  className='form-control form-control-solid'
                                  autoComplete='off'
                                  disabled={formik.isSubmitting || isUserLoading}
                                />
                              </div>

                              <div className='fv-row mb-7 flex-fill ms-2'>
                                <label className='fw-bold fs-6 mb-2'>
                                  {intl.formatMessage({id: 'AUTH.INPUT.BILLING.PRICE'})}
                                </label>
                                <NumericFormat
                                  thousandSeparator={','}
                                  prefix={' ریال '} // Change to your desired currency symbol
                                  className='form-control form-control-solid'
                                  value={rule.price}
                                  onValueChange={(values) => {
                                    const {value} = values
                                    formik.setFieldValue(`rules.${index}.price`, value)
                                  }}
                                  disabled={formik.isSubmitting || isUserLoading}
                                />
                              </div>
                            </div>

                            {/* Additional Info */}
                            <div className='fv-row mb-7 form-check form-check-custom form-check-solid'>
                              <input
                                type='checkbox'
                                name={`rules.${index}.additionalInfo.number`}
                                checked={rule.additionalInfo?.number || false}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `rules.${index}.additionalInfo.number`,
                                    e.target.checked
                                  )
                                }
                                className='form-check-input'
                                disabled={formik.isSubmitting || isUserLoading}
                              />
                              <label className='fw-bold fs-6 m-3'>
                                {intl.formatMessage({id: 'AUTH.INPUT.BILLING.ADD.NUM'})}
                              </label>
                            </div>

                            {/* Additional Info Price */}
                            {/* {rule.additionalInfo?.number && (
                            <div className='fv-row mb-7'>
                              <label className='fw-bold fs-6 mb-2'>
                                {intl.formatMessage({id: 'AUTH.INPUT.BILLING.ADD.PRICE'})}
                              </label>
                              <input
                                type='number'
                                {...formik.getFieldProps(`rules.${index}.additionalInfo.price`)}
                                className='form-control form-control-solid'
                                autoComplete='off'
                                disabled={formik.isSubmitting || isUserLoading}
                              />
                            </div>
                          )} */}
                            {rule.additionalInfo?.number && (
                              <div className='fv-row mb-7'>
                                <label className='fw-bold fs-6 mb-2'>
                                  {intl.formatMessage({id: 'AUTH.INPUT.BILLING.ADD.PRICE'})}
                                </label>
                                <NumericFormat
                                  thousandSeparator={','}
                                  prefix={' ریال '} // Change to your desired currency symbol
                                  className='form-control form-control-solid'
                                  value={rule.additionalInfo?.price}
                                  onValueChange={(values) => {
                                    const {value} = values
                                    formik.setFieldValue(
                                      `rules.${index}.additionalInfo.price`,
                                      value
                                    )
                                  }}
                                  disabled={formik.isSubmitting || isUserLoading}
                                />
                              </div>
                            )}

                            {/* Add/Remove Buttons for each rule */}
                            <div className='d-flex justify-content-between mt-3'>
                              <button
                                type='button'
                                onClick={() => arrayHelpers.remove(index)}
                                className='btn btn-light btn-sm'
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className='text-center'>No rules added</div>
                      )}{' '}
                      <div className='text-center'>
                        <button
                          type='button'
                          onClick={() =>
                            arrayHelpers.push({
                              name: '',
                              description: '',
                              number: undefined,
                              price: undefined,
                              additionalInfo: {number: undefined, price: undefined},
                            })
                          }
                          className='btn btn-primary btn-sm'
                        >
                          Add Rule
                        </button>
                      </div>
                      {/* Frame around FieldArray */}
                      {/* {formik.values.rules?.map((rule, index) => (
                        <div key={index} className='border p-5 mb-5 rounded '>
                          <div className='d-flex justify-content-between'>
                            {' '}
                            <div className='fv-row mb-7 flex-fill me-2'>
                              <label className='required fw-bold fs-6 mb-2'>
                                {' '}
                                {intl.formatMessage({id: 'AUTH.INPUT.BILLING.NAME'})}
                              </label>
                              <input
                                type='text'
                                {...formik.getFieldProps(`rules.${index}.name`)}
                                className='form-control form-control-solid'
                                autoComplete='off'
                                disabled={formik.isSubmitting || isUserLoading}
                              />
                              {formik.touched.type && formik.errors.type && (
                                <div className='fv-plugins-message-container'>
                                  <span role='alert'>{formik.errors.type}</span>
                                </div>
                              )}
                            </div>
                            <div className='fv-row mb-7 flex-fill ms-2'>
                              <label className='required fw-bold fs-6 mb-2'>
                                {' '}
                                {intl.formatMessage({id: 'AUTH.INPUT.BILLING.DESC'})}
                              </label>
                              <textarea
                                {...formik.getFieldProps(`rules.${index}.description`)}
                                className='form-control form-control-solid'
                                autoComplete='off'
                                disabled={formik.isSubmitting || isUserLoading}
                              />
                            </div>
                          </div>

                          <div className='d-flex justify-content-between'>
                            <div className='fv-row mb-7 flex-fill me-2'>
                              <label className='fw-bold fs-6 mb-2'>
                                {' '}
                                {intl.formatMessage({id: 'AUTH.INPUT.BILLING.NUM'})}
                              </label>
                              <input
                                type='number'
                                {...formik.getFieldProps(`rules.${index}.number`)}
                                className='form-control form-control-solid'
                                autoComplete='off'
                                disabled={formik.isSubmitting || isUserLoading}
                              />
                            </div>

                            <div className='fv-row mb-7 flex-fill ms-2'>
                              <label className='fw-bold fs-6 mb-2'>
                                {intl.formatMessage({id: 'AUTH.INPUT.BILLING.PRICE'})}
                              </label>
                              <NumericFormat
                                thousandSeparator={','}
                                prefix={' ریال '} // Change to your desired currency symbol
                                className='form-control form-control-solid'
                                value={rule.price}
                                onValueChange={(values) => {
                                  const {value} = values
                                  formik.setFieldValue(`rules.${index}.price`, value)
                                }}
                                disabled={formik.isSubmitting || isUserLoading}
                              />
                            </div>
                          </div>

                          <div className='fv-row mb-7 form-check form-check-custom form-check-solid'>
                            <input
                              type='checkbox'
                              name={`rules.${index}.additionalInfo.number`}
                              checked={rule.additionalInfo?.number || false}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `rules.${index}.additionalInfo.number`,
                                  e.target.checked
                                )
                              }
                              className='form-check-input'
                              disabled={formik.isSubmitting || isUserLoading}
                            />
                            <label className='fw-bold fs-6 m-3'>
                              {intl.formatMessage({id: 'AUTH.INPUT.BILLING.ADD.NUM'})}
                            </label>
                          </div>

                          {rule.additionalInfo?.number && (
                            <div className='fv-row mb-7'>
                              <label className='fw-bold fs-6 mb-2'>
                                {intl.formatMessage({id: 'AUTH.INPUT.BILLING.ADD.PRICE'})}
                              </label>
                              <NumericFormat
                                thousandSeparator={','}
                                prefix={' ریال '} // Change to your desired currency symbol
                                className='form-control form-control-solid'
                                value={rule.additionalInfo?.price}
                                onValueChange={(values) => {
                                  const {value} = values
                                  formik.setFieldValue(`rules.${index}.additionalInfo.price`, value)
                                }}
                                disabled={formik.isSubmitting || isUserLoading}
                              />
                            </div>
                          )}

                          <div className='d-flex justify-content-between mt-3'>
                            <button
                              type='button'
                              onClick={() => arrayHelpers.remove(index)}
                              className='btn btn-light btn-sm'
                            >
                              Remove
                            </button>
                            {index === (formik.values.rules?.length ?? 0) - 1 && (
                              <button
                                type='button'
                                onClick={() =>
                                  arrayHelpers.push({
                                    name: '',
                                    description: '',
                                    number: undefined,
                                    price: undefined,
                                    additionalInfo: {number: undefined, price: undefined},
                                  })
                                }
                                className='btn btn-primary btn-sm'
                              >
                                Add Rule
                              </button>
                            )}
                          </div>
                        </div>
                      ))} */}
                    </div>
                  )
                }}
              />

              {/* end::Input group */}

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
                disabled={
                  isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched
                }
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
          </Form>
        )}
      </Formik>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export {UserEditModalForm}
