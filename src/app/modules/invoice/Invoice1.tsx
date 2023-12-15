import axios from 'axios'
import React, {FC, useEffect} from 'react'
import {useIntl} from 'react-intl'
import {QueryClient, useMutation} from 'react-query'
import {ID} from '../../../_metronic/helpers'
import {UserCreatedAt} from '../apps/articles-management/users-list/table/columns/UserCreatedAt'
type Props = {
  invoice?: any
  gateway?: any
}
const API_URL = process.env.REACT_APP_API_URL
const GET_USERS_URL = `${API_URL}/billing/payment`

const Invoice1: FC<Props> = ({invoice, gateway}) => {
  const intl = useIntl()

  useEffect(() => {
    console.log('gateway', gateway)
  }, [gateway])

  useEffect(() => {
    console.log('invoice', invoice)
  }, [invoice])

  const payment = (invoice: ID, gateway: ID): Promise<void> => {
    const data = {
      invoice: invoice,
      gateway: gateway,
    }
    return axios.post(`${GET_USERS_URL}`, data).then((response) => {
      debugger
      const htmlDoc = new DOMParser().parseFromString(response.data, 'text/html')
      const formElement = htmlDoc.querySelector('form')
      const formAction = formElement ? formElement.action : ''
      const formData = formElement ? new FormData(formElement) : new FormData()

      // Dynamically create a form in the document
      const dynamicForm = document.createElement('form')
      dynamicForm.action = formAction
      dynamicForm.method = 'POST'

      // Append form fields to the dynamic form
      formData.forEach((value, key) => {
        const inputField = document.createElement('input')
        inputField.type = 'hidden'
        inputField.name = key
        inputField.value = value.toString()
        dynamicForm.appendChild(inputField)
      })

      // Append the dynamic form to the document and submit it
      document.body.appendChild(dynamicForm)
      dynamicForm.submit()
    })
  }

  const payItem = useMutation(() => payment(invoice.id, gateway.data[0]._id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {},
  })

  return (
    <div className='card'>
      <div className='card-body p-lg-20'>
        <div className='d-flex flex-column flex-xl-row'>
          <div className='flex-lg-row-fluid me-xl-18 mb-10 mb-xl-0'>
            <div className='mt-n1'>
              <div className='d-flex flex-stack pb-10'>
                <a href='#'>
                  <img alt='Logo' src='assets/media/svg/brand-logos/code-lab.svg' />
                </a>
                <a href='#' className='btn btn-sm btn-success'>
                  Pay Now
                </a>
              </div>
              <div className='m-0'>
                <div className='fw-bold fs-3 text-gray-800 mb-8'>
                  Invoice #{invoice?.invoiceNumber}
                </div>
                <div className='row g-5 mb-11'>
                  <div className='col-sm-6'>
                    <div className='fw-semibold fs-7 text-gray-600 mb-1'>Issue Date:</div>
                    <div className='fw-bold fs-6 text-gray-800'>
                      {' '}
                      <UserCreatedAt created_at={invoice?.createdAt} />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <div className='fw-semibold fs-7 text-gray-600 mb-1'>Due Date:</div>
                    <div className='fw-bold fs-6 text-gray-800 d-flex align-items-center flex-wrap'>
                      <span className='pe-2'>02 May 2021</span>
                      <span className='fs-7 text-danger d-flex align-items-center'>
                        <span className='bullet bullet-dot bg-danger me-2'></span>Due in 7 days
                      </span>
                    </div>
                  </div>
                </div>
                <div className='row g-5 mb-12'>
                  <div className='col-sm-6'>
                    <div className='fw-semibold fs-7 text-gray-600 mb-1'>Issue For:</div>
                    <div className='fw-bold fs-6 text-gray-800'>KeenThemes Inc.</div>
                    <div className='fw-semibold fs-7 text-gray-600'>
                      8692 Wild Rose Drive
                      <br />
                      Livonia, MI 48150
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <div className='fw-semibold fs-7 text-gray-600 mb-1'>Issued By:</div>
                    <div className='fw-bold fs-6 text-gray-800'>
                      {' '}
                      {invoice?.user?.firstName} {invoice?.user?.lastName}
                    </div>
                    <div className='fw-semibold fs-7 text-gray-600'>
                      {invoice?.user?.state},{invoice?.user?.city}
                      <br />
                      {invoice?.user?.address}{' '}
                    </div>
                  </div>
                </div>
                <div className='flex-grow-1'>
                  <div className='table-responsive border-bottom mb-9'>
                    <table className='table mb-3'>
                      <thead>
                        <tr className='border-bottom fs-6 fw-bold text-muted'>
                          <th className='min-w-175px pb-2'>Description</th>
                          <th className='min-w-70px text-end pb-2'>Hours</th>
                          <th className='min-w-80px text-end pb-2'>Rate</th>
                          <th className='min-w-100px text-end pb-2'>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items?.map((item) => {
                          return (
                            <tr className='fw-bold text-gray-700 fs-5 text-end'>
                              <td className='d-flex align-items-center pt-11'>
                                <i className='fa fa-genderless text-success fs-1 me-2'></i>
                                {item.item.name}
                              </td>

                              <td className='pt-11'>{item.item.price}</td>
                              <td className='pt-11'>{item.item.additionalInfo.price}</td>
                              <td className='pt-11 fs-5 pe-lg-6 text-dark fw-bolder'>
                                {item.number}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className='d-flex justify-content-end'>
                    <div className='mw-300px'>
                      <div className='d-flex flex-stack mb-3'>
                        <div className='fw-semibold pe-10 text-gray-600 fs-7'>Subtotal:</div>
                        <div className='text-end fw-bold fs-6 text-gray-800'>
                          {invoice?.subtotal}
                        </div>
                      </div>
                      <div className='d-flex flex-stack mb-3'>
                        <div className='fw-semibold pe-10 text-gray-600 fs-7'>VAT 9%</div>
                        <div className='text-end fw-bold fs-6 text-gray-800'>
                          {' '}
                          {invoice?.taxPrice}
                        </div>
                      </div>
                      <div className='d-flex flex-stack mb-3'>
                        <div className='fw-semibold pe-10 text-gray-600 fs-7'>Subtotal + VAT</div>
                        <div className='text-end fw-bold fs-6 text-gray-800'> {invoice?.total}</div>
                      </div>
                      <div className='d-flex flex-stack'>
                        <div className='fw-semibold pe-10 text-gray-600 fs-7'>Total</div>
                        <div className='text-end fw-bold fs-6 text-gray-800'> {invoice?.total}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='m-0'>
            <div className='d-print-none border border-dashed border-gray-300 card-rounded h-lg-100 min-w-md-350px p-9 bg-lighten'>
              <div className='mb-8'>
                {invoice?.paymentStatus === 'pending' && (
                  <span className='badge badge-light-warning'>Pending Payment</span>
                )}
                {invoice?.paymentStatus === 'completed' && (
                  <span className='badge badge-light-success me-2'>Approved</span>
                )}
              </div>
              <h6 className='mb-8 fw-bolder text-gray-600 text-hover-primary'>PAYMENT DETAILS</h6>
              <div className='mb-6'>
                <div className='fw-semibold text-gray-600 fs-7'>Paypal:</div>
                <div className='fw-bold text-gray-800 fs-6'>codelabpay@codelab.co</div>
              </div>
              <div className='mb-6'>
                <div className='fw-semibold text-gray-600 fs-7'>Account:</div>
                <div className='fw-bold text-gray-800 fs-6'>
                  Nl24IBAN34553477847370033
                  <br />
                  AMB NLANBZTC
                </div>
              </div>
              <div className='mb-15'>
                <div className='fw-semibold text-gray-600 fs-7'>Payment Term:</div>
                <div className='fw-bold fs-6 text-gray-800 d-flex align-items-center'>
                  14 days
                  <span className='fs-7 text-danger d-flex align-items-center'>
                    <span className='bullet bullet-dot bg-danger mx-2'></span>Due in 7 days
                  </span>
                </div>
              </div>
              <h6 className='mb-8 fw-bolder text-gray-600 text-hover-primary'>PROJECT OVERVIEW</h6>
              <div className='mb-6'>
                <div className='fw-semibold text-gray-600 fs-7'>Project Name</div>
                <div className='fw-bold fs-6 text-gray-800'>
                  SaaS App Quickstarter
                  <a href='#' className='link-primary ps-1'>
                    View Project
                  </a>
                </div>
              </div>
              <div className='mb-6'>
                <div className='fw-semibold text-gray-600 fs-7'>Completed By:</div>
                <div className='fw-bold text-gray-800 fs-6'>Mr. Dewonte Paul</div>
              </div>
              <div className='m-0'>
                <div className='fw-semibold text-gray-600 fs-7'>Time Spent:</div>
                <div className='fw-bold fs-6 text-gray-800 d-flex align-items-center'>
                  230 Hours
                  <span className='fs-7 text-success d-flex align-items-center'>
                    <span className='bullet bullet-dot bg-success mx-2'></span>35$/h Rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex flex-stack flex-wrap mt-lg-20 pt-13'>
          <div className='my-1 me-5'>
            <button
              type='button'
              className='btn btn-success my-1 me-12'
              onClick={() => window.print()}
              // onClick='window.print();'
            >
              Print Invoice
            </button>
          </div>
          <button
            type='button'
            className='btn btn-primary my-1'
            onClick={async () => await payItem.mutateAsync()}
          >
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  )
}
export default Invoice1
