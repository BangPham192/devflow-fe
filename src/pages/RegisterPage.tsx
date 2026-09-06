import { App as AntdApp } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { RegisterForm, useRegister } from '../features/auth';
import type { RegisterFormValues } from '../features/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const { register, isPending, error, resetError } = useRegister();

  async function handleSubmit(values: RegisterFormValues) {
    const succeeded = await register({
      username: values.username,
      email: values.email,
      password: values.password,
      role: values.role,
    });

    if (succeeded) {
      message.success('Account created. You can sign in now.');
      navigate('/login', { replace: true });
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start collaborating on DevFlow"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm
        onSubmit={handleSubmit}
        isPending={isPending}
        error={error}
        onDismissError={resetError}
      />
    </AuthLayout>
  );
}
