'use client';
import React from 'react';
import { AgentItem } from '@/types';
import { AgentsManagerEditable } from './AgentsManagerEditable';

interface Props { agents: AgentItem[]; onAgentsChange: (agents: AgentItem[]) => void; }

export const AgentsManager: React.FC<Props> = (props) => <AgentsManagerEditable {...props} />;
