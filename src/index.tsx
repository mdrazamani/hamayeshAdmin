import {createRoot} from 'react-dom/client'
// Axios
import axios from 'axios'
import {Chart, registerables} from 'chart.js'
import {QueryClient, QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
// Apps
import {MetronicI18nProvider} from './_metronic/i18n/Metronici18n'
import './_metronic/assets/fonticon/fonticon.css'
import './_metronic/assets/keenicons/duotone/style.css'
import './_metronic/assets/keenicons/outline/style.css'
import './_metronic/assets/keenicons/solid/style.css'

// import './_metronic/assets/css/style.rtl.css'
// import './_metronic/assets/sass/style.scss'
import './_metronic/assets/sass/plugins.scss'
import './_metronic/assets/sass/style.react.scss'
import {AppRoutes} from './app/routing/AppRoutes'
import {AuthProvider, setupAxios} from './app/modules/auth'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// ... other imports ...
import StyleLoader from './StyleLoader'

// Retrieve saved language from localStorage
const savedLangSetting = JSON.parse(localStorage.getItem('i18nConfig') || '{}')
const savedLanguage = savedLangSetting.selectedLang
// Check if the saved language is RTL
const isRtlLanguage = ['fa'].includes(savedLanguage)

// Dynamically load RTL or LTR styles
// if (isRtlLanguage) {
//   loadRtlStyles()
// } else {
//   loadLtrStyles()
// }
// Set the direction attribute in the HTML document
const htmlTag = document.documentElement
htmlTag.setAttribute('dir', isRtlLanguage ? 'rtl' : 'ltr')
htmlTag.setAttribute('direction', isRtlLanguage ? 'rtl' : 'ltr')
htmlTag.setAttribute('lang', savedLanguage)
htmlTag.style.direction = isRtlLanguage ? 'rtl' : 'ltr'

/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/**
 * Inject Metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
setupAxios(axios)
Chart.register(...registerables)

const queryClient = new QueryClient()
const container = document.getElementById('root')
if (container) {
  createRoot(container).render(
    <>
      <StyleLoader isRtlLanguage={isRtlLanguage} />

      <QueryClientProvider client={queryClient}>
        <MetronicI18nProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
          <ToastContainer
            position='top-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='colored'
          />
        </MetronicI18nProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}
