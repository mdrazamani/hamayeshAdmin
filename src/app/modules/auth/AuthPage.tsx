import {Route, Routes} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'
import {AuthLayout} from './AuthLayout'
import {ResetPassword} from './components/ResetPassword'
import {useAuth} from './core/Auth'

const AuthPage = () => {
  const {pricingPlan, setPricingPlan} = useAuth()

  return (
    <Routes>
      <Route element={<AuthLayout pricingPlan={pricingPlan} />}>
        <Route path='login' element={<Login />} />
        <Route path='registration' element={<Registration setPricingPlan={setPricingPlan} />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='reset-password' element={<ResetPassword />} />
        <Route index element={<Login />} />
      </Route>
    </Routes>
  )
}
export {AuthPage}
