import React from 'react';
import { useParams } from 'react-router-dom';
import { LoadingWrapper } from '../../../../components/LoadingWrapper';
import { PageWrapper } from '../../../../components/PageWrapper';
import { Section } from '../../../../components/Section';
import { PipelineKubeObject } from '../../../../k8s/groups/Tekton/Pipeline';
import { Tabs } from '../../../../providers/Tabs/components/Tabs';
import { useTabsContext } from '../../../../providers/Tabs/hooks';
import { routePipelineList } from '../pipeline-list/route';
import { useTabs } from './hooks/useTabs';
import { PipelineDetailsRouteParams } from './types';

export const PageView = () => {
  const { namespace, name } = useParams<PipelineDetailsRouteParams>();
  const [item, error] = PipelineKubeObject.useGet(name, namespace);

  const tabs = useTabs({ pipeline: item });

  const { activeTab, handleChangeTab } = useTabsContext();

  return (
    <PageWrapper
      containerMaxWidth={'xl'}
      breadcrumbs={[
        {
          label: 'Pipelines',
          url: {
            pathname: routePipelineList.path,
          },
        },
        {
          label: name,
        },
      ]}
    >
      <Section title={name}>
        <LoadingWrapper isLoading={item === null && !error}>
          <Tabs tabs={tabs} activeTabIdx={activeTab} handleChangeTab={handleChangeTab} />
        </LoadingWrapper>
      </Section>
    </PageWrapper>
  );
};
