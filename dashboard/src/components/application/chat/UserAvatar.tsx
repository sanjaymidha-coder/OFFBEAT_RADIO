// material-ui
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';

// project imports
import AvatarStatus from './AvatarStatus';

// types
import { UserProfile } from 'types/user-profile';

// assets
const avatarImage = '/assets/images/users';

// ==============================|| CHAT USER AVATAR WITH STATUS ICON ||============================== //

interface UserAvatarProps {
  user: UserProfile;
}

const UserAvatar = ({ user }: UserAvatarProps) => (
  <Badge
    overlap="circular"
    badgeContent={<AvatarStatus status={user.online_status!} />}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  >
    <Avatar alt={user.name} src={user.avatar && `${avatarImage}/${user.avatar}`} />
  </Badge>
);

export default UserAvatar;
