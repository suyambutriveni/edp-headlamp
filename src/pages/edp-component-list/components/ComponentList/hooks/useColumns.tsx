import { CodebaseActions } from '../../../../../components/CodebaseActions';
import { HeadlampSimpleTableGetterColumn } from '../../../../../components/HeadlampSimpleTable/types';
import { StatusIcon } from '../../../../../components/StatusIcon';
import { CUSTOM_RESOURCE_STATUSES } from '../../../../../constants/statuses';
import { EDPCodebaseKubeObjectInterface } from '../../../../../k8s/EDPCodebase/types';
import { pluginLib, React } from '../../../../../plugin.globals';
import { COMPONENTS_ROUTE_NAME } from '../../../../../routes/names';
import { capitalizeFirstLetter } from '../../../../../utils/format/capitalizeFirstLetter';
import { createRouteNameBasedOnNameAndNamespace } from '../../../../../utils/routes/createRouteName';
import { sortByName } from '../../../../../utils/sort/sortByName';
import { sortByStatus } from '../../../../../utils/sort/sortByStatus';

const {
    CommonComponents: { Link },
} = pluginLib;

export const useColumns = (): HeadlampSimpleTableGetterColumn<EDPCodebaseKubeObjectInterface>[] =>
    React.useMemo(
        () => [
            {
                label: 'Status',
                getter: ({ status }) => (
                    <StatusIcon
                        status={status ? status.status : CUSTOM_RESOURCE_STATUSES['UNKNOWN']}
                    />
                ),
                sort: (a, b) => sortByStatus(a.status.status, b.status.status),
            },
            {
                label: 'Name',
                getter: ({ metadata: { name, namespace } }) => {
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
                sort: (a, b) => sortByName(a.metadata.name, b.metadata.name),
            },
            {
                label: 'Type',
                getter: ({ spec: { type } }) => capitalizeFirstLetter(type),
            },
            {
                label: 'Language',
                getter: ({ spec: { lang } }) => lang,
                sort: (a, b) => sortByName(a.spec.lang, b.spec.lang),
            },
            {
                label: 'Framework',
                getter: ({ spec: { framework } }) => framework,
                sort: (a, b) => sortByName(a.spec.framework, b.spec.framework),
            },
            {
                label: 'Build Tool',
                getter: ({ spec: { buildTool } }) => buildTool,
                sort: (a, b) => sortByName(a.spec.buildTool, b.spec.buildTool),
            },
            {
                label: 'CI Tool',
                getter: ({ spec: { ciTool } }) => ciTool,
                sort: (a, b) => sortByName(a.spec.ciTool, b.spec.ciTool),
            },
            {
                label: '',
                getter: kubeObjectData => <CodebaseActions kubeObjectData={kubeObjectData} />,
            },
        ],
        []
    );
