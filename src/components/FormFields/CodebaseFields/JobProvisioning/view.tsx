import { useFormContext } from 'react-hook-form';
import { ciPipelineProvisionerSelectOptions } from '../../../../configs/select-options/ciPipelineProvisioners';
import { MuiCore, React } from '../../../../plugin.globals';
import { FieldEvent } from '../../../../types/forms';
import { FormSelect } from '../../../FormComponents';
import { JobProvisioningProps } from './types';

const { Grid } = MuiCore;

export const JobProvisioning = ({ names, handleFormFieldChange }: JobProvisioningProps) => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <Grid item xs={12}>
            <FormSelect
                {...register(names.jobProvisioning.name, {
                    required: 'Select Job Provisioner which will be used to handle codebase.',
                    onBlur: ({ target: { name, value } }: FieldEvent) =>
                        handleFormFieldChange({ name, value }),
                })}
                label={'CI pipeline provisioner'}
                placeholder={'Select CI pipeline provisioner'}
                title={'Select Job Provisioner which will be used to handle codebase.'}
                control={control}
                errors={errors}
                options={ciPipelineProvisionerSelectOptions}
            />
        </Grid>
    );
};
