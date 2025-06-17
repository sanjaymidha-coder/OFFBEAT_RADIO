// third-party
import { FormattedMessage } from 'react-intl';
// assets
import { IconRadio } from '@tabler/icons-react';
// type
import { NavItemType } from 'types';

const icons = {
  IconRadio: IconRadio
};

const stations: NavItemType = {
  id: 'stations',
  title: <FormattedMessage id="stations" defaultMessage="Stations" />,
  type: 'group',
  children: [
    {
      id: 'all-stations',
      title: <FormattedMessage id="all-stations" defaultMessage="All Stations" />,
      type: 'item',
      url: '/stations/all',
      icon: icons.IconRadio,
      breadcrumbs: false
    },
    {
      id: 'add-new-station',
      title: <FormattedMessage id="add-new-station" defaultMessage="Add New Station" />,
      type: 'item',
      url: '/stations/add',
      icon: icons.IconRadio,
      breadcrumbs: false
    }
  ]
};

export default stations; 