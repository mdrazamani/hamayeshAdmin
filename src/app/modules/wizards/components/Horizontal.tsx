import React, {FC, useEffect, useRef, useState} from 'react'
import {Step1} from './steps/Step1'
import {Step2} from './steps/Step2'
import {Step3} from './steps/Step3'
import {Step4} from './steps/Step4'
import {Step5} from './steps/Step5'
import {KTIcon} from '../../../../_metronic/helpers'
import {StepperComponent} from '../../../../_metronic/assets/ts/components'
import {Form, Formik, FormikValues} from 'formik'
import {createAccountSchemas, ICreateAccount, inits} from './CreateAccountWizardHelper'
import {useIntl} from 'react-intl'
import {useAuth} from '../../auth'

const Horizontal: FC = () => {
  const intl = useIntl()
  const stepperRef = useRef<HTMLDivElement | null>(null)
  const stepper = useRef<StepperComponent | null>(null)
  const [currentSchema, setCurrentSchema] = useState(createAccountSchemas[0])
  const [initValues] = useState<ICreateAccount>(inits)
  const [isSubmitButton, setSubmitButton] = useState(false)
  const {pricingPlan} = useAuth()

  const loadStepper = () => {
    stepper.current = StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
  }

  const prevStep = () => {
    if (!stepper.current) {
      return
    }

    stepper.current.goPrev()

    setCurrentSchema(createAccountSchemas[stepper.current.currentStepIndex - 1])

    setSubmitButton(stepper.current.currentStepIndex === stepper.current.totalStepsNumber)
  }

  const submitStep = () => {
    if (!stepper.current) {
      return
    }

    if (stepper.current.currentStepIndex !== stepper.current.totalStepsNumber) {
      stepper.current.goNext()
    } else {
      stepper.current.goto(1)
      // actions.resetForm()
    }

    setSubmitButton(stepper.current.currentStepIndex === stepper.current.totalStepsNumber)

    setCurrentSchema(createAccountSchemas[stepper.current.currentStepIndex - 1])
  }

  useEffect(() => {
    if (!stepperRef.current) {
      return
    }

    loadStepper()
  }, [stepperRef])

  return (
    <div className='card'>
      <div className='card-body'>
        <div
          ref={stepperRef}
          className='stepper stepper-links d-flex flex-column pt-15'
          id='kt_create_account_stepper'
        >
          <div className='stepper-nav mb-5'>
            <div className='stepper-item current' data-kt-stepper-element='nav'>
              <h3 className='stepper-title'>{intl.formatMessage({id: 'BILLING.TYPE'})}</h3>
            </div>

            <div className='stepper-item' data-kt-stepper-element='nav'>
              <h3 className='stepper-title'>
                {intl.formatMessage({id: 'BILLING.WITHOUT.ARTICLE'})}
              </h3>
            </div>

            {/* <div className='stepper-item' data-kt-stepper-element='nav'>
              <h3 className='stepper-title'>{intl.formatMessage({id: 'BILLING.PLAN'})}</h3>
            </div>

            <div className='stepper-item' data-kt-stepper-element='nav'>
              <h3 className='stepper-title'>{intl.formatMessage({id: 'BILLING.COMPLETED'})}</h3>
            </div> */}
          </div>

          <Formik validationSchema={currentSchema} initialValues={initValues} onSubmit={() => {}}>
            {() => (
              <Form className='mx-auto mw-600px w-100 pt-15 pb-10' id='kt_create_account_form'>
                <div className='current' data-kt-stepper-element='content'>
                  <Step1 items={pricingPlan.plans.find((item) => item.type === 'article')} />
                </div>

                <div data-kt-stepper-element='content'>
                  <Step1
                    items={pricingPlan.plans.find((item) => item.type === 'freeRegistration')}
                  />
                </div>

                {/* <div data-kt-stepper-element='content'>
                  <Step1 />
                </div> */}
                {/* 
                <div data-kt-stepper-element='content'>
                  <Step4 />
                </div> */}
                {/* 
                <div data-kt-stepper-element='content'>
                  <Step5 />
                </div> */}

                <div className='d-flex flex-stack pt-15'>
                  <div className='mr-2'>
                    <button
                      onClick={prevStep}
                      type='button'
                      className='btn btn-lg btn-light-primary me-3'
                      data-kt-stepper-action='previous'
                    >
                      <KTIcon iconName='arrow-right' className='fs-3 ms-2 me-0' />
                      {intl.formatMessage({id: 'BILLING.BACK'})}{' '}
                    </button>
                  </div>

                  {!isSubmitButton && (
                    <div>
                      <button
                        onClick={submitStep}
                        type='button'
                        className='btn btn-lg btn-primary me-3'
                      >
                        <span className='indicator-label'>
                          {intl.formatMessage({id: 'BILLING.NEXT'})}
                          <KTIcon iconName='arrow-left' className='fs-4 me-1' />
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export {Horizontal}
