import React from 'react';
import { useFormContext as useReactHookFormContext } from 'react-hook-form';
import { VALIDATED_PROTOCOLS } from '../../../../../constants/validatedProtocols';
import { FormTextField } from '../../../../../providers/Form/components/FormTextField';
import { useFormContext } from '../../../../../providers/Form/hooks';
import { FORM_MODES } from '../../../../../types/forms';
import { getValidURLPattern } from '../../../../../utils/checks/getValidURLPattern';
import { DEPENDENCY_TRACK_INTEGRATION_SECRET_FORM_NAMES } from '../../../names';
import { ManageDependencyTrackIntegrationSecretFormDataContext } from '../../../types';

export const ExternalURL = () => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useReactHookFormContext();

  const {
    formData: { mode, depTrackQuickLink },
  } = useFormContext<ManageDependencyTrackIntegrationSecretFormDataContext>();

  return (
    <FormTextField
      {...register(DEPENDENCY_TRACK_INTEGRATION_SECRET_FORM_NAMES.externalUrl.name, {
        required: 'Enter the external DependencyTrack URL.',
        pattern: {
          value: getValidURLPattern(VALIDATED_PROTOCOLS.STRICT_HTTPS),
          message: 'Enter a valid URL with HTTPS protocol.',
        },
        onChange: ({ target: { value } }) => {
          if (mode === FORM_MODES.EDIT) {
            return;
          }

          setValue(DEPENDENCY_TRACK_INTEGRATION_SECRET_FORM_NAMES.url.name, value);
        },
      })}
      label={'Quick Link URL'}
      title={'Enter the external URL of your DependencyTrack instance.'}
      placeholder={'Enter URL'}
      control={control}
      errors={errors}
      disabled={!depTrackQuickLink}
    />
  );
};
