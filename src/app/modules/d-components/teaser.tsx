import React, {useState} from 'react'
import {Accordion, Card, Button} from 'react-bootstrap'
import {KTSVG} from '../../../_metronic/helpers'
import {fetchCities, fetchStates, profileImage, updateEvent} from '../auth/core/_requests'
import {useIntl} from 'react-intl'
import {v4 as uuidv4} from 'uuid'

type Teaser = {
  _id: string
  title: string
  description: string
  path: string
  cover: string
}

type TeaserAdminPanelProps = {
  teasers: Teaser[]
  onDelete: (index: string) => void
  formik: any // اضافه کردن فرمیک به props
}

const TeaserAdminPanel: React.FC<TeaserAdminPanelProps> = ({teasers, onDelete, formik}) => {
  const [newTeasers, setNewTeasers] = useState<Teaser[]>([])

  const [activeAccordion, setActiveAccordion] = useState(null)

  const [editingTeaser, setEditingTeaser] = useState<Teaser | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [isEditingNew, setIsEditingNew] = useState(false)
  const [isNew, setIsNew] = useState(false)

  const addNewTeaser = () => {
    const newTeaser = {
      _id: uuidv4(), // ایجاد یک شناسه منحصر به فرد با استفاده از uuid
      title: '',
      description: '',
      path: '',
      cover: '',
    }
    formik.setFieldValue('teasers', [...teasers, newTeaser])

    // setNewTeasers([...newTeasers, newTeaser])
  }
  const saveNewTeasers = () => {
    const updatedTeasers = [...formik.values.teasers, ...newTeasers]
    formik.setFieldValue('teasers', updatedTeasers)
    setNewTeasers([]) // پاک کردن آرایه تیزرهای جدید
  }

  const delete_id = () => {
    // حذف فیلد _id و ساختن یک آرایه جدید
    const teasersWithoutId = formik.values.teasers?.map(({_id, ...rest}) => rest) || []

    // به‌روزرسانی مقادیر formik با آرایه جدید
    formik.setFieldValue('teasers', teasersWithoutId)
  }

  const startEditingNew = (teaser: Teaser | null = null, index: Number) => {
    setIsEditingNew(true)
    // toggleAccordion(index)
  }
  const startEditingNewEnd = (teaser: Teaser | null = null, index: Number) => {
    setIsEditingNew(false)
    setActiveAccordion(null)
  }
  // const startEditing = (teaser: Teaser | null = null) => {
  //   setIsEditing(true)
  //   setIsNew(!teaser)
  //   setEditingTeaser(teaser || {title: '', description: '', path: '', cover: ''})
  // }

  // const endEditing = (index: number | null = null) => {
  //   if (index !== null) {
  //     const updatedTeasers = newTeasers.filter((_, teaserIndex) => teaserIndex !== index)
  //     setNewTeasers(updatedTeasers)
  //   }
  //   setIsEditing(false)
  // }

  const endEditing = (_id: string) => {
    const updatedTeasers = newTeasers.filter((teaser) => teaser._id !== _id)
    setNewTeasers(updatedTeasers)
  }

  const saveTeaser = () => {
    let updatedTeasers = formik.values.teasers

    if (isNew) {
      updatedTeasers = [...updatedTeasers, editingTeaser]
    } else {
      updatedTeasers = updatedTeasers.map((t) => (t === editingTeaser ? editingTeaser : t))
    }

    // حذف فیلد _id از هر آیتم در لیست teasers
    const teasersWithoutId = removeIdFromTeasers(updatedTeasers)

    // به‌روزرسانی formik با داده‌های جدید
    formik.setFieldValue('teasers', teasersWithoutId)

    setIsEditing(false)
    setIsNew(false)
    setEditingTeaser(null)
  }

  const intl = useIntl()
  const renderAccordionIcon = (index: number) => {
    return activeAccordion === index ? (
      <KTSVG
        path='/media/icons/duotune/arrows/arr003.svg'
        className='svg-icon-muted svg-icon-1hx'
      />
    ) : (
      <KTSVG
        path='/media/icons/duotune/arrows/arr004.svg'
        className='svg-icon-muted svg-icon-1hx'
      />
    )
  }

  // const handleDelete = (index: number) => {
  //   // حذف تیزر از لیست teasers
  //   const newTeasers = teasers.filter((_, i) => i !== index)
  //   onDelete(index) // اگر عملیات دیگری لازم است

  //   // به‌روزرسانی formik.values.teasers
  //   formik.setFieldValue('teasers', newTeasers)
  // }

  const toggleAccordion = (index: any) => {
    if (isEditingNew === false) setActiveAccordion(activeAccordion === index ? null : index)
  }

  const removeIdFromTeasers = (teasers: any) => {
    return teasers.map(({_id, ...rest}) => rest)
  }

  const handleImageChange = async (event, name, id) => {
    const files = event.currentTarget.files
    if (!files) return

    try {
      // Find the index of the teaser to be updated
      const teaserIndex = formik.values.teasers.findIndex((teaser) => teaser._id === id)
      if (teaserIndex === -1) {
        console.error('Teaser not found')
        return
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const response = await profileImage(file, name)

        if (response.data.status === 'success') {
          const imagePath = response.data.data[name][0].path

          // Update the teaser's path
          const updatedTeasers = [...formik.values.teasers]
          updatedTeasers[teaserIndex] = {
            ...updatedTeasers[teaserIndex],
            [name]: imagePath,
          }

          // Update the formik state
          formik.setFieldValue('teasers', updatedTeasers)
        } else {
          console.error(
            `Error uploading file ${i + 1}:`,
            response.data.message || 'Error uploading file.'
          )
        }
      }
    } catch (error: any) {
      console.error('Error during image upload:', error)
      const errorMessage = error.response ? error.response.data.message : error.message
      formik.setFieldError(name, errorMessage)
      formik.setStatus('Failed to upload image(s)')
    }
  }

  const handleTeaserInputChange = (e, index, field) => {
    const updatedTeasers = [...newTeasers]
    updatedTeasers[index] = {...updatedTeasers[index], [field]: e.target.value}
    setNewTeasers(updatedTeasers)
  }

  const handleImageChangeAdd = (e, index, field) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const updatedTeasers = [...newTeasers]
        updatedTeasers[index] = {...updatedTeasers[index], [field]: e.target.result}
        setNewTeasers(updatedTeasers)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <>
      {/* {isEditing && editingTeaser && ( */}

      <Button onClick={() => addNewTeaser()} className='add-teaser-btn' style={{margin: '10px 0'}}>
        <KTSVG
          path='/media/icons/duotune/abstract/abs011.svg'
          className='svg-icon-muted svg-icon-1hx'
        />
      </Button>

      {teasers.map((teaser, index) => (
        <div className='accordion accordion-icon-toggle' id='kt_accordion_2' key={teaser._id}>
          <div
            key={teaser._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              margin: '8px',
              textAlign: 'center',
              padding: '10px',
            }}
          >
            <div
              className={`accordion-header d-flex ${activeAccordion === 1 ? '' : 'collapsed'}`}
              onClick={() => toggleAccordion(1)}
              style={{alignItems: 'center', position: 'relative'}} // اضافه کردن فاصله‌بندی
            >
              <h3 style={{padding: '10px'}}>
                {' '}
                {intl.formatMessage({id: 'addNewTiser'})} - {index + 1}
              </h3>
              <Button
                onClick={() => onDelete(teaser._id)}
                className='remove-teaser-btn'
                style={{margin: '10px', position: 'absolute', left: '0'}}
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen027.svg'
                  className='svg-icon-muted svg-icon-1hx' // کاهش اندازه آیکون
                />
              </Button>
            </div>
            <div
              id={`kt_accordion_2_item_${1}`}
              className={`collapse fs-6  show`}
              style={{padding: '15px'}}
            >
              <input
                type='text'
                className='form-control form-control-lg form-control-solid'
                placeholder='title'
                style={{width: '100%'}}
                // onChange={(e) => handleTeaserInputChange(e, index, 'title')}
                {...formik.getFieldProps(`teasers[${index}].title`)}
              />
              <div style={{height: '20px'}}></div>
              <textarea
                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                placeholder='description'
                // onChange={(e) => handleTeaserInputChange(e, index, 'description')}
                {...formik.getFieldProps(`teasers[${index}].description`)}
              ></textarea>
              <div style={{height: '20px'}}></div>
              <div className='col-3' style={{display: 'inline-block'}}>
                <label htmlFor='file-upload' className='custom-file-upload'>
                  {intl.formatMessage({id: 'cover'})}
                </label>
              </div>
              <div className='col-9' style={{display: 'inline-block'}}>
                <input
                  type='file'
                  accept='image/*'
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  onChange={(e) => handleImageChange(e, 'cover', teaser._id)}
                />
              </div>
              <div style={{height: '20px'}}></div>
              <div className='col-3' style={{display: 'inline-block'}}>
                <label htmlFor='file-upload' className='custom-file-upload'>
                  {intl.formatMessage({id: 'video'})}
                </label>
              </div>
              <div className='col-9' style={{display: 'inline-block'}}>
                <input
                  type='file'
                  accept='video/*'
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  onChange={(e) => handleImageChange(e, 'path', teaser._id)}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col-md-6 col-lg-6'>
                <img
                  src={`${process.env.REACT_APP_BASE_URL}/${teaser.cover}`}
                  alt='cover'
                  style={{
                    maxWidth: '350px',
                    borderRadius: '5px',
                    margin: '20px 0',
                  }} // اضافه کردن حاشیه
                />

                {/* {isEditingNew && (
                  <div>
                    <div style={{height: '30px'}}></div>

                    <div className='col-3' style={{display: 'inline-block'}}>
                      <label htmlFor='file-upload' className='custom-file-upload'>
                        {intl.formatMessage({id: 'cover'})}
                      </label>
                    </div>
                    <div className='col-6' style={{display: 'inline-block'}}>
                      <input
                        type='file'
                        accept='image/*'
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        onChange={(e) => handleImageChange(e, 'cover')}
                      />
                    </div>
                  </div>
                )} */}
              </div>

              <div className='col-md-6 col-lg-6'>
                {teaser.path && (
                  <video width='100%' controls style={{borderRadius: '5px', margin: '60px 0'}}>
                    <source
                      src={`${process.env.REACT_APP_BASE_URL}/${teaser.path}`}
                      type='video/mp4'
                    />
                    Your browser does not support the video tag.
                  </video>
                )}

                {/* {isEditingNew && (
                  <div>
                    <div style={{height: '30px'}}></div>

                    <div className='col-3' style={{display: 'inline-block'}}>
                      <label htmlFor='file-upload' className='custom-file-upload'>
                        {intl.formatMessage({id: 'video'})}
                      </label>
                    </div>
                    <div className='col-6' style={{display: 'inline-block'}}>
                      <input
                        type='file'
                        accept='video/*'
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        onChange={(e) => handleImageChange(e, 'path')}
                      />
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default TeaserAdminPanel
