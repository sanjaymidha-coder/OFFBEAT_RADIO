// third-party
import { FormattedMessage } from 'react-intl';
// assets
import { IconCalendarEvent, IconSettings } from '@tabler/icons-react';
// type
import { NavItemType } from 'types';

const icons = {
  IconCalendarEvent: IconCalendarEvent,
  IconSettings: IconSettings
};

const schedule: NavItemType = {
  id: 'schedule',
  title: <FormattedMessage id="schedule" defaultMessage="Schedule" />,
  type: 'group',
  children: [
    {
      id: 'station-lineup',
      title: <FormattedMessage id="station-lineup" defaultMessage="Station Lineup" />,
      type: 'item',
      url: '/schedule/station-lineup',
      icon: icons.IconCalendarEvent,
      breadcrumbs: false
    },
    {
      id: 'fallback-settings',
      title: <FormattedMessage id="fallback-settings" defaultMessage="Fallback Settings" />,
      type: 'item',
      url: '/schedule/fallback-settings',
      icon: icons.IconSettings,
      breadcrumbs: false
    }
  ]
};

export default schedule; 