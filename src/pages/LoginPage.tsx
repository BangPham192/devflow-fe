import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { LoginForm, useLogin } from '../features/auth';
import type { LoginFormValues } from '../features/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isPending, error, resetError } = useLogin();

  async function handleSubmit(values: LoginFormValues) {
    // The API field is called `username` but is matched against the e-mail column.
    const succeeded = await login({ username: values.email, password: values.password });
    if (succeeded) {
      navigate('/', { replace: true });
    }
  }

  return (
    <AuthLayout
      title="Sign in to DevFlow"
      subtitle="Continue to your workspace"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <LoginForm
        onSubmit={handleSubmit}
        isPending={isPending}
        error={error}
        onDismissError={resetError}
      />
    </AuthLayout>
  );
}
