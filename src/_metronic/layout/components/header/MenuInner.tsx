import {MenuItem} from './MenuItem'
import {MenuInnerWithSub} from './MenuInnerWithSub'
import {MegaMenu} from './MegaMenu'
import {useIntl} from 'react-intl'
import {useAuth} from '../../../../app/modules/auth'

export function MenuInner() {
  const {currentUser} = useAuth()
  const intl = useIntl()

  return (
    <>
      {/* <MenuItem title={intl.formatMessage({id: 'MENU.DASHBOARD'})} to='/dashboard' />
      <MenuItem title='Layout Builder' to='/builder' />
      <MenuInnerWithSub
        title='Crafted'
        to='/crafted'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        <MenuInnerWithSub
          title='Pages'
          to='/crafted/pages'
          icon='element-plus'
          hasArrow={true}
          menuPlacement='left-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuInnerWithSub
            title='Profile'
            to='/crafted/pages/profile'
            hasArrow={true}
            hasBullet={true}
            menuPlacement='left-start'
            menuTrigger={`{default:'click', lg: 'hover'}`}
          >
            <MenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
            <MenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
            <MenuItem to='/crafted/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
            <MenuItem to='/crafted/pages/profile/documents' title='Documents' hasBullet={true} />
            <MenuItem
              to='/crafted/pages/profile/connections'
              title='Connections'
              hasBullet={true}
            />
          </MenuInnerWithSub>
          <MenuInnerWithSub
            title='Wizards'
            to='/crafted/pages/wizards'
            hasArrow={true}
            hasBullet={true}
            menuPlacement='left-start'
            menuTrigger={`{default:'click', lg: 'hover'}`}
          >
            <MenuItem to='/crafted/pages/wizards/horizontal' title='Horizontal' hasBullet={true} />
            <MenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
          </MenuInnerWithSub>
        </MenuInnerWithSub>

        <MenuInnerWithSub
          title='Accounts'
          to='/crafted/accounts'
          icon='profile-circle'
          hasArrow={true}
          menuPlacement='left-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
          <MenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
        </MenuInnerWithSub>

        <MenuInnerWithSub
          title='Errors'
          to='/error'
          icon='fingerprint-scanning'
          hasArrow={true}
          menuPlacement='left-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/error/404' title='Error 404' hasBullet={true} />
          <MenuItem to='/error/500' title='Error 500' hasBullet={true} />
        </MenuInnerWithSub>

        <MenuInnerWithSub
          title='Widgets'
          to='/crafted/widgets'
          icon='element-11'
          hasArrow={true}
          menuPlacement='left-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
          <MenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
          <MenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
          <MenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
          <MenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
          <MenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
        </MenuInnerWithSub>
      </MenuInnerWithSub> */}
      {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
        <MenuInnerWithSub
          title={intl.formatMessage({id: 'MENU.USERS'})}
          to='/users'
          menuPlacement='bottom-start'
          menuTrigger='click'
        >
          <MenuItem
            icon='shield-tick'
            to='/users/user-management/users'
            title={intl.formatMessage({id: 'MENU.USERS.MANAGEMENT'})}
          />
          <MenuItem
            icon='shield-tick'
            to='/users/supporter-management/supporters'
            title={intl.formatMessage({id: 'MENU.SUPPORTERS.MANAGEMENT'})}
          />
          <MenuItem
            icon='shield-tick'
            to='/users/speaker-management/speakers'
            title={intl.formatMessage({id: 'MENU.SPEAKERS.MANAGEMENT'})}
          />
          <MenuItem
            icon='shield-tick'
            to='/users/secretariat-management/secretariats'
            title={intl.formatMessage({id: 'MENU.SECRETARIATES.MANAGEMENT'})}
          />
          <MenuItem
            icon='shield-tick'
            to='/users/organizer-management/organizers'
            title={intl.formatMessage({id: 'MENU.ORGANIZER.MANAGEMENT'})}
          />
        </MenuInnerWithSub>
      )}
      {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
        <MenuInnerWithSub
          title={intl.formatMessage({id: 'MENU.NEWS'})}
          to='/news'
          menuPlacement='bottom-start'
          menuTrigger='click'
        >
          <MenuItem
            icon='shield-tick'
            to='/news/newstag-management/newstags'
            title={intl.formatMessage({id: 'MENU.NEWSTAG.MANEGMENT'})}
          />
          <MenuItem
            icon='shield-tick'
            to='/news/newscomment-management/newscomments'
            title={intl.formatMessage({id: 'MENU.NEWSCOMMENT.MANEGMENT'})}
          />
          <MenuItem
            icon='shield-tick'
            to='/news/newscategory-management/newscategories'
            title={intl.formatMessage({id: 'MENU.NEWSCATEGORY.MANEGMENT'})}
          />

          <MenuItem
            icon='shield-tick'
            to='/news/news-management/news'
            title={intl.formatMessage({id: 'MENU.NEWS.MANEGMENT'})}
          />
        </MenuInnerWithSub>
      )}

      {(currentUser?.role === 'admin' ||
        currentUser?.role === 'referee' ||
        currentUser?.role === 'scientific' ||
        currentUser?.role === 'user') && (
        <MenuInnerWithSub
          title={intl.formatMessage({id: 'MENU.ARTICLE'})}
          to='/articles'
          menuPlacement='bottom-start'
          menuTrigger='click'
        >
          {currentUser?.role !== 'user' && currentUser?.role !== 'referee' && (
            <MenuItem
              icon='shield-tick'
              to='/articles/articlecategories-management/articlecategories'
              title={intl.formatMessage({id: 'MENU.ARTICLECATEGORY.MANAGEMENT'})}
            />
          )}

          <MenuItem
            icon='shield-tick'
            to='/articles/article-management/articles'
            title={intl.formatMessage({id: 'MENU.ARTICLES.MANAGEMENT'})}
          />
        </MenuInnerWithSub>
      )}
      {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
        <>
          {' '}
          <MenuItem
            to='/apps/axies-management/axies'
            title={intl.formatMessage({id: 'MENU.AXIES.MANAGEMENT'})}
          />
          <MenuItem
            to='/apps/question-management/questions'
            title={intl.formatMessage({id: 'MENU.QUESTIONS.MANAGEMENT'})}
          />
          <MenuItem
            to='/apps/slider-management/sliders'
            title={intl.formatMessage({id: 'MENU.SLIDER.MANAGEMENT'})}
          />
          <MenuItem
            to='/apps/gallery-management/galleries'
            title={intl.formatMessage({id: 'MENU.GALLERY.MANAGEMENT'})}
          />
        </>
      )}

      {/* <MenuInnerWithSub
        isMega={true}
        title='Mega menu'
        to='/mega-menu'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        <MegaMenu />
      </MenuInnerWithSub> */}
    </>
  )
}
