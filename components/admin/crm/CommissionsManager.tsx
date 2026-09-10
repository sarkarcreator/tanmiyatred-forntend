'use client';
import React from 'react';
import { CommissionItem } from '@/types';
import { CommissionsManagerCrud } from '@/components/admin/crm/CommissionsManagerCrud';
export const CommissionsManager:React.FC<{initialCommissions:CommissionItem[]}>=({initialCommissions})=><CommissionsManagerCrud initialCommissions={initialCommissions}/>;
