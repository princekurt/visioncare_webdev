import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/doctor/dashboard'); // automatically go to doctor dashboard
}