import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin Property Listings | Tanmiyat Real Estate',
  description: 'Property listing management is available through the Tanmiyat admin portal.',
};

export default function ListPropertyPage() {
  redirect('/admin');
}
