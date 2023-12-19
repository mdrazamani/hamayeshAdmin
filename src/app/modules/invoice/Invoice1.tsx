import axios from 'axios'
import React, {FC, useEffect} from 'react'
import {useIntl} from 'react-intl'
import {QueryClient, useMutation} from 'react-query'
import {ID, toAbsoluteUrl} from '../../../_metronic/helpers'
import {UserCreatedAt} from '../apps/articles-management/users-list/table/columns/UserCreatedAt'
import {useAuth} from '../auth'
type Props = {
  invoice?: any
  gateway?: any
}
const API_URL = process.env.REACT_APP_API_URL
const GET_USERS_URL = `${API_URL}/billing/payment`

const Invoice1: FC<Props> = ({invoice, gateway}) => {
  const intl = useIntl()
  const {currentUser} = useAuth()

  useEffect(() => {
    console.log('gateway', gateway)
  }, [gateway])

  useEffect(() => {
    console.log('invoice', invoice)
  }, [invoice])

  const payment = (invoice: ID, gateway: ID, userId): Promise<void> => {
    const data = {
      invoice: invoice,
      gateway: gateway,
      ...(currentUser?.role === 'admin' ? {userId} : {}),
    }
    return axios
      .post(`${GET_USERS_URL}`, data)
      .then((response) => {
        const redirectUrl = response.data.data.redirectUrl

        // Redirect the user to the payment gateway URL
        window.location.href = redirectUrl
      })
      .catch((error) => {})
  }

  const payItem = useMutation(() => payment(invoice.id, gateway.data[0]._id, invoice?.user?.id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {},
  })

  return (
    <div className='card'>
      <div className='card-body p-lg-20'>
        <div className='d-flex flex-column flex-xl-row'>
          <div className='flex-lg-row-fluid me-xl-18 mb-10 mb-xl-0'>
            <div className='mt-n1'>
              <div className='m-0'>
                <div className='fw-bold fs-3 text-gray-800 mb-8'>
                  {intl.formatMessage({id: 'INVOICE.NUMBER'})} {invoice?.invoiceNumber}
                </div>
                <div className='row g-5 mb-11'>
                  <div className='col-sm-6'>
                    <div className='fw-semibold fs-7 text-gray-600 mb-1'>
                      {' '}
                      {intl.formatMessage({id: 'INVOICE.ISSUE.DATE'})}
                    </div>
                    <div className='fw-bold fs-6 text-gray-800'>
                      {' '}
                      <UserCreatedAt created_at={invoice?.createdAt} />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <div className='fw-semibold fs-7 text-gray-600 mb-1'>
                      {' '}
                      {intl.formatMessage({id: 'INVOICE.DUE.DATE'})}
                    </div>
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
                    <div className='fw-semibold fs-7 text-gray-600 mb-1'>
                      {' '}
                      {intl.formatMessage({id: 'INVOICE.ISSUE.FOR'})}
                    </div>
                    <div className='fw-bold fs-6 text-gray-800'>{invoice.organizer?.name}</div>
                    <div className='fw-semibold fs-7 text-gray-600'>
                      {invoice?.organizer?.details?.address?.state}{' '}
                      {invoice?.organizer?.details?.address?.city}
                      <br />
                      {invoice?.organizer?.details?.address?.address}
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <div className='fw-semibold fs-7 text-gray-600 mb-1'>
                      {' '}
                      {intl.formatMessage({id: 'INVOICE.ISSUE.BY'})}
                    </div>
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
                          <th className='min-w-100px pb-2'>
                            {' '}
                            {intl.formatMessage({id: 'INVOICE.ITEM.DESC'})}
                          </th>
                          <th className='min-w-70px text-start pb-2'>
                            {' '}
                            {intl.formatMessage({id: 'INVOICE.ITEM.PRICE'})}
                          </th>
                          <th className='min-w-100px text-start pb-2'>
                            {' '}
                            {intl.formatMessage({id: 'INVOICE.ITEM.ADD.PRICE'})}
                          </th>
                          <th className='min-w-100px text-start pb-2'>
                            {' '}
                            {intl.formatMessage({id: 'INVOICE.ITEM.ADD.AMOUNT'})}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items?.map((item) => {
                          return (
                            <tr className='fw-bold text-gray-700 fs-5 text-start'>
                              <td className='d-flex align-items-center pt-11'>
                                <i className='fa fa-genderless text-success fs-1 me-2'></i>
                                {item.item.name}
                              </td>

                              <td className='pt-11'>{item.item.price?.toLocaleString('fa-IR')}</td>
                              <td className='pt-11'>
                                {Number(item.item.additionalInfo?.price || 0)?.toLocaleString(
                                  'fa-IR'
                                )}
                              </td>
                              <td className='pt-11 fs-5 pe-lg-6 text-dark fw-bolder'>
                                {item.number}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className='d-flex justify-content-start'>
                    <div className='mw-300px'>
                      <div className='d-flex flex-stack mb-3'>
                        <div className='fw-semibold pe-10 text-gray-600 fs-7'>
                          {' '}
                          {intl.formatMessage({id: 'INVOICE.SUBTOTAL'})}
                        </div>
                        <div className='text-start fw-bold fs-6 text-gray-800'>
                          {invoice?.subtotal?.toLocaleString('fa-IR')} ریال
                        </div>
                      </div>
                      <div className='d-flex flex-stack mb-3'>
                        <div className='fw-semibold pe-10 text-gray-600 fs-7'>
                          {' '}
                          {intl.formatMessage({id: 'INVOICE.VALT'})}
                          9%
                        </div>
                        <div className='text-start fw-bold fs-6 text-gray-800'>
                          {' '}
                          {invoice?.taxPrice?.toLocaleString('fa-IR')} ریال
                        </div>
                      </div>
                      <div className='d-flex flex-stack mb-3'>
                        <div className='fw-semibold pe-10 text-gray-600 fs-7'>
                          {' '}
                          {intl.formatMessage({id: 'INVOICE.SUBTOTAL'})}+{' '}
                          {intl.formatMessage({id: 'INVOICE.VALT'})}
                        </div>
                        <div className='text-start fw-bold fs-6 text-gray-800'>
                          {' '}
                          {invoice?.total?.toLocaleString('fa-IR')} ریال
                        </div>
                      </div>
                      <div className='d-flex flex-stack'>
                        <div className='fw-semibold pe-10 text-gray-600 fs-7'>
                          {' '}
                          {intl.formatMessage({id: 'INVOICE.TOTAL'})}
                        </div>
                        <div className='text-start fw-bold fs-6 text-gray-800'>
                          {invoice?.total?.toLocaleString('fa-IR')} ریال
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className='m-0'>
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
          </div> */}
        </div>
        <div className='d-flex flex-stack flex-wrap mt-lg-20 pt-13'>
          <div className='my-1 me-5'>
            <button
              type='button'
              className='btn btn-success my-1 me-12'
              onClick={() => window.print()}
              // onClick='window.print();'
            >
              {intl.formatMessage({id: 'INVOICE.PRINT'})}
            </button>
          </div>
          <button
            type='button'
            className='btn btn-primary my-1'
            onClick={async () => await payItem.mutateAsync()}
          >
            {intl.formatMessage({id: 'INVOICE.PAY'})}
          </button>
        </div>
      </div>
    </div>
  )
}
export default Invoice1
