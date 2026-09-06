import { Alert, Button, Form, Input } from 'antd';

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isPending: boolean;
  error: string | null;
  onDismissError: () => void;
}

export default function LoginForm({ onSubmit, isPending, error, onDismissError }: LoginFormProps) {
  return (
    <Form<LoginFormValues>
      layout="vertical"
      requiredMark={false}
      onFinish={onSubmit}
      onValuesChange={onDismissError}
      autoComplete="on"
      size="large"
    >
      {error && (
        <Alert type="error" message={error} showIcon closable className="!mb-5" onClose={onDismissError} />
      )}

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Enter a valid email address' },
        ]}
      >
        <Input placeholder="you@company.com" autoComplete="email" autoFocus />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Password is required' }]}
      >
        <Input.Password placeholder="••••••••" autoComplete="current-password" />
      </Form.Item>

      <Form.Item className="!mb-0">
        <Button type="primary" htmlType="submit" loading={isPending} block>
          Sign in
        </Button>
      </Form.Item>
    </Form>
  );
}
