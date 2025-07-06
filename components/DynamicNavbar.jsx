'use client';

import { useEffect, useState } from 'react';
import NavbarMerchant from '@/components/NavbarMerchant';
import Navbar from '@/components/Navbar';

export default function DynamicNavbar() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const tokenUser = localStorage.getItem('user_token');
    const tokenMerchant = localStorage.getItem('merchant_token');

    if (tokenMerchant) {
      setRole('merchant');
    } else if (tokenUser) {
      setRole('user');
    } else {
      setRole(null);
    }
  }, []);

  if (role === 'merchant') return <NavbarMerchant />;
  return <Navbar />;
}
