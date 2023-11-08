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

export default (persianDate) => {
  return moment(convertNumber(persianDate), 'jYYYY/jMM/jDD')
    .locale('en')
    .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
}
