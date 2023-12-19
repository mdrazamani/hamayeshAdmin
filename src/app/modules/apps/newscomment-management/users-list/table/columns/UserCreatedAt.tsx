import {FC} from 'react'

type Props = {
  created_at?: string
}

const UserCreatedAt: FC<Props> = ({created_at}) => {
  const savedLangSetting = JSON.parse(localStorage.getItem('i18nConfig') || '{}')
  const savedLanguage = savedLangSetting.selectedLang || 'fa'

  // Check if 'created_at' is provided
  if (!created_at) return null

  // Create a date object from the 'created_at' string
  const date = new Date(created_at)

  // Use 'navigator.language' to get the user's locale or default to 'en-US'

  // Options for formatting the date, with types specified
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false, // if you want to explicitly specify 12-hour time format
  }

  // Specify Persian locale and calendar
  // Locale and additional options based on savedLanguage
  let locale = savedLanguage === 'fa' ? 'fa-IR' : 'en-US'
  let additionalOptions = {}

  if (savedLanguage === 'fa') {
    additionalOptions = {
      calendar: 'persian',
      numberingSystem: 'latn',
    }
  }

  // Combine the common and additional options
  const finalOptions = {...options, ...additionalOptions}

  // Format the date based on the user's locale
  const formattedDate = new Intl.DateTimeFormat(locale, finalOptions).format(date)

  return <div className='badge badge-light fw-bolder'>{formattedDate}</div>
}

export {UserCreatedAt}
