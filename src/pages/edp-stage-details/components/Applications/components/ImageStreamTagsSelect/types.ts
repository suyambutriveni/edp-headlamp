import { EDPCodebaseKubeObjectInterface } from '../../../../../../k8s/EDPCodebase/types';
import { EDPCodebaseImageStreamKubeObjectInterface } from '../../../../../../k8s/EDPCodebaseImageStream/types';
import { React } from '../../../../../../plugin.globals';

export interface ImageStreamTagsSelectProps {
    applicationImageStream: EDPCodebaseImageStreamKubeObjectInterface;
    applicationVerifiedImageStream: EDPCodebaseImageStreamKubeObjectInterface;
    application: EDPCodebaseKubeObjectInterface;
    selected: string[];
    handleRowClick: (event: React.MouseEvent<unknown>, name: string) => void;
}