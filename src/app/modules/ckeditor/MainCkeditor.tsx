import React, {useEffect, useState} from 'react'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import ClassicEditor from '../../../build/ckeditor'
import './style.css'

const decodeHtmlEntities = (input: any) => {
  if (input !== null) {
    return input.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  } else {
    return input
  }
}

export default function MainCkeditor({formik, formikValue, formikName}) {
  const [editorContent, setEditorContent] = useState('')

  // useEffect(() => {
  //   setEditorContent(decodeHtmlEntities(formikValue))
  // }, [formikValue])

  useEffect(() => {
    if (formikValue !== undefined) {
      setEditorContent(decodeHtmlEntities(formikValue))
    }
  }, [formikValue])

  const handleEditorBlur = () => {
    formik.setTouched({...formik.touched, formikName: true})
    formik.setFieldValue(formikName, editorContent)
  }

  const jsGetElement = (type: any) => {
    let elements = document.getElementsByClassName('ck-restricted-editing_mode_standard')

    const applyStyles = (element) => {
      if (type === 'dark') {
        element.style.backgroundColor = 'rgb(30, 30, 45)'
        element.style.color = 'white'
      } else {
        element.style.backgroundColor = 'white'
        element.style.color = 'rgb(7, 20, 55)'
      }
    }

    // MutationObserver برای رصد تغییرات در استایل المنت‌ها
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          applyStyles(mutation.target)
        }
      })
    })

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]

      // اعمال استایل‌ها هنگام بارگذاری
      applyStyles(element)

      // استفاده از MutationObserver برای هر المنت
      observer.observe(element, {attributes: true})
    }
  }

  if (
    localStorage.getItem('kt_theme_mode_value') &&
    localStorage.getItem('kt_theme_mode_value') == 'dark'
  )
    jsGetElement('dark')
  else jsGetElement('light')

  return (
    <CKEditor
      editor={ClassicEditor.Editor}
      data={editorContent}
      onChange={(event, editor) => {
        const data = editor.getData()
        setEditorContent(data)
      }}
      onBlur={handleEditorBlur}
    />
  )
}
