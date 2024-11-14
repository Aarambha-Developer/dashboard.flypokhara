import { RegisterForm } from '@/components/registration-form';
import { getCookie } from '@/lib/cookie-handler';

export default async function BlockPage() {
  const role = await getCookie('role');
  return (
    <div className=''>
      <RegisterForm  role={role}/>
    </div>
  );
}
