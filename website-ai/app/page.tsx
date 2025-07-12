import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/object-detection');
  return (
    <div>Hello</div>
  );
}
