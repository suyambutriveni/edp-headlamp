import { HeadlampSimpleTableGetterColumn } from '../../../../../../../components/HeadlampSimpleTable/types';
import { StatusIcon } from '../../../../../../../components/StatusIcon';
import {
    CODEBASE_COMMON_BUILD_TOOLS,
    CODEBASE_COMMON_FRAMEWORKS,
    CODEBASE_COMMON_LANGUAGES,
} from '../../../../../../../configs/codebase-mappings';
import { CUSTOM_RESOURCE_STATUSES } from '../../../../../../../constants/statuses';
import { ApplicationKubeObjectInterface } from '../../../../../../../k8s/Application/types';
import { useEDPComponentsURLsQuery } from '../../../../../../../k8s/EDPComponent/hooks/useEDPComponentsURLsQuery';
import { MuiCore, pluginLib, React } from '../../../../../../../plugin.globals';
import { COMPONENTS_ROUTE_NAME } from '../../../../../../../routes/names';
import { createRouteNameBasedOnNameAndNamespace } from '../../../../../../../utils/routes/createRouteName';
import { createArgoCDApplicationLink } from '../../../../../../../utils/url/createArgoCDApplicationLink';
import { EnrichedApplicationWithArgoApplication } from '../../../types';
import { ImageStreamTagsSelect } from '../components/ImageStreamTagsSelect';

const {
    CommonComponents: { Link },
} = pluginLib;

const { Link: MuiLink } = MuiCore;

export const useColumns = (
    qualityGatePipelineIsRunning: boolean,
    handleRowClick: (event: React.MouseEvent<unknown>, name: string) => void,
    selected: string[]
): HeadlampSimpleTableGetterColumn<EnrichedApplicationWithArgoApplication>[] => {
    const { data: EDPComponentsURLS } = useEDPComponentsURLsQuery();
    const _createArgoCDLink = React.useCallback(
        (argoApplication: ApplicationKubeObjectInterface) =>
            EDPComponentsURLS && Object.hasOwn(EDPComponentsURLS, 'argocd')
                ? createArgoCDApplicationLink(
                      EDPComponentsURLS?.argocd,
                      argoApplication.metadata.labels['app.edp.epam.com/pipeline'],
                      argoApplication.metadata.labels['app.edp.epam.com/stage'],
                      argoApplication.metadata.labels['app.edp.epam.com/app-name']
                  )
                : null,
        [EDPComponentsURLS]
    );

    return React.useMemo(
        () => [
            {
                label: 'Health',
                getter: ({ argoApplication }) =>
                    //@ts-ignore
                    argoApplication?.status?.health?.status ? (
                        <StatusIcon
                            //@ts-ignore
                            status={argoApplication.status.health.status.toLowerCase()}
                        />
                    ) : (
                        <StatusIcon status={CUSTOM_RESOURCE_STATUSES['UNKNOWN']} />
                    ),
            },
            {
                label: 'Sync',
                getter: ({ argoApplication }) =>
                    //@ts-ignore
                    argoApplication?.status?.sync?.status ? (
                        <StatusIcon
                            //@ts-ignore
                            status={argoApplication.status.sync.status.toLowerCase()}
                        />
                    ) : (
                        <StatusIcon status={CUSTOM_RESOURCE_STATUSES['UNKNOWN']} />
                    ),
            },
            {
                label: 'Application',
                getter: ({
                    application: {
                        metadata: { name, namespace },
                    },
                }) => {
                    return (
                        <Link
                            routeName={createRouteNameBasedOnNameAndNamespace(
                                COMPONENTS_ROUTE_NAME
                            )}
                            params={{
                                name,
                                namespace,
                            }}
                        >
                            {name}
                        </Link>
                    );
                },
            },
            {
                label: 'Deployed version',
                getter: ({
                    argoApplication,
                    application: {
                        spec: { lang, framework, buildTool },
                    },
                }) => {
                    if (!argoApplication) {
                        return;
                    }
                    const isHelm =
                        lang === CODEBASE_COMMON_LANGUAGES.HELM &&
                        framework === CODEBASE_COMMON_FRAMEWORKS.HELM &&
                        buildTool === CODEBASE_COMMON_BUILD_TOOLS.HELM;

                    const deployedVersion = !isHelm
                        ? argoApplication?.spec?.source?.helm?.parameters?.find(
                              el => el.name === 'image.tag'
                          )?.value
                        : argoApplication?.spec?.source?.targetRevision;

                    return argoApplication ? (
                        <>
                            <MuiLink href={_createArgoCDLink(argoApplication)} target={'_blank'}>
                                {deployedVersion}
                            </MuiLink>
                        </>
                    ) : (
                        'No deploy'
                    );
                },
            },
            {
                label: 'Image stream version',
                getter: ({
                    applicationImageStream,
                    applicationVerifiedImageStream,
                    application,
                }) => {
                    return (
                        <ImageStreamTagsSelect
                            applicationImageStream={applicationImageStream}
                            applicationVerifiedImageStream={applicationVerifiedImageStream}
                            application={application}
                            selected={selected}
                            handleRowClick={handleRowClick}
                        />
                    );
                },
            },
        ],
        [_createArgoCDLink, handleRowClick, selected]
    );
};