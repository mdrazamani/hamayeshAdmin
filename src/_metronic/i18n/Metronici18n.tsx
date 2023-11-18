import axios from 'axios'
import React, {FC, createContext, useContext} from 'react'
import {WithChildren} from '../helpers'

const I18N_CONFIG_KEY = process.env.REACT_APP_I18N_CONFIG_KEY || 'i18nConfig'

type Props = {
  selectedLang: 'de' | 'en' | 'es' | 'fr' | 'ja' | 'zh' | 'fa'
}
const initialState: Props = {
  selectedLang: 'fa',
}

function getConfig(): Props {
  const ls = localStorage.getItem(I18N_CONFIG_KEY)
  if (ls) {
    try {
      return JSON.parse(ls) as Props
    } catch (er) {
      console.error(er)
    }
  }
  return initialState
}

// Side effect
export async function setLanguage(lang: string) {
  localStorage.setItem(I18N_CONFIG_KEY, JSON.stringify({selectedLang: lang}))
  const API_URL = process.env.REACT_APP_API_URL
  const URL = `${API_URL}/set-language`
  try {
    // Making API request to inform the backend about language change
    await axios.post(URL, {language: lang})

    // Updating local storage and refreshing page
    // Set a delay (e.g., 1000 milliseconds = 1 second) before reloading the page
    setTimeout(() => {
      window.location.reload()
    }, 1000) // Adjust the delay as needed
  } catch (error) {
    console.error('Error changing language:', error)
  }
}

const I18nContext = createContext<Props>(initialState)

const useLang = () => {
  return useContext(I18nContext).selectedLang
}

const MetronicI18nProvider: FC<WithChildren> = ({children}) => {
  const lang = getConfig()
  return <I18nContext.Provider value={lang}>{children}</I18nContext.Provider>
}

export {MetronicI18nProvider, useLang}
