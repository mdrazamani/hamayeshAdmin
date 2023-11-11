import React from 'react'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import jalaliMoment from 'jalali-moment'

export default function Example(data) {
  return (
    <div style={{direction: 'rtl', flex: '0 0 auto'}}>
      <DatePicker
        value={data?.value}
        onChange={(_, value) => {
          data.formik.setFieldValue(data.name, value.validatedValue[0])
        }}
        containerClassName={data?.containerClass}
        inputClass={data?.class}
        id={data?.name}
        name={data?.name}
        calendar={persian}
        locale={persian_fa}
        calendarPosition='bottom-right'
        // backendFormat='YYYY-MM-DDTHH:mm:ss.SSSZ' // Format for backend value
      />
      {/* {
        for arabic:
        calendar={arabic}
        locale={arabic_ar}
        برای میلادی 
        به این دو تا اصلا نیازی نیست
      } */}
    </div>
  )
}
