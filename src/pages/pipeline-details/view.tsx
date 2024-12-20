import { Router } from '@kinvolk/headlamp-plugin/lib';
import React from 'react';
import { useParams } from 'react-router-dom';
import { LoadingWrapper } from '../../components/LoadingWrapper';
import { PageWrapper } from '../../components/PageWrapper';
import { Section } from '../../components/Section';
import { Tabs } from '../../providers/Tabs/components/Tabs';
import { useTabsContext } from '../../providers/Tabs/hooks';
import { PipelineRunActionsMenu } from '../../widgets/PipelineRunActionsMenu';
import { routePipelineRunList } from '../pipelines/route';
import { useTabs } from './hooks/useTabs';
import { useTypedPermissions } from './hooks/useTypedPermissions';
import { useDynamicDataContext } from './providers/DynamicData/hooks';
import { PipelineRouteParams } from './types';

// Complicated navigation logic
// Accordion = TaskRun
// Tab = TaskRun || Step

export const PageView = () => {
  const { name } = useParams<PipelineRouteParams>();

  const permissions = useTypedPermissions();

  const {
    pipelineRun,
    pipelineRunData: { isLoading: pipelineRunDataIsLoading },
  } = useDynamicDataContext();

  const tabs = useTabs();
  const { activeTab, handleChangeTab } = useTabsContext();

  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Pipelines',
          url: {
            pathname: routePipelineRunList.path,
          },
        },
        {
          label: name,
        },
      ]}
      headerSlot={
        <div>
          {!pipelineRun.isLoading && (
            <PipelineRunActionsMenu
              data={{
                pipelineRun: pipelineRun.data,
              }}
              permissions={permissions}
              backRoute={Router.createRouteURL(routePipelineRunList.path)}
              variant="inline"
            />
          )}
        </div>
      }
    >
      <Section title={name}>
        <LoadingWrapper isLoading={pipelineRunDataIsLoading}>
          <Tabs tabs={tabs} activeTabIdx={activeTab} handleChangeTab={handleChangeTab} />
        </LoadingWrapper>
      </Section>
    </PageWrapper>
  );
};
