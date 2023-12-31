import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {isNotEmpty} from '../../../../../../_metronic/helpers'
import {initialUser, User} from '../core/_models'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useIntl} from 'react-intl'
import {getPlans} from '../../../../auth/core/_requests'
import {Formik, Form, useFormik} from 'formik'
import {useAuth} from '../../../../auth'
import {Horizontal} from '../../../../wizards/components/Horizontal'

type Props = {
  isUserLoading: boolean
  user: User
}

const UserEditModalForm: FC<Props> = ({user, isUserLoading}) => {
  const intl = useIntl()
  const {setPricingPlan, pricingPlan, currentUser} = useAuth()
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

  const {setItemIdForUpdate, setItemIdForCreateInvoice, itemIdForCreateInvoice} = useListView()
  const {refetch} = useQueryResponse()

  const [userForEdit] = useState<User>({
    ...user,
    user: user.user || initialUser.user,
    items: user.items || initialUser.items,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
    setItemIdForCreateInvoice?.(undefined)
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
          await createUser({user: currentUser?.id, items: pricingPlan.items})
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

  useEffect(() => {
    getPlans().then((data) =>
      setPricingPlan((prev) => {
        return {
          ...prev,
          plans: data.data,
        }
      })
    )

    return () => {
      setPricingPlan(() => {
        return {
          items: {},
          plans: [], // Set plans to an empty array
        }
      })
    }
    // similarly for fetchCities if needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log('userForEdit', userForEdit)
  }, [userForEdit])
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
              await createUser({
                user: itemIdForCreateInvoice || currentUser?.id,
                items: pricingPlan.items,
              })
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
              {pricingPlan.plans?.length ? <Horizontal /> : null}
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
