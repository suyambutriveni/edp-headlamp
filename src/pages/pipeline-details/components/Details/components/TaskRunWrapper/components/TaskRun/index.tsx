import { Divider, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { Tabs } from '../../../../../../../../components/Tabs';
import { TaskRunKubeObject } from '../../../../../../../../k8s/groups/Tekton/TaskRun';
import { TASK_RUN_LABEL_SELECTOR_PIPELINE_TASK } from '../../../../../../../../k8s/groups/Tekton/TaskRun/labels';
import { humanize } from '../../../../../../../../utils/date/humanize';
import { StyledDetailsBody, StyledDetailsHeader } from '../../../../styles';
import { useTabs } from './hooks/useTabs';
import { TaskRunProps } from './types';

export const TaskRun = ({ pipelineRunTaskData }: TaskRunProps) => {
  const { taskRun, task } = pipelineRunTaskData;
  const taskRunName = taskRun?.metadata?.labels?.[TASK_RUN_LABEL_SELECTOR_PIPELINE_TASK];
  const taskRunReason = TaskRunKubeObject.parseStatusReason(taskRun);

  const completionTime = taskRun?.status?.completionTime;
  const startTime = taskRun?.status?.startTime;

  const duration = humanize(new Date(completionTime).getTime() - new Date(startTime).getTime(), {
    language: 'en-mini',
    spacer: '',
    delimiter: ' ',
    fallbacks: ['en'],
    largest: 2,
    round: true,
    units: ['d', 'h', 'm', 's'],
  });

  const tabs = useTabs({ taskRun, task });

  return (
    <Paper>
      <StyledDetailsHeader>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography fontSize={(t) => t.typography.pxToRem(20)} fontWeight={500}>
              {taskRunName}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Typography
              fontSize={(t) => t.typography.pxToRem(14)}
              fontWeight={500}
              color="primary.dark"
            >
              Status:{' '}
              <Typography
                fontSize={(t) => t.typography.pxToRem(14)}
                component="span"
                color="secondary.dark"
              >
                {taskRunReason}
              </Typography>
            </Typography>
            <Typography
              fontSize={(t) => t.typography.pxToRem(14)}
              fontWeight={500}
              color="primary.dark"
            >
              Duration:{' '}
              <Typography
                fontSize={(t) => t.typography.pxToRem(14)}
                component="span"
                color="secondary.dark"
              >
                {duration}
              </Typography>
            </Typography>
          </Stack>
        </Stack>
      </StyledDetailsHeader>
      <Divider orientation="horizontal" />
      <StyledDetailsBody>
        <Tabs tabs={tabs} initialTabIdx={0} />
      </StyledDetailsBody>
    </Paper>
  );
};