import React from 'react';
import { useFormContext as useReactHookFormContext } from 'react-hook-form';
import { FormTextFieldPassword } from '../../../../../providers/Form/components/FormTextFieldPassword';
import { useFormContext } from '../../../../../providers/Form/hooks';
import { FORM_MODES } from '../../../../../types/forms';
import { ValueOf } from '../../../../../types/global';
import { REGISTRY_NAMES } from '../../../names';
import { ManageRegistryDataContext } from '../../../types';

export const PullAccountPassword = ({ mode }: { mode: ValueOf<typeof FORM_MODES> }) => {
    const {
        register,
        control,
        formState: { errors },
    } = useReactHookFormContext();

    const {
        formData: { pullAccountSecret },
    } = useFormContext<ManageRegistryDataContext>();

    const hasOwnerReference = !!pullAccountSecret?.metadata?.ownerReferences;

    return (
        <FormTextFieldPassword
            {...register(REGISTRY_NAMES.PULL_ACCOUNT_PASSWORD, {
                required: 'Enter password or token',
            })}
            label={`Password / Token`}
            title={
                'Enter the confidential combination used for authenticating your access to the Container registry.'
            }
            placeholder={'Enter password or token'}
            control={control}
            errors={errors}
            disabled={mode === FORM_MODES.EDIT && hasOwnerReference}
        />
    );
};