import { Alert, Button, Form, Input, Select } from 'antd';
import { USER_ROLES } from '../types/auth';
import type { UserRole } from '../types/auth';

export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void;
  isPending: boolean;
  error: string | null;
  onDismissError: () => void;
}

const ROLE_OPTIONS = USER_ROLES.map((role) => ({ value: role, label: role }));

export default function RegisterForm({
  onSubmit,
  isPending,
  error,
  onDismissError,
}: RegisterFormProps) {
  return (
    <Form<RegisterFormValues>
      layout="vertical"
      requiredMark={false}
      initialValues={{ role: 'MEMBER' }}
      onFinish={onSubmit}
      onValuesChange={onDismissError}
      size="large"
    >
      {error && (
        <Alert type="error" message={error} showIcon closable className="!mb-5" onClose={onDismissError} />
      )}

      <Form.Item
        name="username"
        label="Display name"
        rules={[
          { required: true, message: 'Display name is required' },
          { max: 50, message: 'Use 50 characters or fewer' },
        ]}
      >
        <Input placeholder="Jane Cooper" autoComplete="name" autoFocus />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Enter a valid email address' },
        ]}
      >
        <Input placeholder="you@company.com" autoComplete="email" />
      </Form.Item>

      <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Role is required' }]}>
        <Select options={ROLE_OPTIONS} />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Password is required' },
          { min: 8, message: 'Use at least 8 characters' },
        ]}
      >
        <Input.Password placeholder="At least 8 characters" autoComplete="new-password" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm password"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Re-enter your password" autoComplete="new-password" />
      </Form.Item>

      <Form.Item className="!mb-0">
        <Button type="primary" htmlType="submit" loading={isPending} block>
          Create account
        </Button>
      </Form.Item>
    </Form>
  );
}
