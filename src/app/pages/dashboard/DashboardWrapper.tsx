import axios from 'axios'
import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget5,
  ListsWidget6,
  MixedWidget10,
  MixedWidget11,
  MixedWidget2,
  MixedWidget8,
  TablesWidget10,
  TilesWidget1,
  TilesWidget2,
  TilesWidget3,
  TilesWidget4,
  TilesWidget5,
} from '../../../_metronic/partials/widgets'

const DashboardPage = ({dashboardData}) => {
  return (
    <>
      <div className='row g-5 g-xl-8'>
        {/* <div className='col-xl-4'>
          <MixedWidget8
            className='card-xxl-stretch mb-xl-3'
            chartColor='success'
            chartHeight='150px'
          />
        </div> */}

        <div className='col-xl-12'>
          <div className='row gx-5 gx-xl-12 mb-5 mb-xl-12'>
            <div className='col-xl-12'>
              <TilesWidget4 className='card-xl-stretch' />
            </div>
          </div>

          {/* <div className='row gx-12 gx-xl-12 mb-12 mb-xl-12'> */}
          {/* <div className='col-xl-12'> */}
          {/* <TilesWidget2 className='card-xl-stretch mb-5 mb-xl-8' /> */}
          {/* <div className='row gx-5 gx-xl-8'> */}
          {/* {dashboardData.dashboardData?.userCountByRole?.map((data) => {
                  return (
                    <div className='col-xl-2'>
                      <TilesWidget5
                        className='card-xxl-stretch bg-primary mb-10'
                        svgIcon='element-11'
                        titleClass='text-white'
                        descriptionClass='text-white'
                        iconClass='text-white'
                        title={data.count}
                        description={data._id}
                      />
                    </div>
                  )
                })}
                <div className='col-xl-2'>
                  <TilesWidget1 className='card-xl-stretch' />
                </div> */}

          {/* <div className='col-xl-6'>
                  <TilesWidget5
                    className='card-xxl-stretch bg-body'
                    svgIcon='rocket'
                    titleClass='text-dark'
                    descriptionClass='text-muted'
                    iconClass='text-success'
                    title='8,600'
                    description='New Customers'
                  />
                </div> */}
          {/* </div>
            </div> */}
          {/* <div className='col-xl-6'>
              <TilesWidget3 className='card-xl-stretch mb-5 mb-xl-8' />
            </div> */}
          {/* </div> */}
        </div>
      </div>

      {/* begin::Row */}
      <div className='row gy-5 g-xl-8'>
        <div className='col-xxl-4'>
          <MixedWidget2
            className='card-xl-stretch mb-xl-8'
            chartColor='danger'
            chartHeight='200px'
            strokeColor='#cb1e46'
            data={dashboardData?.userCountByRole}
          />
        </div>
        <div className='col-xxl-4'>
          <ListsWidget5 className='card-xxl-stretch' />
        </div>
        <div className='col-xxl-4'>
          <MixedWidget10
            className='card-xxl-stretch-50 mb-5 mb-xl-8'
            chartColor='primary'
            chartHeight='150px'
          />
          <MixedWidget11
            className='card-xxl-stretch-50 mb-5 mb-xl-8'
            chartColor='primary'
            chartHeight='175px'
          />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row gy-5 gx-xl-8'>
        <div className='col-xxl-4'>
          <ListsWidget3 className='card-xxl-stretch mb-xl-3' />
        </div>
        <div className='col-xl-8'>
          <TablesWidget10 className='card-xxl-stretch mb-5 mb-xl-8' />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row gy-5 g-xl-8'>
        <div className='col-xl-4'>
          <ListsWidget2 className='card-xl-stretch mb-xl-8' />
        </div>
        <div className='col-xl-4'>
          <ListsWidget6 className='card-xl-stretch mb-xl-8' />
        </div>
        <div className='col-xl-4'>
          <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} />
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

const API_URL = process.env.REACT_APP_API_URL
const GET_USERS_URL = `${API_URL}/dashboard`

const DashboardWrapper = () => {
  const intl = useIntl()
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Replace with your actual endpoint URL
        const response = await axios.get(GET_USERS_URL)
        setDashboardData(response.data.data)
        setIsLoading(false)
      } catch (err: any) {
        setError(err)
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, []) // Empty dependency array to run only once at component mount

  useEffect(() => {
    console.log(dashboardData)
  }, [dashboardData])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage dashboardData={dashboardData} />
    </>
  )
}

export {DashboardWrapper}
