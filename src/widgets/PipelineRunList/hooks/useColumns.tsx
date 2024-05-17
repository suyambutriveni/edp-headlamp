import { Icon } from '@iconify/react';
import { Link } from '@kinvolk/headlamp-plugin/lib/components/common';
import { IconButton, Link as MuiLink, Stack, Typography } from '@mui/material';
import React from 'react';
import { StatusIcon } from '../../../components/StatusIcon';
import { TableColumn } from '../../../components/Table/types';
import { ICONS } from '../../../icons/iconify-icons-mapping';
import { PipelineRunKubeObject } from '../../../k8s/PipelineRun';
import { PipelineRunKubeObjectInterface } from '../../../k8s/PipelineRun/types';
import { SYSTEM_QUICK_LINKS } from '../../../k8s/QuickLink/constants';
import { useQuickLinksURLsQuery } from '../../../k8s/QuickLink/hooks/useQuickLinksURLQuery';
import { routeEDPPipelineDetails } from '../../../pages/edp-pipeline-details/route';
import { useDialogContext } from '../../../providers/Dialog/hooks';
import { useResourceActionListContext } from '../../../providers/ResourceActionList/hooks';
import { LinkCreationService } from '../../../services/link-creation';
import { humanize } from '../../../utils/date/humanize';
import { PIPELINE_RUN_GRAPH_DIALOG_NAME } from '../../PipelineRunGraph/constants';

export const useColumns = (): TableColumn<PipelineRunKubeObjectInterface>[] => {
  const { data: QuickLinksURLS } = useQuickLinksURLsQuery();

  const { setDialog } = useDialogContext();

  const { handleOpenResourceActionListMenu } =
    useResourceActionListContext<PipelineRunKubeObjectInterface>();

  return React.useMemo(
    () => [
      {
        id: 'status',
        label: 'Status',
        render: (resource) => {
          const status = PipelineRunKubeObject.parseStatus(resource);
          const reason = PipelineRunKubeObject.parseStatusReason(resource);

          const [icon, color, isRotating] = PipelineRunKubeObject.getStatusIcon(status, reason);

          return (
            <StatusIcon
              icon={icon}
              color={color}
              isRotating={isRotating}
              width={25}
              Title={`Status: ${status}. Reason: ${reason}`}
            />
          );
        },
        width: '5%',
      },
      {
        id: 'run',
        label: 'Run',
        render: (resource) => {
          const {
            metadata: { name, namespace },
          } = resource;

          if (!resource?.status?.pipelineSpec?.params?.[0]?.default) {
            return <>{name}</>;
          }

          return (
            <Link
              routeName={routeEDPPipelineDetails.path}
              params={{
                name,
                namespace,
              }}
            >
              {name}
            </Link>
          );
        },
        width: '30%',
      },
      {
        id: 'pipeline',
        label: 'Pipeline',
        render: (resource) => {
          const {
            metadata: { namespace },
            spec: {
              pipelineRef: { name: pipelineRefName },
            },
          } = resource;

          if (!resource?.status?.pipelineSpec?.params?.[0]?.default) {
            return <>{pipelineRefName}</>;
          }

          const pipelineLink = LinkCreationService.tekton.createPipelineLink(
            QuickLinksURLS?.[SYSTEM_QUICK_LINKS.TEKTON],
            namespace,
            pipelineRefName
          );

          return (
            <>
              <MuiLink href={pipelineLink} target="_blank" rel="noopener">
                {pipelineRefName}
              </MuiLink>
            </>
          );
        },
        width: '30%',
      },
      {
        id: 'time',
        label: 'Time',
        render: (resource) => {
          const startedAt = new Date(resource.status?.startTime).toLocaleString('en-mini', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          });
          const completionTime = resource?.status?.completionTime;

          const activeDuration = humanize(
            completionTime
              ? new Date(completionTime).getTime() - new Date(resource.status?.startTime).getTime()
              : new Date().getTime() - new Date(resource.status?.startTime).getTime(),
            {
              language: 'en-mini',
              spacer: '',
              delimiter: ' ',
              fallbacks: ['en'],
              largest: 2,
              round: true,
              units: ['d', 'h', 'm', 's'],
            }
          );
          return (
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Icon icon={ICONS.CALENDAR} />
                <Typography variant="body2">{`Started at: ${startedAt}`}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Icon icon={'mingcute:time-line'} />
                <Typography variant="body2">{`Duration: ${activeDuration}`}</Typography>
              </Stack>
            </Stack>
          );
        },
        width: '25%',
      },
      {
        id: 'diagram',
        label: 'Diagram',
        render: (resource) => {
          return (
            <IconButton
              onClick={() =>
                setDialog({
                  modalName: PIPELINE_RUN_GRAPH_DIALOG_NAME,
                  forwardedProps: {
                    pipelineRun: resource,
                  },
                })
              }
              size="large"
            >
              <Icon icon={ICONS.DIAGRAM} />
            </IconButton>
          );
        },
        width: '5%',
      },
      {
        id: 'rerun',
        label: 'Actions',
        render: (resource) => {
          const buttonRef = React.createRef<HTMLButtonElement>();

          return (
            <IconButton
              ref={buttonRef}
              aria-label={'Options'}
              onClick={() => handleOpenResourceActionListMenu(buttonRef.current, resource.jsonData)}
              size="large"
            >
              <Icon icon={ICONS.THREE_DOTS} color={'grey'} width="20" />
            </IconButton>
          );
        },
        width: '5%',
      },
    ],
    [QuickLinksURLS, handleOpenResourceActionListMenu, setDialog]
  );
};
