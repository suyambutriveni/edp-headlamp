import { EDPCDPipelineKubeObject } from '../../../k8s/EDPCDPipeline';
import { EDPCDPipelineKubeObjectInterface } from '../../../k8s/EDPCDPipeline/types';
import { EDPCDPipelineStageKubeObject } from '../../../k8s/EDPCDPipelineStage';
import { EDPCDPipelineStageKubeObjectInterface } from '../../../k8s/EDPCDPipelineStage/types';
import { Notistack, React } from '../../../plugin.globals';
import { DeepPartial } from '../../../types/global';
import { createErrorMessage } from '../../../utils/createErrorMessage';
import { throwErrorNoty } from '../../../utils/throwErrorNoty';

const { useSnackbar } = Notistack;

export const useCreateCDPipeline = (
    onSuccess: () => void,
    onError: () => void
): {
    createCDPipeline: (
        newCDPipelineData: DeepPartial<EDPCDPipelineKubeObjectInterface>,
        stages: EDPCDPipelineStageKubeObjectInterface[]
    ) => Promise<EDPCDPipelineKubeObjectInterface | undefined>;
} => {
    const { enqueueSnackbar } = useSnackbar();

    const createCDPipeline = React.useCallback(
        async (
            newCDPipelineData: DeepPartial<EDPCDPipelineKubeObjectInterface>,
            stages: EDPCDPipelineStageKubeObjectInterface[]
        ): Promise<void> => {
            const {
                metadata: { name },
            } = newCDPipelineData;

            try {
                await EDPCDPipelineKubeObject.apiEndpoint.post(newCDPipelineData);

                for (const stage of stages) {
                    await EDPCDPipelineStageKubeObject.apiEndpoint.post(stage);
                }

                onSuccess();
            } catch (err: any) {
                const errorMessage = createErrorMessage(err, name);
                throwErrorNoty(enqueueSnackbar, errorMessage);
                onError();
                throw err;
            }
        },
        [enqueueSnackbar, onError, onSuccess]
    );

    return { createCDPipeline };
};
