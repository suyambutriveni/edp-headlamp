import { ICON_PENCIL, ICON_THREE_DOTS } from '../../constants/icons';
import { KUBE_OBJECT_ACTION_EDIT } from '../../constants/kubeObjectActions';
import { Iconify, MuiCore, React } from '../../plugin.globals';
import { KubeObjectAction } from '../../types/actions';
import { createKubeAction } from '../../utils/actions/createKubeAction';
import { EditKubeObject } from '../EditKubeObject';
import { KubeObjectActions } from '../KubeObjectActions';
import { CodebaseListRowActionsProps } from './types';

const { Icon } = Iconify;
const { IconButton } = MuiCore;

export const CodebaseListRowActions: React.FC<CodebaseListRowActionsProps> = ({
    kubeObject,
    kubeObjectData,
}): React.ReactElement => {
    const [editActionEditorOpen, setEditActionEditorOpen] = React.useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const toggleActionsMenu = React.useCallback(
        event => {
            setAnchorEl(prev => (prev === event.currentTarget ? null : event.currentTarget));
        },
        [setAnchorEl]
    );

    const handleCloseActionsMenu = () => {
        setAnchorEl(null);
    };

    const actions: KubeObjectAction[] = [
        createKubeAction({
            name: KUBE_OBJECT_ACTION_EDIT,
            icon: ICON_PENCIL,
            action: () => {
                handleCloseActionsMenu();
                setEditActionEditorOpen(true);
            },
        }),
    ];

    return (
        <KubeObjectActions
            anchorEl={anchorEl}
            handleCloseActionsMenu={handleCloseActionsMenu}
            actions={actions}
        >
            <div>
                <IconButton aria-label={'Options'} onClick={toggleActionsMenu}>
                    <Icon icon={ICON_THREE_DOTS} color={'grey'} width="20" />
                </IconButton>
                <EditKubeObject
                    editorOpen={editActionEditorOpen}
                    setEditorOpen={setEditActionEditorOpen}
                    kubeObject={kubeObject}
                    kubeObjectData={kubeObjectData}
                />
            </div>
        </KubeObjectActions>
    );
};
