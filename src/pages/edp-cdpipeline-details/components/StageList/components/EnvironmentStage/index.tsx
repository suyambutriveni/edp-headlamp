import { Icon } from '@iconify/react';
import { Link } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { EDPComponentLink } from '../../../../../../components/EDPComponentLink';
import { LoadingWrapper } from '../../../../../../components/LoadingWrapper';
import { ICONS } from '../../../../../../icons/iconify-icons-mapping';
import { ApplicationKubeObject } from '../../../../../../k8s/Application';
import { EDPCDPipelineStageKubeObject } from '../../../../../../k8s/EDPCDPipelineStage';
import {
  SYSTEM_EDP_COMPONENTS,
  SYSTEM_EDP_COMPONENTS_LABELS,
} from '../../../../../../k8s/EDPComponent/constants';
import { useEDPComponentsURLsQuery } from '../../../../../../k8s/EDPComponent/hooks/useEDPComponentsURLsQuery';
import { LinkCreationService } from '../../../../../../services/link-creation';
import { routeEDPComponentDetails } from '../../../../../edp-component-details/route';
import { routeEDPArgoCDIntegration } from '../../../../../edp-configuration/pages/edp-argocd-integration/route';
import { routeEDPStageDetails } from '../../../../../edp-stage-details/route';
import { usePageFilterContext } from '../../../../hooks/usePageFilterContext';
import { ApplicationCard } from './components/ApplicationCard';
import { Arrow } from './components/Arrow';
import { StyledCardBody, StyledCardHeader, StyledChip } from './styles';
import { EnvironmentStageProps } from './types';

export const EnvironmentStage = ({
  stageWithApplicationsData: { stage, applications },
  CDPipeline,
}: EnvironmentStageProps) => {
  const namespace = stage.metadata.namespace;
  const { data: EDPComponentsURLS } = useEDPComponentsURLsQuery(stage.metadata.namespace);

  const stageIsLoaded = stage?.status;

  const stageStatus = stage?.status?.status;

  const [, stageStatusColor] = EDPCDPipelineStageKubeObject.getStatusIcon(stageStatus);

  const { filter } = usePageFilterContext();

  const filteredApplications = React.useMemo(() => {
    const applicationValues = filter.values.application;
    const healthValue = filter.values.health;

    let _applications = [...applications];

    if (applicationValues && Array.isArray(applicationValues)) {
      _applications = _applications.filter((el) =>
        applicationValues.length === 0
          ? true
          : applicationValues.includes(el.application.metadata.name)
      );
    }

    if (healthValue) {
      _applications = _applications.filter(
        (el) =>
          ApplicationKubeObject.parseStatus(el.argoApplication) === healthValue ||
          healthValue === 'All'
      );
    }

    return _applications;
  }, [applications, filter]);

  return (
    <Paper elevation={1}>
      <LoadingWrapper isLoading={!stageIsLoaded}>
        <StyledCardHeader stageStatusColor={stageStatusColor} variant="outlined">
          <Grid container alignItems="center" spacing={4} wrap="nowrap">
            <Grid item>
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title={`Description: ${stage.spec.description}`}>
                  <Icon icon={ICONS.INFO_CIRCLE} width={18} />
                </Tooltip>
              </Stack>
            </Grid>
            <Grid item sx={{ mr: 'auto !important' }}>
              <Grid container spacing={1} wrap="nowrap" alignItems="center">
                <Grid item sx={{ mr: 'auto !important' }}>
                  <Typography variant="h5" component="div">
                    <Link
                      routeName={routeEDPStageDetails.path}
                      params={{
                        CDPipelineName: CDPipeline.metadata.name,
                        namespace: stage.metadata.namespace,
                        stageName: stage.metadata.name,
                      }}
                    >
                      {stage.spec.name}
                    </Link>{' '}
                    <Typography variant="caption" component="div">
                      ({stage.spec.clusterName})
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item>
                  <EDPComponentLink
                    name={{
                      label: SYSTEM_EDP_COMPONENTS_LABELS[SYSTEM_EDP_COMPONENTS.ARGOCD],
                      value: SYSTEM_EDP_COMPONENTS.ARGOCD,
                    }}
                    icon={ICONS.ARGOCD}
                    externalLink={LinkCreationService.argocd.createStageLink(
                      EDPComponentsURLS?.[SYSTEM_EDP_COMPONENTS.ARGOCD],
                      CDPipeline?.metadata?.name,
                      stage.spec.name
                    )}
                    configurationLink={{
                      routeName: routeEDPArgoCDIntegration.path,
                    }}
                  />
                </Grid>
                <Grid item>
                  <EDPComponentLink
                    name={{
                      label: SYSTEM_EDP_COMPONENTS_LABELS[SYSTEM_EDP_COMPONENTS.GRAFANA],
                      value: SYSTEM_EDP_COMPONENTS.GRAFANA,
                    }}
                    icon={ICONS.GRAFANA}
                    externalLink={LinkCreationService.grafana.createDashboardLink(
                      EDPComponentsURLS?.[SYSTEM_EDP_COMPONENTS.GRAFANA],
                      stage.spec.namespace
                    )}
                    configurationLink={{
                      routeName: routeEDPComponentDetails.path,
                      routeParams: {
                        name: SYSTEM_EDP_COMPONENTS.GRAFANA,
                        namespace,
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <EDPComponentLink
                    name={{
                      label: SYSTEM_EDP_COMPONENTS_LABELS[SYSTEM_EDP_COMPONENTS.KIBANA],
                      value: SYSTEM_EDP_COMPONENTS.KIBANA,
                    }}
                    icon={ICONS.KIBANA}
                    externalLink={LinkCreationService.kibana.createDashboardLink(
                      EDPComponentsURLS?.[SYSTEM_EDP_COMPONENTS.KIBANA],
                      stage.spec.namespace
                    )}
                    configurationLink={{
                      routeName: routeEDPComponentDetails.path,
                      routeParams: {
                        name: SYSTEM_EDP_COMPONENTS.KIBANA,
                        namespace,
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <Tooltip title="Trigger Type">
                    <StyledChip size="small" label={stage.spec.triggerType} />
                  </Tooltip>
                </Grid>
              </Grid>
              <Typography variant="body2">Namespace: {stage.spec.namespace}</Typography>
            </Grid>
            <Grid item>
              <Arrow />
            </Grid>
          </Grid>
        </StyledCardHeader>

        <StyledCardBody>
          <Grid container spacing={4}>
            {filteredApplications.map((el) => {
              const key = el.argoApplication?.metadata.name;

              return el.argoApplication ? (
                <Grid item xs={12} key={key}>
                  <ApplicationCard
                    stage={stage}
                    application={el.application}
                    argoApplication={el.argoApplication}
                  />
                </Grid>
              ) : null;
            })}
          </Grid>
        </StyledCardBody>
      </LoadingWrapper>
    </Paper>
  );
};
