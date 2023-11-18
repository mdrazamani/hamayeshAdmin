// StyleLoader.js
import {useEffect} from 'react'

const StyleLoader = ({isRtlLanguage}) => {
  useEffect(() => {
    if (isRtlLanguage) {
      require('./_metronic/assets/css/style.rtl.css')
    } else {
      require('./_metronic/assets/sass/style.scss')
    }
  }, [isRtlLanguage])

  return null // This component does not render anything
}

export default StyleLoader
