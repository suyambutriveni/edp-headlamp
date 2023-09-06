import { Icon } from '@iconify/react';
import { Link } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Grid, Link as MuiLink, Tooltip, useTheme } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { StatusIcon } from '../../../../../components/StatusIcon';
import { TableColumn } from '../../../../../components/Table/types';
import {
    CODEBASE_COMMON_BUILD_TOOLS,
    CODEBASE_COMMON_FRAMEWORKS,
    CODEBASE_COMMON_LANGUAGES,
} from '../../../../../configs/codebase-mappings';
import { CUSTOM_RESOURCE_STATUSES } from '../../../../../constants/statuses';
import { ICONS } from '../../../../../icons/iconify-icons-mapping';
import {
    APPLICATION_LABEL_SELECTOR_APP_NAME,
    APPLICATION_LABEL_SELECTOR_PIPELINE,
    APPLICATION_LABEL_SELECTOR_STAGE,
} from '../../../../../k8s/Application/labels';
import { ApplicationKubeObjectInterface } from '../../../../../k8s/Application/types';
import { getDeployedVersion } from '../../../../../k8s/Application/utils/getDeployedVersion';
import { useEDPComponentsURLsQuery } from '../../../../../k8s/EDPComponent/hooks/useEDPComponentsURLsQuery';
import { GENERATE_URL_SERVICE } from '../../../../../services/url';
import { routeEDPComponentDetails } from '../../../../edp-component-details/route';
import { EDPStageDetailsRouteParams, EnrichedApplicationWithArgoApplication } from '../../../types';
import { ImageStreamTagsSelect } from '../components/ImageStreamTagsSelect';
import { ValuesOverrideCheckbox } from '../components/ValuesOverrideCheckbox';

export const useColumns = (
    qualityGatePipelineIsRunning: boolean,
    handleSelectRowClick: (
        event: React.MouseEvent<unknown>,
        row: EnrichedApplicationWithArgoApplication
    ) => void,
    selected: string[]
): TableColumn<EnrichedApplicationWithArgoApplication>[] => {
    const theme = useTheme();
    const { namespace } = useParams<EDPStageDetailsRouteParams>();
    const { data: EDPComponentsURLS } = useEDPComponentsURLsQuery(namespace);
    const _createArgoCDLink = React.useCallback(
        (argoApplication: ApplicationKubeObjectInterface) =>
            GENERATE_URL_SERVICE.createArgoCDApplicationLink(
                EDPComponentsURLS?.argocd,
                argoApplication.metadata.labels[APPLICATION_LABEL_SELECTOR_PIPELINE],
                argoApplication.metadata.labels[APPLICATION_LABEL_SELECTOR_STAGE],
                argoApplication.metadata.labels[APPLICATION_LABEL_SELECTOR_APP_NAME]
            ),
        [EDPComponentsURLS]
    );

    return React.useMemo(
        () => [
            {
                id: 'health',
                label: 'Health',
                render: ({ argoApplication }) =>
                    //@ts-ignore
                    argoApplication?.status?.health?.status ? (
                        <StatusIcon
                            //@ts-ignore
                            status={argoApplication.status.health.status.toLowerCase()}
                        />
                    ) : (
                        <StatusIcon status={CUSTOM_RESOURCE_STATUSES.UNKNOWN} />
                    ),
                width: '5%',
                textAlign: 'center',
            },
            {
                id: 'sync',
                label: 'Sync',
                render: ({ argoApplication }) =>
                    //@ts-ignore
                    argoApplication?.status?.sync?.status ? (
                        <StatusIcon
                            //@ts-ignore
                            status={argoApplication.status.sync.status.toLowerCase()}
                        />
                    ) : (
                        <StatusIcon status={CUSTOM_RESOURCE_STATUSES.UNKNOWN} />
                    ),
                width: '5%',
                textAlign: 'center',
            },
            {
                id: 'application',
                label: 'Application',
                render: ({
                    application: {
                        metadata: { name, namespace },
                    },
                }) => {
                    return (
                        <Link
                            routeName={routeEDPComponentDetails.path}
                            params={{
                                name,
                                namespace,
                            }}
                        >
                            {name}
                        </Link>
                    );
                },
                width: '20%',
            },
            {
                id: 'deployedVersion',
                label: 'Deployed version',
                render: ({
                    argoApplication,
                    application: {
                        spec: { lang, framework, buildTool },
                    },
                }) => {
                    const isHelm =
                        lang === CODEBASE_COMMON_LANGUAGES.HELM &&
                        framework === CODEBASE_COMMON_FRAMEWORKS.HELM &&
                        buildTool === CODEBASE_COMMON_BUILD_TOOLS.HELM;

                    const withValuesOverride = argoApplication
                        ? Object.hasOwn(argoApplication?.spec, 'sources')
                        : false;

                    const deployedVersion = getDeployedVersion(
                        withValuesOverride,
                        isHelm,
                        argoApplication
                    );

                    return argoApplication ? (
                        <Tooltip
                            title={
                                <Grid container alignItems={'center'} spacing={1}>
                                    <Grid item>Open in ArgoCD</Grid>
                                    <span> </span>
                                    <Grid item>
                                        <Icon
                                            icon={ICONS.NEW_WINDOW}
                                            color={theme.palette.grey['500']}
                                            width="15"
                                        />
                                    </Grid>
                                </Grid>
                            }
                        >
                            <MuiLink href={_createArgoCDLink(argoApplication)} target={'_blank'}>
                                {deployedVersion}
                            </MuiLink>
                        </Tooltip>
                    ) : (
                        'No deploy'
                    );
                },
                width: '30%',
            },
            {
                id: 'valuesOverride',
                label: 'Values override',
                render: enrichedApplicationWithArgoApplication => {
                    const withValuesOverride =
                        enrichedApplicationWithArgoApplication?.argoApplication
                            ? Object.hasOwn(
                                  enrichedApplicationWithArgoApplication?.argoApplication?.spec,
                                  'sources'
                              )
                            : false;

                    return (
                        <ValuesOverrideCheckbox
                            enrichedApplicationWithArgoApplication={
                                enrichedApplicationWithArgoApplication
                            }
                            selected={selected}
                            handleSelectRowClick={handleSelectRowClick}
                            defaultValue={withValuesOverride}
                        />
                    );
                },
                width: '10%',
                textAlign: 'center',
            },
            {
                id: 'imageStreamVersion',
                label: 'Image stream version',
                render: enrichedApplicationWithArgoApplication => {
                    return (
                        <ImageStreamTagsSelect
                            enrichedApplicationWithArgoApplication={
                                enrichedApplicationWithArgoApplication
                            }
                            selected={selected}
                            handleSelectRowClick={handleSelectRowClick}
                        />
                    );
                },
            },
        ],
        [_createArgoCDLink, handleSelectRowClick, selected, theme.palette.grey]
    );
};
