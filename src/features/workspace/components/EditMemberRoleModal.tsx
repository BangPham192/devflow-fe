import { useEffect } from 'react';
import { Alert, Button, Form, Modal, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { WorkspaceRole } from '../types/workspace';
import type { WorkspaceMemberDto } from '../types/workspaceMember';

const ASSIGNABLE_ROLES: WorkspaceRole[] = ['ADMIN', 'MEMBER', 'VIEWER'];
const ROLE_OPTIONS = ASSIGNABLE_ROLES.map((role) => ({
  value: role,
  label: role.charAt(0) + role.slice(1).toLowerCase(),
}));

interface EditMemberRoleFormValues {
  roleName: WorkspaceRole;
}

interface EditMemberRoleModalProps {
  member: WorkspaceMemberDto | null;
  isPending: boolean;
  error: string | null;
  onSave: (roleName: WorkspaceRole) => void;
  onClose: () => void;
}

/** PATCH /api/v1/workspaces/{workspaceId}/members/{userId} */
export default function EditMemberRoleModal({
  member,
  isPending,
  error,
  onSave,
  onClose,
}: EditMemberRoleModalProps) {
  const [form] = Form.useForm<EditMemberRoleFormValues>();

  useEffect(() => {
    if (member) {
      form.setFieldsValue({ roleName: member.roleName });
    }
  }, [member, form]);

  return (
    <Modal
      title={
        <span className="flex items-center gap-2">
          <EditOutlined /> Edit member
        </span>
      }
      open={member !== null}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {member && (
        <>
          <p className="mb-5 text-sm text-slate-500">
            Change <span className="font-medium text-slate-700">{member.username}</span>&rsquo;s
            role in this workspace.
          </p>

          <Form<EditMemberRoleFormValues>
            form={form}
            layout="vertical"
            requiredMark={false}
            initialValues={{ roleName: member.roleName }}
            onFinish={(values) => onSave(values.roleName)}
          >
            {error && <Alert type="error" message={error} showIcon className="!mb-5" />}

            <Form.Item name="roleName" label="Role" rules={[{ required: true }]}>
              <Select options={ROLE_OPTIONS} />
            </Form.Item>

            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={isPending}>
                Save
              </Button>
            </div>
          </Form>
        </>
      )}
    </Modal>
  );
}
