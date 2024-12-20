import { Icon } from '@iconify/react';
import { Box, Chip, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { QuickLink } from '../../../../../../../../components/QuickLink';
import { StatusIcon } from '../../../../../../../../components/StatusIcon';
import { CODEBASE_VERSIONING_TYPES } from '../../../../../../../../constants/codebaseVersioningTypes';
import { GIT_PROVIDERS } from '../../../../../../../../constants/gitProviders';
import { CUSTOM_RESOURCE_STATUSES } from '../../../../../../../../constants/statuses';
import { ICONS } from '../../../../../../../../icons/iconify-icons-mapping';
import { CodebaseBranchKubeObject } from '../../../../../../../../k8s/groups/EDP/CodebaseBranch';
import { PipelineRunKubeObject } from '../../../../../../../../k8s/groups/Tekton/PipelineRun';
import { PIPELINE_RUN_REASON } from '../../../../../../../../k8s/groups/Tekton/PipelineRun/constants';
import { useCreateBuildPipelineRun } from '../../../../../../../../k8s/groups/Tekton/PipelineRun/hooks/useCreateBuildPipelineRun';
import { createBuildPipelineRunInstance } from '../../../../../../../../k8s/groups/Tekton/PipelineRun/utils/createBuildPipelineRunInstance';
import { useTriggerTemplateByNameQuery } from '../../../../../../../../k8s/groups/Tekton/TriggerTemplate/hooks/useTriggerTemplateByNameQuery';
import { LinkCreationService } from '../../../../../../../../services/link-creation';
import { rem } from '../../../../../../../../utils/styling/rem';
import { useTypedPermissions } from '../../../../../../hooks/useTypedPermissions';
import { useDynamicDataContext } from '../../../../../../providers/DynamicData/hooks';
import { isDefaultBranch } from '../../../../../../utils';
import { Actions } from '../Actions';
import { useStyles } from './styles';
import { SummaryProps } from './types';

export const Summary = ({ codebaseBranchData, pipelineRuns }: SummaryProps) => {
  const {
    component: { data: codebaseData },
    gitServerByCodebase: { data: gitServerByCodebase },
  } = useDynamicDataContext();

  const permissions = useTypedPermissions();
  const { createBuildPipelineRun } = useCreateBuildPipelineRun({});

  const { data: buildTriggerTemplate } = useTriggerTemplateByNameQuery({
    props: {
      name: `${gitServerByCodebase?.spec?.gitProvider}-build-template`,
    },
    options: {
      enabled: !!gitServerByCodebase,
    },
  });

  const classes = useStyles();
  const status = codebaseBranchData?.status?.status;
  const detailedMessage = codebaseBranchData?.status?.detailedMessage;

  const [codebaseBranchIcon, codebaseBranchColor, codebaseBranchIsRotating] =
    CodebaseBranchKubeObject.getStatusIcon(status);

  const [lastPipelineRunIcon, lastPipelineRunColor, lastPipelineRunIsRotating] =
    PipelineRunKubeObject.getStatusIcon(
      PipelineRunKubeObject.parseStatus(pipelineRuns.latestBuildPipelineRun),
      PipelineRunKubeObject.parseStatusReason(pipelineRuns.latestBuildPipelineRun)
    );

  const onBuildButtonClick = React.useCallback(
    (e) => {
      e.stopPropagation();

      if (!gitServerByCodebase) {
        console.error('Codebase Git server has not been found');
        return;
      }

      const buildPipelineRunTemplate = buildTriggerTemplate.spec.resourcetemplates[0];

      if (!buildPipelineRunTemplate) {
        console.error('Build PipelineRun template has not been found');
        return;
      }

      const buildPipelineRunTemplateCopy = JSON.parse(JSON.stringify(buildPipelineRunTemplate));

      const buildPipelineRunData = createBuildPipelineRunInstance({
        codebase: codebaseData,
        codebaseBranch: codebaseBranchData,
        pipelineRunTemplate: buildPipelineRunTemplateCopy,
        gitServer: gitServerByCodebase,
      });

      createBuildPipelineRun(buildPipelineRunData);
    },
    [
      buildTriggerTemplate,
      codebaseBranchData,
      codebaseData,
      createBuildPipelineRun,
      gitServerByCodebase,
    ]
  );

  const isEDPVersioning = codebaseData.spec.versioning.type === CODEBASE_VERSIONING_TYPES.EDP;

  const latestBuildIsRunning =
    PipelineRunKubeObject.parseStatusReason(pipelineRuns.latestBuildPipelineRun) ===
    PIPELINE_RUN_REASON.RUNNING;

  const codebaseBranchStatusIsOk =
    codebaseBranchData?.status?.status === CUSTOM_RESOURCE_STATUSES.CREATED;

  const buildButtonTooltip = (() => {
    if (!permissions.create.PipelineRun.allowed) {
      return permissions.create.PipelineRun.reason;
    }

    if (latestBuildIsRunning) {
      return 'Latest build PipelineRun is running';
    }

    if (!codebaseBranchStatusIsOk) {
      return `Codebase branch status is ${codebaseBranchData?.status?.status}`;
    }

    return 'Trigger build PipelineRun';
  })();

  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction="row"
      width={'100%'}
      justifyContent="space-between"
    >
      <Stack spacing={2} alignItems="center" direction="row">
        <StatusIcon
          icon={codebaseBranchIcon}
          color={codebaseBranchColor}
          isRotating={codebaseBranchIsRotating}
          Title={
            <>
              <Typography variant={'subtitle2'} style={{ fontWeight: 600 }}>
                {`Status: ${status || 'Unknown'}`}
              </Typography>
              {status === CUSTOM_RESOURCE_STATUSES.FAILED && (
                <Typography variant={'subtitle2'} style={{ marginTop: rem(10) }}>
                  {detailedMessage}
                </Typography>
              )}
            </>
          }
        />
        <Typography variant={'h6'} style={{ lineHeight: 1, marginTop: rem(2) }}>
          {codebaseBranchData.spec.branchName}
        </Typography>
        {isDefaultBranch(codebaseData, codebaseBranchData) && (
          <Chip label="default" className={clsx([classes.labelChip, classes.labelChipBlue])} />
        )}
        {codebaseBranchData.spec.release && (
          <Chip label="release" className={clsx([classes.labelChip, classes.labelChipGreen])} />
        )}
        <Stack spacing={1} alignItems="center" direction="row">
          <Typography fontSize={12}>Build status</Typography>
          <StatusIcon
            icon={lastPipelineRunIcon}
            color={lastPipelineRunColor}
            isRotating={lastPipelineRunIsRotating}
            width={20}
            Title={
              <>
                <Typography variant={'subtitle2'} style={{ fontWeight: 600 }}>
                  {`Last Build PipelineRun status: ${PipelineRunKubeObject.parseStatus(
                    pipelineRuns.latestBuildPipelineRun
                  )}. Reason: ${PipelineRunKubeObject.parseStatusReason(
                    pipelineRuns.latestBuildPipelineRun
                  )}`}
                </Typography>
              </>
            }
          />
        </Stack>
        {isEDPVersioning ? (
          <>
            <Stack spacing={1} alignItems="center" direction="row">
              <Typography fontSize={12}>Build:</Typography>
              <Chip label={codebaseBranchData?.status?.build || 'N/A'} />
            </Stack>
            <Stack spacing={1} alignItems="center" direction="row">
              <Typography fontSize={12}>Successful build:</Typography>
              <Chip label={codebaseBranchData?.status?.lastSuccessfulBuild || 'N/A'} />
            </Stack>
            <Stack spacing={1} alignItems="center" direction="row">
              <Typography fontSize={12}>Version:</Typography>
              <Chip label={codebaseBranchData?.spec?.version || 'N/A'} />
            </Stack>
          </>
        ) : null}
      </Stack>

      <Box sx={{ pr: rem(16) }}>
        <Grid container spacing={1} alignItems={'center'}>
          <Grid item>
            <QuickLink
              enabledText="Open in GIT"
              name={{ label: 'GIT' }}
              icon={ICONS.NEW_WINDOW}
              externalLink={LinkCreationService.git.createRepoBranchLink(
                gitServerByCodebase?.spec.gitProvider as GIT_PROVIDERS,
                codebaseData?.status?.gitWebUrl,
                codebaseBranchData?.spec.branchName
              )}
              variant="text"
              isTextButton
            />
          </Grid>
          <Grid item>
            <Tooltip title={buildButtonTooltip}>
              <div>
                <IconButton
                  onClick={onBuildButtonClick}
                  disabled={
                    !permissions.create.PipelineRun.allowed ||
                    latestBuildIsRunning ||
                    !codebaseBranchStatusIsOk
                  }
                  size="medium"
                >
                  <Icon icon={ICONS.PLAY} />
                </IconButton>
              </div>
            </Tooltip>
          </Grid>

          <Grid
            item
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Actions codebaseBranchData={codebaseBranchData} />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};
