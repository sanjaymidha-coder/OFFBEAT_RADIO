// third-party
import { FormattedMessage } from 'react-intl';
// assets
import { IconChartBar, IconTrendingUp, IconStar } from '@tabler/icons-react';
// type
import { NavItemType } from 'types';

const icons = {
  IconChartBar: IconChartBar,
  IconTrendingUp: IconTrendingUp,
  IconStar: IconStar
};

const analytics: NavItemType = {
  id: 'analytics',
  title: <FormattedMessage id="analytics" defaultMessage="Analytics" />,
  type: 'group',
  children: [
    {
      id: 'listener-insights',
      title: <FormattedMessage id="listener-insights" defaultMessage="Listener Insights" />,
      type: 'item',
      url: '/analytics/listener-insights',
      icon: icons.IconChartBar,
      breadcrumbs: false
    },
    {
      id: 'station-performance',
      title: <FormattedMessage id="station-performance" defaultMessage="Station Performance" />,
      type: 'item',
      url: '/analytics/station-performance',
      icon: icons.IconTrendingUp,
      breadcrumbs: false
    },
    {
      id: 'artist-popularity',
      title: <FormattedMessage id="artist-popularity" defaultMessage="Artist Popularity" />,
      type: 'item',
      url: '/analytics/artist-popularity',
      icon: icons.IconStar,
      breadcrumbs: false
    }
  ]
};

export default analytics; 