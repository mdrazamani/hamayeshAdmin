import React, {useEffect, useState} from 'react'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import Editor from '../../../build/ckeditor'
import {useThemeMode} from '../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
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
  const {mode} = useThemeMode()

  // useEffect(() => {
  //   setEditorContent(decodeHtmlEntities(formikValue))
  // }, [formikValue])

  useEffect(() => {
    const observers: MutationObserver[] = [] // Array to hold all MutationObserver instances
    jsGetElement(mode, observers)

    return () => {
      // Disconnect each MutationObserver instance
      observers.forEach((observer) => observer.disconnect())
    }
  }, [mode])

  useEffect(() => {
    if (formikValue !== undefined) {
      setEditorContent(decodeHtmlEntities(formikValue))
    }
  }, [formikValue])

  const handleEditorBlur = () => {
    formik.setTouched({...formik.touched, formikName: true})
    formik.setFieldValue(formikName, editorContent)
  }

  const jsGetElement = (type: any, observers: MutationObserver[]) => {
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

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]

      // اعمال استایل‌ها هنگام بارگذاری
      applyStyles(element)

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            applyStyles(mutation.target)
          }
        })
      })

      observer.observe(element, {attributes: true})
      observers.push(observer) // Add the observer to the array
    }
  }

  // if (
  //   localStorage.getItem('kt_theme_mode_value') &&
  //   localStorage.getItem('kt_theme_mode_value') == 'dark'
  // )
  //   jsGetElement('dark')
  // else jsGetElement('light')

  return (
    <CKEditor
      editor={Editor.Editor}
      data={editorContent}
      onChange={(event, editor) => {
        const data = (editor as any).getData()
        setEditorContent(data)
      }}
      onBlur={handleEditorBlur}
    />
  )
}
