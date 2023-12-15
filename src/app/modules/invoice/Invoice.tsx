import React, {FC, useEffect} from 'react'
import {useIntl} from 'react-intl'
import {UserCreatedAt} from '../apps/articles-management/users-list/table/columns/UserCreatedAt'
type Props = {
  invoice?: any
  gateway?: any
}

const Invoice: FC<Props> = ({invoice, gateway}) => {
  const intl = useIntl()

  useEffect(() => {
    console.log('gateway', gateway)
  }, [gateway])

  return (
    <div id='kt_app_content' className='app-content flex-column-fluid'>
      <div id='kt_app_content_container' className='app-container container-xxl'>
        <div className='card'>
          <div className='card-body py-20'>
            <div className='mw-lg-950px mx-auto w-100'>
              <div className='d-flex justify-content-between flex-column flex-sm-row mb-19'>
                <h4 className='fw-bolder text-gray-800 fs-2qx pe-5 pb-7'>
                  {intl.formatMessage({id: 'INVOICE.PAGE.HEADER'})}
                </h4>
                <div className='text-sm-end'>
                  <a href='#'>
                    <img alt='Logo' src='assets/media/svg/brand-logos/duolingo.svg' />
                  </a>

                  <div className='text-sm-end fw-semibold fs-4 text-muted mt-7'>
                    <div>Cecilia Chapman, 711-2880 Nulla St, Mankato</div>
                    <div>Mississippi 96522</div>
                  </div>
                </div>
              </div>
              <div className='border-bottom pb-12'>
                <div className='d-flex flex-row-fluid bgi-no-repeat bgi-position-x-center bgi-size-cover card-rounded h-150px h-lg-250px mb-lg-20'></div>
                <div className='d-flex justify-content-between flex-column flex-md-row'>
                  <div className='flex-grow-1 pt-8 mb-13'>
                    <div className='table-responsive border-bottom mb-14'>
                      <table className='table'>
                        <thead>
                          <tr className='border-bottom fs-6 fw-bold text-muted text-uppercase'>
                            <th className='min-w-175px pb-9'>Description</th>

                            <th className='min-w-70px pb-9 text-end'>Hours</th>
                            <th className='min-w-80px pb-9 text-end'>Rate</th>
                            <th className='min-w-100px pe-lg-6 pb-9 text-end'>Amount</th>
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
                    <div className='d-flex flex-column mw-md-300px w-100'>
                      <div className='fw-semibold fs-5 mb-3 text-dark00'>BANK TRANSFER</div>
                      <div className='d-flex flex-stack text-gray-800 mb-3 fs-6'>
                        <div className='fw-semibold pe-5'>Account Name:</div>
                        <div className='text-end fw-norma'>Barclays UK</div>
                      </div>
                      <div className='d-flex flex-stack text-gray-800 mb-3 fs-6'>
                        <div className='fw-semibold pe-5'>Account Number:</div>
                        <div className='text-end fw-norma'>1234567890934</div>
                      </div>
                      <div className='d-flex flex-stack text-gray-800 fs-6'>
                        <div className='fw-semibold pe-5'>Code:</div>
                        <div className='text-end fw-norma'>BARC0032UK</div>
                      </div>
                    </div>
                  </div>
                  <div className='border-end d-none d-md-block mh-550px mx-9'></div>
                  <div className='text-end pt-10'>
                    <div className='fs-3 fw-bold text-muted mb-3'>TOTAL AMOUNT</div>
                    <div className='fs-xl-2x fs-2 fw-bolder'>{invoice?.total}</div>
                    <div className='text-muted fw-semibold'>Taxes included</div>
                    <div className='border-bottom w-100 my-7 my-lg-16'></div>
                    <div className='text-gray-600 fs-6 fw-semibold mb-3'>INVOICE TO.</div>
                    <div className='fs-6 text-gray-800 fw-semibold mb-8'>
                      {invoice?.user?.firstName} {invoice?.user?.lastName}
                      <br />
                      {invoice?.user?.state},{invoice?.user?.city}
                    </div>
                    <div className='text-gray-600 fs-6 fw-semibold mb-3'>INVOICE NO.</div>
                    <div className='fs-6 text-gray-800 fw-semibold mb-8'>
                      {invoice?.invoiceNumber}
                    </div>
                    <div className='text-gray-600 fs-6 fw-semibold mb-3'>PAYMENT STATUS</div>
                    <div className='fs-6 text-gray-800 fw-semibold mb-8'>
                      {invoice?.paymentStatus}
                    </div>
                    <div className='text-gray-600 fs-6 fw-semibold mb-3'>DATE</div>
                    <div className='fs-6 text-gray-800 fw-semibold'>
                      <UserCreatedAt created_at={invoice?.createdAt} />
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
                  <button type='button' className='btn btn-light-success my-1'>
                    Download
                  </button>
                </div>
                <button type='button' className='btn btn-primary my-1'>
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Invoice
