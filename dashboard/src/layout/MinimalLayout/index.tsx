import { FC, ReactNode } from 'react';

// project imports
import Customization from '../Customization';

interface Props {
  children: ReactNode;
}

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout: FC<Props> = ({ children }) => (
  <>
    {children}
  </>
);

export default MinimalLayout;
