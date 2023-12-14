// @ts-nocheck

import React, {useEffect, useState} from 'react'
import {isCustomError, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {ILocation} from '../../../../auth'
import {useIntl} from 'react-intl'
import {updateUser} from '../../../core/_requests'
import {fetchCities, fetchStates, profileImage, updateEvent} from '../../../../auth/core/_requests'

import DatePicker from '../../../../d-components/calendar'
import changeFormat from '../../../../d-components/dateConverter'

import MainCkeditor from '../../../../ckeditor/MainCkeditor'
import TeaserAdminPanel from '../../../../d-components/teaser'

const EventDetails = (eventDetails: any) => {
  const intl = useIntl()

  const updaetSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, intl.formatMessage({id: 'errors.firstname.min'}))
      .max(50, intl.formatMessage({id: 'errors.firstname.max'}))
      .optional(),
    email: Yup.string()
      .email(intl.formatMessage({id: 'errors.email.format'}))
      .min(3, intl.formatMessage({id: 'errors.email.min'}))
      .max(50, intl.formatMessage({id: 'errors.email.max'}))
      .optional(),
    lastName: Yup.string()
      .min(3, intl.formatMessage({id: 'errors.lastname.min'}))
      .max(50, intl.formatMessage({id: 'errors.lastname.max'}))
      .optional(),
    // password: Yup.string()
    //   .min(3, intl.formatMessage({id: 'errors.password.min'}))
    //   .max(50, intl.formatMessage({id: 'errors.password.max'}))
    //   .required(intl.formatMessage({id: 'errors.password.required'})),
    // changepassword: Yup.string()
    //   .min(3, 'Minimum 3 symbols')
    //   .max(50, 'Maximum 50 symbols')
    //   .required('Password confirmation is required')
    //   .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    study_field: Yup.string()
      .min(2, intl.formatMessage({id: 'errors.study_field.min'}))
      .max(50, intl.formatMessage({id: 'errors.study_field.max'}))
      .optional(),
    institute: Yup.string()
      .min(2, intl.formatMessage({id: 'errors.institute.min'}))
      .max(50, intl.formatMessage({id: 'errors.institute.max'}))
      .optional(),
    degree: Yup.string().optional(),
    phoneNumber: Yup.string().optional(), // Add suitable validation
    national_id: Yup.string().optional(), // Add suitable validation
    gender: Yup.string().optional(),
    state: Yup.string().optional(),
    city: Yup.string().optional(),
    job: Yup.string().optional(),
    profileImage: Yup.string().optional(),

    // acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
  })

  const [states, setStates] = useState<ILocation[]>([])
  const [cities, setCities] = useState<ILocation[]>([]) // for storing cities based on selected state
  useEffect(() => {
    fetchStates().then((data) => setStates(data))
    // similarly for fetchCities if needed
  }, [])

  const handleStateChange = async (event) => {
    const stateValue = event.target.value
    formik.setFieldValue('state', stateValue) // update formik state
    formik.setFieldValue('city', '')
    // Fetch the cities based on the selected state
    const citiesData = await fetchCities(stateValue) // here, stateValue should be the stateId you wish to use for the lookup
    if (citiesData) {
      setCities(citiesData)
    } else {
      // handle the scenario when fetching cities fails
      setCities([])
    }
  }

  const initialValues = {
    eventAddress: {},
    writingArticles: {},
    dates: {},
    description: '',
    aboutHtml: '',
    poster: '',
    headerImage: '',
    faTitle: '',
    enTitle: '',
    // acceptTerms: false,
  }

  const getChangedValues = (initialValues, currentValues) => {
    let changes = {}
    Object.keys(currentValues).forEach((key) => {
      // If the current form values are different from the initial ones, add them to the changes object.
      if (currentValues[key] !== initialValues[key]) {
        // changes[key] = currentValues[key]
        if (key === 'teasers') {
          // ایجاد یک نسخه جدید از teasers بدون فیلد _id
          changes[key] = currentValues[key].map(({_id, ...rest}) => rest)
        } else {
          changes[key] = currentValues[key]
        }
      }
    })
    changes.dates = {
      start: changeFormat(currentValues.dates.start),
      // ... سایر فیلدهای تاریخ
    }
    return {
      ...changes,
      writingArticles: currentValues.writingArticles,
      dates: {
        start: changeFormat(currentValues.dates.start),
        end: changeFormat(currentValues.dates.end),
        startArticle: changeFormat(currentValues.dates.startArticle),
        endArticle: changeFormat(currentValues.dates.endArticle),
        refeeResult: changeFormat(currentValues.dates.refeeResult),
        editArticle: changeFormat(currentValues.dates.editArticle),
        lastRegistration: changeFormat(currentValues.dates.lastRegistration),
      },
    }
  }

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const formik = useFormik({
    initialValues: eventDetails.eventDetails.eventDetails || initialValues,
    validationSchema: updaetSchema,
    onSubmit: (values, {setSubmitting, setFieldError, setStatus, resetForm}) => {
      setLoading(true)
      const changedValues = getChangedValues(formik.initialValues, values)
      updateEvent(changedValues)
        .then((res) => {
          setLoading(false)
          setSubmitting(false)

          // Set the success message
          // setSuccessMessage(res.data.message)

          // Clear any previous status or errors
          setStatus('')
          // resetForm({values: res.data.data}) // Reset the form with the new data
        })
        .catch((error) => {
          setSubmitting(false)
          setLoading(false)

          if (isCustomError(error)) {
            setSuccessMessage('')

            const errorMessage = error.response.data.message
            setStatus(errorMessage)

            const fieldErrors = error.response.data.errors
            if (fieldErrors) {
              Object.keys(fieldErrors).forEach((field) => {
                setFieldError(field, fieldErrors[field].join(', '))
              })
            }
          } else {
            setStatus('The registration details are incorrect.')
          }
        })
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
  const transformResponseData = (responseData) => {
    const {name, path, mimetype} = responseData

    // Extracting title from the name (assuming the name contains the title)
    const title = name.split('.')[0]

    // Mapping file format based on mimetype
    const format = (() => {
      if (mimetype.includes('pdf')) return 'pdf'
      if (mimetype.includes('word')) return 'doc'
      if (mimetype.includes('pptx') || mimetype.includes('ppt')) return 'pptx'

      // Add more mappings for other formats as needed
      return 'unknown'
    })()

    // Mapping image paths based on file format
    const imagePaths = {
      pdf: 'public\\uploads\\writingArticles\\pdf.png',
      doc: 'public\\uploads\\writingArticles\\word.jpg',
      pptx: 'public\\uploads\\writingArticles\\powerpoint.png',
      // Add more mappings for other formats as needed
      unknown: 'public\\uploads\\writingArticles\\default.png', // Default image path for unknown formats
    }

    // Setting the image path based on the file format
    const image = imagePaths[format] || imagePaths.unknown

    // Setting the image path (you may need to adjust this based on your file structure)

    // Creating the transformed object
    const transformedObject = {
      title,
      image,
      format,
      description: `فایل ${format}`, // You can customize the description as needed
      path, // You may want to set this to something meaningful based on your requirements
    }

    return transformedObject
  }

  // Example usage within your handleWritings function
  const handleWritings = async (event, name) => {
    try {
      const files = event.currentTarget.files
      if (!files) return

      const currentPaths = formik.values[name] || []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const response = await profileImage(file, name)

        if (response.data.status === 'success') {
          const transformedData = transformResponseData(response.data.data[name][0])
          currentPaths.files.push(transformedData)
        } else {
          console.error(
            `Error uploading file ${i + 1}:`,
            response.data.message || 'Error uploading file.'
          )
        }
      }

      formik.setFieldValue('writingArticles', currentPaths)
    } catch (error: any) {
      console.error('Error during image upload:', error)

      const errorMessage = error.response ? error.response.data.message : error.message
      formik.setFieldError('writingArticles', errorMessage)
      formik.setStatus('Failed to upload image(s)')
    }
  }

  useEffect(() => {
    console.log('sssssssssssssssss', formik.values.teasers)
  }, [formik.values])

  return (
    <div className='card mb-5 mb-xl-10'>
      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body p-9'>
            {successMessage && (
              <div className='mb-lg-15 alert alert-success'>
                <div className='alert-text font-weight-bold'>{successMessage}</div>
              </div>
            )}

            {formik.status && (
              <div className='mb-lg-15 alert alert-danger'>
                <div className='alert-text font-weight-bold'>{formik.status}</div>
              </div>
            )}

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'hamayesh.title'})}
              </label>

              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-12 fv-row'>
                    <textarea
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='title'
                      {...formik.getFieldProps('faTitle')}
                    />
                    {formik.touched.faTitle && formik.errors.faTitle && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.faTitle}</div>
                      </div>
                    )}
                  </div>

                  <div className='col-lg-12 fv-row' style={{marginTop: '50px'}}>
                    <textarea
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Last name'
                      {...formik.getFieldProps('enTitle')}
                    />
                    {formik.touched.enTitle && formik.errors.enTitle && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.enTitle}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className='row mb-6' style={{marginTop: '100px'}}>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                {intl.formatMessage({id: 'hamayesh.headerImage'})}
              </label>

              <div className='col-lg-8'>
                <div
                  className='image-input image-input-outline'
                  data-kt-image-input='true'
                  style={{position: 'relative', width: '125px', height: '125px'}} // Adjust dimensions as needed
                >
                  {/* Image will be positioned absolutely to fill the container */}
                  <img
                    className='image-input-wrapper w-300px h-125px'
                    src={
                      formik.values.headerImage
                        ? `${process.env.REACT_APP_BASE_URL}/${formik.values.headerImage}`
                        : toAbsoluteUrl('/media/avatars/blank.png')
                    }
                    alt='Profile'
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // This will ensure the image covers the container
                    }}
                  />
                </div>
              </div>
            </div>

            <div className='row mb-6' style={{marginTop: '100px'}}>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                {intl.formatMessage({id: 'AUTH.INPUT.UPLOAD'})}
              </label>
              <div className='col-lg-8'>
                <input
                  type='file'
                  accept='image/*'
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  onChange={(e) => handleImageChange(e, 'headerImage')}
                />
              </div>
            </div>

            <div className='row mb-6' style={{marginTop: '100px'}}>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                {intl.formatMessage({id: 'hamayesh.poster'})}
              </label>

              <div className='col-lg-6'>
                <div
                  className='image-input image-input-outline'
                  data-kt-image-input='true'
                  style={{position: 'relative', width: '125px', height: '125px'}} // Adjust dimensions as needed
                >
                  {/* Image will be positioned absolutely to fill the container */}
                  <img
                    className='image-input-wrapper w-300px h-125px'
                    src={
                      formik.values.poster
                        ? `${process.env.REACT_APP_BASE_URL}/${formik.values.poster}`
                        : toAbsoluteUrl('/media/avatars/blank.png')
                    }
                    alt='Profile'
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // This will ensure the image covers the container
                    }}
                  />
                </div>
              </div>
            </div>

            <div className='row mb-6' style={{marginTop: '100px'}}>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                {intl.formatMessage({id: 'AUTH.INPUT.UPLOAD'})}
              </label>
              <div className='col-lg-8'>
                <input
                  type='file'
                  accept='image/*'
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  onChange={(e) => handleImageChange(e, 'poster')}
                />
              </div>
            </div>

            <div className='row mb-6' style={{marginTop: '100px'}}>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'hamayesh.ISCCODE'})}
              </label>

              <div className='col-lg-8'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  placeholder='First name'
                  {...formik.getFieldProps('iscCode')}
                />
                {formik.touched.iscCode && formik.errors.iscCode && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.iscCode}</div>
                  </div>
                )}
              </div>
            </div>

            {/* {---------------------------------------------------} */}
            <div className='row mb-4' style={{marginTop: '100px'}}>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                {intl.formatMessage({id: 'teasers'})}
              </label>

              <div className='col-lg-8'>
                <TeaserAdminPanel
                  teasers={formik.values.teasers}
                  onDelete={(index) => {
                    // ایجاد یک نسخه جدید از لیست teasers بدون آیتم حذف شده
                    const updatedTeasers = formik.values.teasers.filter(
                      (item, i) => item._id !== index
                    )
                    // به‌روزرسانی formik.values.teasers
                    formik.setFieldValue('teasers', updatedTeasers)
                  }}
                  formik={formik}
                />
              </div>
            </div>
            {/* {---------------------------------------------------} */}

            <div className='fv-row mb-7' style={{marginTop: '100px'}}>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>
                {' '}
                {intl.formatMessage({id: 'hamayesh.html'})}
              </label>

              <MainCkeditor
                formik={formik}
                formikValue={formik.values.aboutHtml}
                formikName={'aboutHtml'}
              />

              {/* {formik.touched.aboutHtml && formik.errors.aboutHtml && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{HTMLContent(formik.errors.aboutHtml)}</span>
                  </div>
                </div>
              )} */}
              {/* end::Input */}
            </div>

            <div className='row mb-6' style={{marginTop: '100px'}}>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'hamayesh.summary'})}
              </label>

              <div className='col-lg-8'>
                <textarea
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  placeholder='description'
                  {...formik.getFieldProps('description')}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.description}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6' style={{marginTop: '100px'}}>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'hamayesh.dates.start'})}
              </label>
              <div className='col-lg-8'>
                <DatePicker
                  value={formik.values.dates.start}
                  containerClass='col-lg-12'
                  class='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  name={'dates.start'}
                />
              </div>
            </div>

            <div className='row mb-6' style={{marginTop: '20px'}}>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'hamayesh.dates.end'})}
              </label>
              <div className='col-lg-8'>
                <DatePicker
                  value={formik.values.dates.end}
                  containerClass='col-lg-12'
                  class='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  name={'dates.end'}
                  formik={formik}
                />
              </div>
            </div>

            <div className='row mb-6' style={{marginTop: '20px'}}>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'hamayesh.dates.startArticle'})}
              </label>
              <div className='col-lg-8'>
                <DatePicker
                  containerClass='col-lg-12'
                  class='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  name={'dates.startArticle'}
                  value={formik.values.dates.startArticle}
                  formik={formik}
                />
              </div>
            </div>

            <div className='row mb-6' style={{marginTop: '20px'}}>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'hamayesh.dates.endArticle'})}
              </label>
              <div className='col-lg-8'>
                <DatePicker
                  value={formik.values.dates.endArticle}
                  containerClass='col-lg-12'
                  class='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  name={'dates.endArticle'}
                  formik={formik}
                />
              </div>
            </div>

            <div className='row mb-6' style={{marginTop: '20px'}}>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'hamayesh.dates.refeeResult'})}
              </label>
              <div className='col-lg-8'>
                <DatePicker
                  value={formik.values.dates.refeeResult}
                  containerClass='col-lg-12'
                  class='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  name={'dates.refeeResult'}
                  formik={formik}
                />
              </div>
            </div>

            <div className='row mb-6' style={{marginTop: '20px'}}>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'hamayesh.dates.editArticle'})}
              </label>
              <div className='col-lg-8'>
                <DatePicker
                  value={formik.values.dates.editArticle}
                  containerClass='col-lg-12'
                  class='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  name={'dates.editArticle'}
                  formik={formik}
                />
              </div>
            </div>

            <div className='row mb-6' style={{marginTop: '20px'}}>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'hamayesh.dates.lastRegistration'})}
              </label>
              <div className='col-lg-8'>
                <DatePicker
                  value={formik.values.dates.lastRegistration}
                  formik={formik}
                  containerClass='col-lg-12'
                  class='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  name={'dates.lastRegistration'}
                />
              </div>
            </div>

            <div className='fv-row mb-7' style={{marginTop: '100px'}}>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>
                {' '}
                {intl.formatMessage({id: 'article.help'})}
              </label>

              <MainCkeditor
                formik={formik}
                formikValue={formik.values.writingArticles.description}
                formikName={'writingArticles.description'}
              />

              {/* {formik.touched.description && formik.errors.description && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.description}</span>
                  </div>
                </div>
              )} */}
              {/* end::Input */}
            </div>

            <div className='row mb-6' style={{marginTop: '20px'}}>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                {intl.formatMessage({id: 'article.files'})}
              </label>
              <div className='col-lg-8'>
                <input
                  type='file'
                  // accept='image/*'
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  multiple
                  onChange={(e) => handleWritings(e, 'writingArticles')}
                />
              </div>
            </div>

            <div className='row mb-6' style={{marginTop: '100px'}}>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'hamayesh.address'})}
              </label>

              <div className='col-lg-8'>
                <textarea
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  placeholder='First name'
                  {...formik.getFieldProps('eventAddress.address')}
                />
                {formik.touched.eventAddress?.address && formik.errors.eventAddress?.address && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.eventAddress?.address}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'> {intl.formatMessage({id: 'AUTH.INPUT.STATE'})}</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <select
                  className='form-select form-select-solid form-select-lg fw-bold'
                  {...formik.getFieldProps('eventAddress.state')}
                  onChange={(e) => {
                    handleStateChange(e) // then load cities
                  }}
                >
                  <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.STATE'})}</option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>
                      {state.state}
                    </option> // assuming 'id' and 'name' fields exist
                  ))}
                </select>
                {formik.touched.eventAddress?.state && formik.errors.eventAddress?.state && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.eventAddress?.state}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'AUTH.INPUT.CITY'})}
              </label>
              <div className='col-lg-8 fv-row'>
                <select
                  className='form-select form-select-solid form-select-lg'
                  {...formik.getFieldProps('eventAddress.city')}
                >
                  <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.CITY'})}</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.city}
                    </option> // assuming 'id' and 'name' fields exist
                  ))}
                </select>
                {formik.touched.eventAddress?.city && formik.errors.eventAddress?.city && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.eventAddress.city}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary' disabled={loading}>
              {!loading && intl.formatMessage({id: 'AUTH.BOTTUN.SUBMIT'})}{' '}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  {intl.formatMessage({id: 'AUTH.BOTTUN.LOADING'})}{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export {EventDetails}
