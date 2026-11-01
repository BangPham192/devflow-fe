import { Alert, Button, Form, Input } from 'antd';

export interface WorkspaceFormValues {
  name: string;
  description: string;
}

interface WorkspaceFormProps {
  initialValues?: WorkspaceFormValues;
  submitLabel: string;
  onSubmit: (values: WorkspaceFormValues) => void;
  isPending: boolean;
  error: string | null;
  onDismissError: () => void;
}

/** Shared by the create and edit flows — both post name + description. */
export default function WorkspaceForm({
  initialValues,
  submitLabel,
  onSubmit,
  isPending,
  error,
  onDismissError,
}: WorkspaceFormProps) {
  return (
    <Form<WorkspaceFormValues>
      layout="vertical"
      requiredMark={false}
      initialValues={initialValues}
      onFinish={onSubmit}
      onValuesChange={onDismissError}
      size="large"
    >
      {error && (
        <Alert type="error" message={error} showIcon closable className="!mb-5" onClose={onDismissError} />
      )}

      <Form.Item
        name="name"
        label="Workspace name"
        rules={[
          { required: true, message: 'Workspace name is required' },
          { max: 255, message: 'Use 255 characters or fewer' },
        ]}
      >
        <Input placeholder="Product Team" autoFocus />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ max: 2000, message: 'Use 2000 characters or fewer' }]}
      >
        <Input.TextArea
          placeholder="What is this workspace for?"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>

      <Form.Item className="!mb-0">
        <Button type="primary" htmlType="submit" loading={isPending} block>
          {submitLabel}
        </Button>
      </Form.Item>
    </Form>
  );
}
