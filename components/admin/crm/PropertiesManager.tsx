'use client';
import React from 'react';
import { PropertyItem, AgentItem } from '@/types';
import { PropertiesManagerCrud } from '@/components/admin/crm/PropertiesManagerCrud';

type Props={initialProperties:PropertyItem[];agents:AgentItem[]};
export const PropertiesManager:React.FC<Props> = (props) => <PropertiesManagerCrud {...props}/>;
