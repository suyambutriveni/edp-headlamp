import React from 'react';
import { useForm } from 'react-hook-form';
import { CRUD_TYPES } from '../../../constants/crudTypes';
import { useResourceCRUDMutation } from '../../../hooks/useResourceCRUDMutation';
import { JiraServerKubeObject } from '../../../k8s/JiraServer';
import { JiraServerKubeObjectInterface } from '../../../k8s/JiraServer/types';
import { createJiraServerInstance } from '../../../k8s/JiraServer/utils/createJiraServerInstance';
import { JiraServerFormValues } from '../types';

export const useJiraServerCreateForm = () => {
  const jiraServerCreateMutation = useResourceCRUDMutation<
    JiraServerKubeObjectInterface,
    CRUD_TYPES.CREATE
  >('jiraServerCreateMutation', JiraServerKubeObject, CRUD_TYPES.CREATE);

  const defaultValues = React.useMemo(() => ({}), []);

  const form = useForm<JiraServerFormValues>({
    defaultValues: defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues, { keepDirty: false });
  }, [defaultValues, form]);

  const handleSubmit = React.useCallback(
    async (values: JiraServerFormValues) => {
      const { url } = values;

      const newJiraServerData = createJiraServerInstance(url);

      jiraServerCreateMutation.mutate(newJiraServerData);
    },
    [jiraServerCreateMutation]
  );

  return React.useMemo(
    () => ({ form, mutation: jiraServerCreateMutation, handleSubmit }),
    [form, jiraServerCreateMutation, handleSubmit]
  );
};
