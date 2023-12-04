import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {initialUser, User} from '../core/_models'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, getGateway, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useIntl} from 'react-intl'
import {getPlans} from '../../../../auth/core/_requests'
import {Formik, Form, useFormik} from 'formik'
import {useAuth} from '../../../../auth'
import {Horizontal} from '../../../../wizards/components/Horizontal'
import Invoice from '../../../../invoice/Invoice'
import {useQuery} from 'react-query'

type Props = {
  isUserLoading: boolean
  user: any
}

const UserPaymentModal: FC<Props> = ({user, isUserLoading}) => {
  const intl = useIntl()
  const {setPricingPlan, pricingPlan, currentUser} = useAuth()
  const {data: gateway} = useQuery(
    `${QUERIES.USERS_LIST}`,
    () => {
      return getGateway()
    },
    {cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false}
  )
  useEffect(() => {
    console.log(gateway)
  }, [gateway])
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

  const {setItemIdForUpdate, setPayment, itemIdForCreateInvoice} = useListView()
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
    setPayment?.(undefined)
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
              <Invoice invoice={user} gateway={gateway} />
            </div>
          </Form>
        )}
      </Formik>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export {UserPaymentModal}
