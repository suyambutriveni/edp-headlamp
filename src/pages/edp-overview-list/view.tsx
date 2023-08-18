import { SectionBox, SectionFilterHeader } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { DocLink } from '../../components/DocLink';
import { PageWrapper } from '../../components/PageWrapper';
import { EDP_USER_GUIDE } from '../../constants/urls';
import { EDPComponentKubeObject } from '../../k8s/EDPComponent';
import { EDPComponentKubeObjectInterface } from '../../k8s/EDPComponent/types';
import { rem } from '../../utils/styling/rem';
import { EDPComponentList } from './components/EDPComponentList';

export const PageView = () => {
    const [EDPComponents, setEDPComponents] =
        React.useState<EDPComponentKubeObjectInterface[]>(null);
    const [error, setError] = React.useState<unknown>(null);

    EDPComponentKubeObject.useApiList(
        (components: EDPComponentKubeObjectInterface[]) => {
            setEDPComponents(components.filter(el => el.spec.visible));
        },
        error => setError(error)
    );

    return (
        <PageWrapper>
            <SectionBox
                title={
                    <SectionFilterHeader
                        // @ts-ignore
                        title={
                            <Grid container alignItems={'center'} spacing={1}>
                                <Grid item>
                                    <Typography variant={'h5'}>Overview</Typography>
                                </Grid>
                                <Grid item>
                                    <DocLink href={EDP_USER_GUIDE.OVERVIEW.url} />
                                </Grid>
                            </Grid>
                        }
                        headerStyle="label"
                    />
                }
                sx={{ paddingTop: rem(20) }}
            >
                <EDPComponentList EDPComponents={EDPComponents} error={error} />
            </SectionBox>
        </PageWrapper>
    );
};
