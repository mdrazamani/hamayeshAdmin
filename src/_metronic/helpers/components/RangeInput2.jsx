import React, {useState, useEffect} from 'react'

const RangeInput2 = ({formik, intl, isUserLoading, rateIndex}) => {
  const min = 0
  const max = 100

  // Initialize rangeValue to the value of the specific rate or default to min
  const [rangeValue, setRangeValue] = useState(formik.values.rates[rateIndex]?.rate || min)

  // Update range value when the specific rate's value in formik changes
  useEffect(() => {
    setRangeValue(formik.values.rates[rateIndex]?.rate || min)
  }, [formik.values.rates, rateIndex])

  useEffect(() => {
    console.log(formik.values.rates[rateIndex]?.rate)
  }, [formik.values.rates, rateIndex])

  const handleRangeChange = (event) => {
    let value = parseInt(event.target.value, 10)
    value = Math.max(min, Math.min(max, value)) // Ensure value is within min and max

    setRangeValue(value)
    formik.setFieldValue(`rates[${rateIndex}].rate`, value)
  }

  const handleButtonClick = (value) => {
    setRangeValue(value)
    formik.setFieldValue(`rates[${rateIndex}].rate`, value)
  }

  return (
    <div className='d-flex flex-column mb-8 fv-row'>
      <div className='d-flex flex-stack gap-5 mb-3'>
        {/* Buttons for predefined values */}
        <button
          type='button'
          className='btn btn-light-primary w-100'
          onClick={() => handleButtonClick(10)}
        >
          10
        </button>
        <button
          type='button'
          className='btn btn-light-primary w-100'
          onClick={() => handleButtonClick(50)}
        >
          50
        </button>
        <button
          type='button'
          className='btn btn-light-primary w-100'
          onClick={() => handleButtonClick(100)}
        >
          100
        </button>
      </div>
      <input
        type='number'
        className='form-control form-control-solid mb-3 mb-lg-0'
        placeholder={intl.formatMessage({id: 'AUTH.INPUT.RATE'})}
        autoComplete='off'
        disabled={formik.isSubmitting || isUserLoading}
        min={min}
        max={max}
        value={rangeValue}
        onChange={handleRangeChange}
      />
    </div>
  )
}

export default RangeInput2
