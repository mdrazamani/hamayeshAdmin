// @ts-nocheck

import axios from 'axios'
import React, {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {QueryClient, useMutation} from 'react-query'
import {useLocation} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {ID} from '../../../_metronic/helpers'
import {UserCreatedAt} from '../apps/articles-management/users-list/table/columns/UserCreatedAt'
type Props = {
  invoice?: any
  gateway?: any
}
const API_URL = process.env.REACT_APP_API_URL
const GET_USERS_URL = `${API_URL}/billing/payment/verify`

const Subscription: FC<Props> = ({invoice, gateway}) => {
  const intl = useIntl()

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const status = queryParams.get('status')
  const token = queryParams.get('token')

  const [paymentStatus, setPeymentStatus] = useState()

  useEffect(() => {
    if (status && token) {
      // Make your axios request here
      axios
        .post(`${GET_USERS_URL}`, {status, token})
        .then((response) => {
          setPeymentStatus(response.data.data)
        })
        .catch((error) => {
          // Handle errors
        })
    }

    // const redirectTimeout = setTimeout(() => {
    //   window.location.href = `${YOUR_REDIRECT_URL}`
    // }, 5000)

    // return () => clearTimeout(redirectTimeout)
  }, [status, token])

  useEffect(() => {
    console.log(paymentStatus?.status)
  }, [paymentStatus])

  return (
    <div
      className='scroll-y flex-column-fluid px-10 py-10'
      data-kt-scroll='true'
      data-kt-scroll-activate='true'
      data-kt-scroll-height='auto'
      data-kt-scroll-dependencies='#kt_app_header_nav'
      data-kt-scroll-offset='5px'
      data-kt-scroll-save-state='true'
      style={{
        backgroundColor: '#D5D9E2',
        '--kt-scrollbar-color': '#d9d0cc',
        '--kt-scrollbar-hover-color': '#d9d0cc',
      }}
    >
      <style>{`
        html,body { padding:0; margin:0; font-family: Inter, Helvetica, "sans-serif"; } a:hover { color: #009ef7; }
      `}</style>
      <div
        id='kt_app_body_content'
        style={{
          backgroundColor: '#D5D9E2',
          fontFamily: 'Arial, Helvetica, sans-serif',
          lineHeight: 1.5,
          minHeight: '100%',
          fontWeight: 'normal',
          fontSize: '15px',
          color: '#2F3044',
          margin: 0,
          padding: 0,
          width: '100%',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '45px 0 34px 0',
            borderRadius: '24px',
            margin: '40px auto',
            maxWidth: '600px',
          }}
        >
          <table
            align='center'
            border='0'
            cellpadding='0'
            cellspacing='0'
            width='100%'
            height='auto'
            style={{borderCollapse: 'collapse'}}
          >
            <tbody>
              <tr>
                <td
                  align='center'
                  valign='center'
                  style={{textAlign: 'center', paddingBottom: '10px'}}
                >
                  <div style={{textAlign: 'center', margin: '0 60px 34px 60px'}}>
                    {/* <div style={{marginBottom: '10px'}}>
                      <a href='https://keenthemes.com' rel='noopener' target='_blank'>
                        <img
                          alt='Logo'
                          src={toAbsoluteUrl('/media/email/logo-1.svg')}
                          style={{height: '35px'}}
                        />
                      </a>
                    </div> */}
                    <div style={{marginBottom: '15px'}}>
                      <img
                        alt='Logo'
                        src={toAbsoluteUrl('/media/email/icon-positive-vote-4.svg')}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '42px',
                        fontFamily: 'Arial, Helvetica, sans-serif',
                      }}
                    >
                      <p
                        style={{
                          marginBottom: '9px',
                          color: paymentStatus?.status ? '#50cd89' : '#f1416c',
                          fontSize: '22px',
                          fontWeight: '700',
                        }}
                      >
                        {paymentStatus?.message}
                      </p>
                      {!paymentStatus?.status && (
                        <p style={{marginBottom: '2px', color: '#7E8299'}}>
                          {intl.formatMessage({id: 'PAYMENT.MESSAGE'})}{' '}
                        </p>
                      )}
                    </div>
                    <div style={{marginBottom: '15px'}}>
                      <h3
                        style={{
                          textAlign: 'right',
                          color: '#181C32',
                          fontSize: '18px',
                          fontWeight: '600',
                          marginBottom: '22px',
                        }}
                      >
                        {intl.formatMessage({id: 'PAYMENT.ORDER.SUMMERY'})}{' '}
                      </h3>
                      {paymentStatus && (
                        <div style={{paddingBottom: '9px'}}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              color: '#7E8299',
                              fontSize: '14px',
                              fontWeight: '500',
                              marginBottom: '8px',
                              fontFamily: 'Arial, Helvetica, sans-serif',
                            }}
                          >
                            <div>{paymentStatus?.invoice?.items[0]?.item?.name}</div>
                            <div>ریال {paymentStatus?.invoice?.subtotal}</div>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              color: '#7E8299',
                              fontSize: '14px',
                              fontWeight: '500',
                              fontFamily: 'Arial, Helvetica, sans-serif',
                            }}
                          >
                            <div>
                              {' '}
                              {intl.formatMessage({id: 'INVOICE.VALT'})}
                              (9%)
                            </div>
                            <div>ریال {paymentStatus?.invoice?.taxPrice}</div>
                          </div>
                          <div
                            className='separator separator-dashed'
                            style={{margin: '15px 0'}}
                          ></div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              color: '#7E8299',
                              fontSize: '14px',
                              fontWeight: '500',
                              fontFamily: 'Arial, Helvetica, sans-serif',
                            }}
                          >
                            <div> {intl.formatMessage({id: 'INVOICE.TOTAL'})}</div>
                            <div
                              style={{
                                color: paymentStatus?.status ? '#50cd89' : '#f1416c',
                                fontWeight: '700',
                                fontFamily: 'Arial, Helvetica, sans-serif',
                              }}
                            >
                              ریال {paymentStatus?.invoice?.total}{' '}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <a
                      href='../../billing/invoice-management/invoice'
                      target='_blank'
                      style={{
                        backgroundColor: paymentStatus?.status ? '#50cd89' : '#f1416c',
                        borderRadius: '6px',
                        display: 'inline-block',
                        padding: '11px 19px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {intl.formatMessage({id: 'BACK.PANEL'})}
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default Subscription
