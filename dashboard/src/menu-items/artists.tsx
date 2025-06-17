// third-party
import { FormattedMessage } from 'react-intl';
// assets
import { IconUsers, IconUpload, IconMusic } from '@tabler/icons-react';
// type
import { NavItemType } from 'types';

const icons = {
  IconUsers: IconUsers,
  IconUpload: IconUpload,
  IconMusic: IconMusic
};

const artists: NavItemType = {
  id: 'artists',
  title: <FormattedMessage id="artists" defaultMessage="Artists" />,
  type: 'group',
  children: [
    {
      id: 'artist-accounts',
      title: <FormattedMessage id="artist-accounts" defaultMessage="Artist Accounts" />,
      type: 'item',
      url: '/artists/accounts',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'track-uploads',
      title: <FormattedMessage id="track-uploads" defaultMessage="Track Uploads" />,
      type: 'item',
      url: '/artists/track-uploads',
      icon: icons.IconUpload,
      breadcrumbs: false
    },
    {
      id: 'track-library',
      title: <FormattedMessage id="track-library" defaultMessage="Track Library" />,
      type: 'item',
      url: '/artists/track-library',
      icon: icons.IconMusic,
      breadcrumbs: false
    }
  ]
};

export default artists; 