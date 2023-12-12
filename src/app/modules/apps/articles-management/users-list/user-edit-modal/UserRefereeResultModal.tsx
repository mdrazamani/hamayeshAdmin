// @ts-nocheck

import React, {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, KTSVG} from '../../../../../../_metronic/helpers'
import {User} from '../core/_models'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, getAllCategories, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useIntl} from 'react-intl'
import {useLang} from '../../../../../../_metronic/i18n/Metronici18n'

type Props = {
  isUserLoading: boolean
  user: any
}

const UserRefereeResultModal: FC<Props> = ({user, isUserLoading}) => {
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

  const {setItemIdForTrack} = useListView()
  const {refetch} = useQueryResponse()

  const [userForEdit] = useState({
    ...user,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForTrack(undefined)
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
  const formatDate = (dateString) => {
    const date = new Date(dateString)

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false, // if you want to explicitly specify 12-hour time format
    }

    let locale = lang === 'fa' ? 'fa-IR' : 'en-US'
    let additionalOptions = {}

    if (lang === 'fa') {
      additionalOptions = {
        calendar: 'persian',
        numberingSystem: 'latn',
      }
    }

    const finalOptions = {...options, ...additionalOptions}

    return new Intl.DateTimeFormat(locale, finalOptions).format(date)
    //   const date = new Date(dateString)
    //   return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
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
          <div className='accordion' id='kt_accordion_1'>
            {!isUserLoading &&
              user.referees.map((referee, index) => (
                <div className='accordion-item' key={referee._id}>
                  <h2 className='accordion-header' id={`kt_accordion_1_header_${index + 1}`}>
                    <button
                      className='accordion-button fs-4 fw-bold collapsed'
                      type='button'
                      data-bs-toggle='collapse'
                      data-bs-target={`#kt_accordion_1_body_${index + 1}`}
                      aria-expanded='false'
                      aria-controls={`kt_accordion_1_body_${index + 1}`}
                    >
                      {referee.referee.firstName} {referee.referee.lastName}
                    </button>
                  </h2>
                  <div
                    id={`kt_accordion_1_body_${index + 1}`}
                    className='accordion-collapse collapse'
                    aria-labelledby={`kt_accordion_1_header_${index + 1}`}
                    data-bs-parent='#kt_accordion_1'
                  >
                    <div className='accordion-body'>
                      <table className='table table-rounded table-striped border gy-7 gs-7'>
                        <thead>
                          <tr className='fw-bold fs-6 text-gray-800 border-bottom border-gray-200'>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Office</th>
                            <th>Age</th>
                            <th>Start date</th>
                            <th>Salary</th>
                          </tr>
                        </thead>
                        <tbody>
                          {referee.rates.map((rate) => (
                            <tr key={rate._id}>
                              <td>{lang === 'fa' ? rate.faTitle : rate.enTitle}: </td>{' '}
                            </tr>
                          ))}
                          <tr>
                            <td>Tiger Nixon</td>
                            <td>System Architect</td>
                            <td>Edinburgh</td>
                            <td>61</td>
                            <td>2011/04/25</td>
                            <td>$320,800</td>
                          </tr>
                          <tr>
                            <td>Garrett Winters</td>
                            <td>Accountant</td>
                            <td>Tokyo</td>
                            <td>63</td>
                            <td>2011/07/25</td>
                            <td>$170,750</td>
                          </tr>
                        </tbody>
                      </table>
                      {referee.rates.map((rate) => (
                        <div key={rate._id}>
                          <strong>{lang === 'fa' ? rate.faTitle : rate.enTitle}: </strong>{' '}
                        </div>
                      ))}
                      <div>
                        <strong>Assigned Date: </strong>
                        {formatDate(referee.assignmentDate)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export {UserRefereeResultModal}
