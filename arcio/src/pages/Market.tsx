import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import MarketPulse from '../components/dashboard/MarketPulse';

const Market: React.FC = () => {
  return (
    <DashboardLayout>
      <MarketPulse />
    </DashboardLayout>
  );
};

export default Market;
