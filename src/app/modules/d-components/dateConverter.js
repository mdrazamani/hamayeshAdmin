import moment from 'jalali-moment'

const convertNumber = (number) => {
  // Replace Persian numerals with Latin numerals
  const latinNumerals = {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
  }

  return number.replace(/[۰-۹]/g, (match) => latinNumerals[match])
}

export default function changeFormat(dateString) {
  // Attempt to parse the date as Jalali
  const jalaliDate = moment(convertNumber(dateString), 'jYYYY/jMM/jDD', true)

  // Check if the parsed date is valid Jalali
  if (jalaliDate.isValid()) {
    return jalaliDate.locale('en').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  } else {
    // If not valid Jalali, assume it's Gregorian and return as is
    return dateString
  }
}
