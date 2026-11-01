import { Alert, Button, Form, Input, Modal, Select } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { useInviteMember } from '../api/useInviteMember';
import type { WorkspaceRole } from '../types/workspace';

interface AddMemberFormValues {
  email: string;
  roleName: WorkspaceRole;
}

interface AddMemberModalProps {
  workspaceId: string;
  open: boolean;
  onClose: () => void;
  onInvited: () => void;
}

const ROLE_OPTIONS: { value: WorkspaceRole; label: string }[] = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MEMBER', label: 'Member' },
  { value: 'VIEWER', label: 'Viewer' },
];

/** POST /api/v1/workspaces/{id}/invitations — see InviteMemberRequest for why this isn't live yet. */
export default function AddMemberModal({
  workspaceId,
  open,
  onClose,
  onInvited,
}: AddMemberModalProps) {
  const [form] = Form.useForm<AddMemberFormValues>();
  const { invite, isPending, error, resetError } = useInviteMember();

  async function handleSubmit(values: AddMemberFormValues) {
    const succeeded = await invite(workspaceId, values);
    if (succeeded) {
      form.resetFields();
      onInvited();
    }
  }

  function handleClose() {
    form.resetFields();
    resetError();
    onClose();
  }

  return (
    <Modal
      title={
        <span className="flex items-center gap-2">
          <TeamOutlined /> Add member
        </span>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
    >
      <p className="mb-5 text-sm text-slate-500">
        Invite a teammate to join this workspace. They will receive an email invitation.
      </p>

      <Form<AddMemberFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ roleName: 'MEMBER' }}
        onFinish={handleSubmit}
        onValuesChange={resetError}
      >
        {error && (
          <Alert type="error" message={error} showIcon closable className="!mb-5" onClose={resetError} />
        )}

        <Form.Item
          name="email"
          label="Email address"
          rules={[
            { required: true, message: 'Email address is required' },
            { type: 'email', message: 'Enter a valid email address' },
          ]}
        >
          <Input placeholder="Enter email address (e.g. john@example.com)" autoFocus />
        </Form.Item>

        <Form.Item
          name="roleName"
          label="Role"
          extra="You can change the role later."
          rules={[{ required: true, message: 'Role is required' }]}
        >
          <Select options={ROLE_OPTIONS} />
        </Form.Item>

        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Send invitation
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
