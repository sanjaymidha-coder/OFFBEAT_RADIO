'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// project imports
import useAuth from 'hooks/useAuth';
import { DASHBOARD_PATH } from 'config';
import Loader from 'components/ui-component/Loader';

// types
import { GuardProps } from 'types';

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }: GuardProps) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push(DASHBOARD_PATH);
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) return <Loader />;

  return children;
};

export default GuestGuard;
