import Questionnaire from '@/app/components/user/questionnaire.component';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meenew | Questionnaire',
  description: 'Manage your restaurant.'
}

export default async function Main() {
  return (
    <Questionnaire/>
  );
}