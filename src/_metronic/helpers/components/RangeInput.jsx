import React, {useState, useEffect} from 'react'

const RangeInput = ({formik, intl, isUserLoading}) => {
  // Define min and max values for the range
  const min = 0
  const max = 100

  // State to hold the current value of the range
  const [rangeValue, setRangeValue] = useState(formik.values.rate || min)

  // Update range value when formik values change
  useEffect(() => {
    setRangeValue(formik.values.rate)
  }, [formik.values.rate])

  const handleRangeChange = (event) => {
    let value = event.target.value

    // Ensure the value does not exceed the maximum or go below the minimum
    if (value > max) {
      value = max
    } else if (value < min) {
      value = min
    }

    setRangeValue(value)
    formik.setFieldValue('rate', value)
  }
  const handleButtonClick = (value) => {
    setRangeValue(value)
    formik.setFieldValue('rate', value)
  }

  return (
    <div class='d-flex flex-column mb-8 fv-row'>
      <label class='d-flex align-items-center fs-6 fw-semibold mb-2'>
        <span class='required'>{intl.formatMessage({id: 'AUTH.INPUT.RATE'})}</span>
        <span class='ms-1' data-bs-toggle='tooltip' title='Specify the bid amount to place in.'>
          <i class='ki-duotone ki-information-5 text-gray-500 fs-6'>
            <span class='path1'></span>
            <span class='path2'></span>
            <span class='path3'></span>
          </i>
        </span>
      </label>
      <div className='d-flex flex-stack gap-5 mb-3'>
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
        class='form-control form-control-solid mb-3 mb-lg-0'
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

export default RangeInput
