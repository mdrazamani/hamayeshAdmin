/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {useQueryResponseLoading, useQueryResponsePagination} from '../../core/QueryResponseProvider'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {PaginationState} from '../../../../../../../_metronic/helpers'
import {useMemo} from 'react'
import {useIntl} from 'react-intl'

const mappedLabel = (label: string, savedLanguage): string => {
  if (label === '&laquo; Previous') {
    return savedLanguage === 'fa' ? 'قبلی' : 'Previous'
  }

  if (label === 'Next &raquo;') {
    return savedLanguage === 'fa' ? 'بعدی' : 'Next'
  }

  return label
}

const UsersListPagination = () => {
  const intl = useIntl()
  const pagination = useQueryResponsePagination()
  const isLoading = useQueryResponseLoading()
  const {updateState} = useQueryRequest()
  const updatePage = (page: number | undefined | null) => {
    if (!page || isLoading || pagination.page === page) {
      return
    }

    updateState({page, items_per_page: pagination.items_per_page || 10})
  }
  const savedLangSetting = JSON.parse(localStorage.getItem('i18nConfig') || '{}')
  const savedLanguage = savedLangSetting.selectedLang || 'fa'

  const PAGINATION_PAGES_COUNT = 5
  const sliceLinks = (pagination?: PaginationState) => {
    if (!pagination?.links?.length) {
      return []
    }

    let scopedLinks = [...pagination.links]

    let pageLinks: Array<{
      label: string
      active: boolean
      url: string | null
      page: number | null
    }> = []
    let previousLink: {label: string; active: boolean; url: string | null; page: number | null} =
      scopedLinks.shift()!
    let nextLink: {label: string; active: boolean; url: string | null; page: number | null} =
      scopedLinks.pop()!

    const halfOfPagesCount = Math.floor(PAGINATION_PAGES_COUNT / 2)

    pageLinks.push(previousLink)

    if (
      pagination.page <= Math.round(PAGINATION_PAGES_COUNT / 2) ||
      scopedLinks.length <= PAGINATION_PAGES_COUNT
    ) {
      pageLinks = [...pageLinks, ...scopedLinks.slice(0, PAGINATION_PAGES_COUNT)]
    }

    if (
      pagination.page > scopedLinks.length - halfOfPagesCount &&
      scopedLinks.length > PAGINATION_PAGES_COUNT
    ) {
      pageLinks = [
        ...pageLinks,
        ...scopedLinks.slice(scopedLinks.length - PAGINATION_PAGES_COUNT, scopedLinks.length),
      ]
    }

    if (
      !(
        pagination.page <= Math.round(PAGINATION_PAGES_COUNT / 2) ||
        scopedLinks.length <= PAGINATION_PAGES_COUNT
      ) &&
      !(pagination.page > scopedLinks.length - halfOfPagesCount)
    ) {
      pageLinks = [
        ...pageLinks,
        ...scopedLinks.slice(
          pagination.page - 1 - halfOfPagesCount,
          pagination.page + halfOfPagesCount
        ),
      ]
    }

    pageLinks.push(nextLink)

    return pageLinks
  }

  const paginationLinks = useMemo(() => sliceLinks(pagination), [pagination])

  console.log(paginationLinks)

  return (
    <div className='row'>
      <div className='col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'></div>
      <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
        <div id='kt_table_users_paginate'>
          <ul className='pagination'>
            <li
              className={clsx('page-item', {
                disabled: isLoading || pagination.page === 1,
              })}
            >
              <a onClick={() => updatePage(1)} style={{cursor: 'pointer'}} className='page-link'>
                {intl.formatMessage({
                  id: 'FIRST.PAGE',
                })}
              </a>
            </li>
            {paginationLinks
              ?.map((link) => {
                return {...link, label: mappedLabel(link.label, savedLanguage)}
              })
              .map((link) => (
                <li
                  key={link.label}
                  className={clsx('page-item', {
                    active: pagination.page === link.page,
                    disabled: isLoading,
                    previous: link.label === 'قبلی',
                    next: link.label === 'بعدی',
                  })}
                >
                  <a
                    className={clsx('page-link', {
                      'page-text': link.label === 'قبلی' || link.label === 'بعدی',
                      'me-5': link.label === 'قبلی',
                    })}
                    onClick={() => updatePage(link.page)}
                    style={{cursor: 'pointer'}}
                  >
                    {mappedLabel(link.label, savedLanguage)}
                  </a>
                </li>
              ))}
            <li
              className={clsx('page-item', {
                disabled: isLoading || pagination.page === pagination.links?.length! - 2,
              })}
            >
              <a
                onClick={() => updatePage(pagination.links?.length! - 2)}
                style={{cursor: 'pointer'}}
                className='page-link'
              >
                {intl.formatMessage({
                  id: 'LAST.PAGE',
                })}{' '}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export {UsersListPagination}