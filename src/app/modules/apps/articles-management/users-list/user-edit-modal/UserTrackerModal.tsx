// @ts-nocheck

import React, {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty} from '../../../../../../_metronic/helpers'
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

const UserTrackerModal: FC<Props> = ({user, isUserLoading}) => {
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

  const TimelineItem = ({item}) => {
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
      <div className='timeline-item'>
        <div className='timeline-label fw-bold text-gray-800 fs-6'>{formatDate(item.date)}</div>

        <div className='timeline-badge'>
          <i className={`fa fa-genderless ${item.textColor} fs-1`}></i>
        </div>

        <div className='fw-mormal timeline-content text-muted ps-3'>
          {lang === 'fa' ? item.faTitle : item.enTitle}
        </div>
      </div>
    )
  }

  const Timeline = ({logs}) => {
    return (
      <div className='card-body pt-5'>
        <div className='timeline-label'>
          {!isUserLoading && logs.map((item) => <TimelineItem key={item._id} item={item} />)}
        </div>
      </div>
    )
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
          <Timeline logs={user?.logs} />
        </div>
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export {UserTrackerModal}
