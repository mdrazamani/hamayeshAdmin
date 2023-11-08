import React from "react"
import DatePicker, { Calendar } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

export default function Example(data) {
  return (
    <div style={{ direction: "rtl" }}>
      <DatePicker
        id={data?.name}
        name={data?.name}
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
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