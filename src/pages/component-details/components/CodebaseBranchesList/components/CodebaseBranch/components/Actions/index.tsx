import { Icon } from '@iconify/react';
import { IconButton } from '@mui/material';
import React from 'react';
import { ICONS } from '../../../../../../../../icons/iconify-icons-mapping';
import { CodebaseBranchActionsMenu } from '../../../../../../../../widgets/CodebaseBranchActionsMenu';
import { useTypedPermissions } from '../../../../../../hooks/useTypedPermissions';
import { ActionsProps } from './types';

export const Actions = ({
  codebaseBranchData,
  codebaseData,
  pipelines,
  defaultBranch,
}: ActionsProps) => {
  const buttonRef = React.createRef<HTMLButtonElement>();
  const [anchor, setAnchor] = React.useState<EventTarget & HTMLButtonElement>(null);

  const permissions = useTypedPermissions();

  return (
    <>
      <IconButton
        ref={buttonRef}
        aria-label={'Options'}
        onClick={(e) => setAnchor(e.currentTarget)}
        size="large"
      >
        <Icon icon={ICONS.THREE_DOTS} color={'grey'} width="20" />
      </IconButton>
      <CodebaseBranchActionsMenu
        variant="menu"
        data={{
          branch: codebaseBranchData,
          defaultBranch,
          codebaseData,
          pipelines,
        }}
        permissions={{
          update: permissions.update.CodebaseBranch,
          delete: permissions.delete.CodebaseBranch,
        }}
        anchorEl={anchor}
        handleCloseResourceActionListMenu={() => setAnchor(null)}
      />
    </>
  );
};