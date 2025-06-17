// third-party
import { FormattedMessage } from 'react-intl';
// assets
import { IconUser, IconMicrophone, IconTemplate, IconRobot } from '@tabler/icons-react';
// type
import { NavItemType } from 'types';

const icons = {
  IconUser: IconUser,
  IconMicrophone: IconMicrophone,
  IconTemplate: IconTemplate,
  IconRobot: IconRobot
};

const djsVoices: NavItemType = {
  id: 'djs-voices',
  title: <FormattedMessage id="djs-voices" defaultMessage="DJs & Voices" />,
  type: 'group',
  children: [
    {
      id: 'ai-dj-show',
      title: <FormattedMessage id="ai-dj-show" defaultMessage="AI DJ Show" />,
      type: 'item',
      url: '/djs-voices/ai-dj-show',
      icon: icons.IconRobot,
      breadcrumbs: false
    },
    {
      id: 'ai-dj-profiles',
      title: <FormattedMessage id="ai-dj-profiles" defaultMessage="AI DJ Profiles" />,
      type: 'item',
      url: '/djs-voices/ai-dj-profiles',
      icon: icons.IconUser,
      breadcrumbs: false
    },
    {
      id: 'prompt-templates',
      title: <FormattedMessage id="prompt-templates" defaultMessage="Prompt Templates" />,
      type: 'item',
      url: '/djs-voices/prompt-templates',
      icon: icons.IconTemplate,
      breadcrumbs: false
    }
  ]
};

export default djsVoices; 