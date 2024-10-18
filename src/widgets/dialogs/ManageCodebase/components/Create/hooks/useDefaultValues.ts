import React from 'react';
import { CI_TOOLS } from '../../../../../../constants/ciTools';
import { CODEBASE_VERSIONING_TYPES } from '../../../../../../constants/codebaseVersioningTypes';
import { useGitServerListQuery } from '../../../../../../k8s/groups/EDP/GitServer/hooks/useGitServerListQuery';
import { CODEBASE_FORM_NAMES } from '../../../names';

const defaultEDPVersioningValue = '0.1.0-SNAPSHOT';
const [defaultEDPVersioningVersion, defaultEDPVersioningVersionPostfix] =
  defaultEDPVersioningValue.split('-');

export const useDefaultValues = () => {
  const { data: gitServers } = useGitServerListQuery({});

  const firstValidGitServer = gitServers?.items.find((gitServer) => gitServer.status.connected);

  return React.useMemo(
    () => ({
      [CODEBASE_FORM_NAMES.defaultBranch.name]: 'main',
      [CODEBASE_FORM_NAMES.emptyProject.name]: false,
      [CODEBASE_FORM_NAMES.versioningType.name]: CODEBASE_VERSIONING_TYPES.EDP,
      [CODEBASE_FORM_NAMES.versioningStartFrom.name]: defaultEDPVersioningValue,
      [CODEBASE_FORM_NAMES.versioningStartFromVersion.name]: defaultEDPVersioningVersion,
      [CODEBASE_FORM_NAMES.versioningStartFromSnapshot.name]: defaultEDPVersioningVersionPostfix,
      [CODEBASE_FORM_NAMES.ciTool.name]: CI_TOOLS.TEKTON,
      [CODEBASE_FORM_NAMES.gitServer.name]: firstValidGitServer?.metadata.name || '',
    }),
    [firstValidGitServer?.metadata.name]
  );
};
