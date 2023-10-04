import { Router } from '@kinvolk/headlamp-plugin/lib';
import { Chip, Grid, Tooltip, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { useParams } from 'react-router-dom';
import { InfoColumnsAccordion } from '../../components/InfoColumns';
import { PageWrapper } from '../../components/PageWrapper';
import { Render } from '../../components/Render';
import { StatusIcon } from '../../components/StatusIcon';
import { Resources } from '../../icons/sprites/Resources';
import { EDPCodebaseKubeObject } from '../../k8s/EDPCodebase';
import { EDPCodebaseKubeObjectInterface } from '../../k8s/EDPCodebase/types';
import { ResourceActionListContextProvider } from '../../providers/ResourceActionList';
import { rem } from '../../utils/styling/rem';
import { routeEDPComponentList } from '../edp-component-list/route';
import { CodebaseActions } from './components/CodebaseActions';
import { CodebaseBranchesList } from './components/CodebaseBranchesList';
import { CodebaseMetadataTable } from './components/CodebaseMetadataTable';
import { useInfoRows } from './hooks/useInfoRows';
import { useStyles } from './styles';
import { EDPComponentDetailsRouteParams } from './types';

export const PageView = () => {
    const classes = useStyles();
    const { namespace, name } = useParams<EDPComponentDetailsRouteParams>();
    const [component, setComponent] = React.useState<EDPCodebaseKubeObjectInterface>(null);
    const [, setError] = React.useState<Error>(null);

    const handleStoreComponent = React.useCallback((component: EDPCodebaseKubeObjectInterface) => {
        setComponent(component);
    }, []);

    const handleError = React.useCallback((error: Error) => {
        setError(error);
    }, []);

    React.useEffect(() => {
        const cancelStream = EDPCodebaseKubeObject.streamItem(
            name,
            namespace,
            handleStoreComponent,
            handleError
        );

        return () => cancelStream();
    }, [handleError, handleStoreComponent, name, namespace]);

    const infoRows = useInfoRows(component);

    const [icon, color, isRotating] = EDPCodebaseKubeObject.getStatusIcon(
        component?.status?.status
    );

    return (
        <PageWrapper
            breadcrumbs={[
                {
                    label: 'Components',
                    url: {
                        pathname: routeEDPComponentList.path,
                    },
                },
                {
                    label: (
                        <Grid container spacing={1} alignItems={'center'}>
                            <Grid item>
                                <StatusIcon
                                    icon={icon}
                                    color={color}
                                    isRotating={isRotating}
                                    width={15}
                                    Title={
                                        <>
                                            <Typography
                                                variant={'subtitle2'}
                                                style={{ fontWeight: 600 }}
                                            >
                                                {`Status: ${
                                                    component?.status?.status || 'Unknown'
                                                }`}
                                            </Typography>
                                            <Render
                                                condition={!!component?.status?.detailedMessage}
                                            >
                                                <Typography
                                                    variant={'subtitle2'}
                                                    style={{ marginTop: rem(10) }}
                                                >
                                                    {component?.status?.detailedMessage}
                                                </Typography>
                                            </Render>
                                        </>
                                    }
                                />
                            </Grid>
                            <Grid item>{name}</Grid>
                        </Grid>
                    ),
                },
            ]}
            breadcrumbsExtraContent={
                <Render condition={!!component}>
                    <div style={{ marginBottom: rem(2) }}>
                        <Grid container alignItems={'center'} spacing={2}>
                            <Grid item>
                                <Tooltip title={'Codebase Type'}>
                                    <Chip
                                        label={component?.spec.type}
                                        className={clsx([
                                            classes.labelChip,
                                            classes.labelChipGreen,
                                        ])}
                                    />
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </div>
                </Render>
            }
            headerSlot={
                <div style={{ marginLeft: 'auto' }}>
                    <Render condition={!!component}>
                        <Grid container spacing={1}>
                            <Grid item>
                                <CodebaseMetadataTable codebaseData={component} />
                            </Grid>
                            <Grid item>
                                <ResourceActionListContextProvider>
                                    <CodebaseActions
                                        codebase={component}
                                        backRoute={Router.createRouteURL(
                                            routeEDPComponentList.path
                                        )}
                                    />
                                </ResourceActionListContextProvider>
                            </Grid>
                        </Grid>
                    </Render>
                </div>
            }
        >
            <Resources />
            <Render condition={!!component}>
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={12} style={{ marginTop: rem(20) }}>
                            <InfoColumnsAccordion infoRows={infoRows} title={'Component Details'} />
                        </Grid>
                        <Grid item xs={12}>
                            <ResourceActionListContextProvider>
                                <CodebaseBranchesList codebaseData={component} />
                            </ResourceActionListContextProvider>
                        </Grid>
                    </Grid>
                </>
            </Render>
        </PageWrapper>
    );
};
