import { CreateCDPipeline } from '../../../../components/CreateCDPipeline';
import { useCreateCDPipeline } from '../../../../components/CreateCDPipeline/hooks/useCreateCDPipeline';
import { DELAYS } from '../../../../constants/delays';
import { ICONS } from '../../../../constants/icons';
import { EDPCDPipelineKubeObjectInterface } from '../../../../k8s/EDPCDPipeline/types';
import { EDPCDPipelineStageKubeObjectInterface } from '../../../../k8s/EDPCDPipelineStage/types';
import { Iconify, MuiCore, React, ReactRedux } from '../../../../plugin.globals';
import { clusterAction } from '../../../../redux/actions';
import { DeepPartial } from '../../../../types/global';
import { useStyles } from './styles';
import { FloatingActionsProps } from './types';

const { Fab } = MuiCore;
const { Icon } = Iconify;
const { useDispatch } = ReactRedux;

export const FloatingActions: React.FC<FloatingActionsProps> = (): React.ReactElement => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(false);

    const onClose = React.useCallback(() => {
        setCreateDialogOpen(false);
    }, [setCreateDialogOpen]);

    const [isApplying, setIsApplying] = React.useState<boolean>(false);

    const { createCDPipeline } = useCreateCDPipeline(
        () => {
            setCreateDialogOpen(false);
            setIsApplying(false);
        },
        () => {
            setCreateDialogOpen(true);
            setIsApplying(false);
        }
    );

    const applyFunc = React.useCallback(
        async (
            newCDPipelineData: DeepPartial<EDPCDPipelineKubeObjectInterface>,
            stages: EDPCDPipelineStageKubeObjectInterface[]
        ): Promise<EDPCDPipelineKubeObjectInterface | undefined> =>
            createCDPipeline(newCDPipelineData, stages),
        [createCDPipeline]
    );
    const handleApply = React.useCallback(
        async (
            newCDPipelineData: DeepPartial<EDPCDPipelineKubeObjectInterface>,
            stages: EDPCDPipelineStageKubeObjectInterface[]
        ): Promise<void> => {
            const {
                metadata: { name },
            } = newCDPipelineData;
            const cancelUrl = location.pathname;

            setIsApplying(true);

            dispatch(
                clusterAction(() => applyFunc(newCDPipelineData, stages), {
                    startMessage: `Applying ${name}`,
                    cancelledMessage: `Cancelled applying ${name}`,
                    successMessage: `Applied ${name}`,
                    errorMessage: `Failed to apply ${name}`,
                    cancelUrl,
                })
            );

            // temporary solution, since we cannot pass any callbacks for action cancelling
            setTimeout(() => setIsApplying(false), DELAYS['CANCEL_ACTION_FALLBACK']);
        },
        [applyFunc, dispatch]
    );
    return (
        <>
            <Fab
                aria-label="add"
                onClick={() => setCreateDialogOpen(true)}
                className={classes.floatingAddButton}
            >
                <Icon icon={ICONS['PLUS']} className={classes.floatingAddButtonIcon} />
            </Fab>
            <CreateCDPipeline
                open={createDialogOpen}
                setOpen={setCreateDialogOpen}
                onClose={onClose}
                handleApply={handleApply}
                isApplying={isApplying}
            />
        </>
    );
};
