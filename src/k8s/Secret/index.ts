import { ApiProxy, K8s } from '@kinvolk/headlamp-plugin/lib';
import { KubeObjectListInterface } from '../../types/k8s';
import { streamResults } from '../common/streamResults';
import { SecretKubeObjectConfig } from './config';
import { ARGO_CD_SECRET_LABEL_SECRET_TYPE, SECRET_LABEL_SECRET_TYPE } from './labels';
import { SecretKubeObjectInterface, StreamSecretsByTypeProps } from './types';

const {
    name: { pluralForm },
    version,
} = SecretKubeObjectConfig;

export class SecretKubeObject extends K8s.secret.default {
    static getClusterSecretList(
        namespace: string
    ): Promise<KubeObjectListInterface<SecretKubeObjectInterface>> {
        const url = `/api/${version}/namespaces/${namespace}/${pluralForm}?labelSelector=${ARGO_CD_SECRET_LABEL_SECRET_TYPE}=cluster`;

        return ApiProxy.request(url);
    }

    static getSecretByName(namespace: string, name: string): Promise<SecretKubeObjectInterface> {
        const url = `/api/${version}/namespaces/${namespace}/${pluralForm}/${name}`;

        return ApiProxy.request(url);
    }

    static streamSecretsByType({
        namespace,
        type,
        dataHandler,
        errorHandler,
    }: StreamSecretsByTypeProps): () => void {
        const url = `/api/${version}/namespaces/${namespace}/${pluralForm}`;
        if (type) {
            return streamResults(url, dataHandler, errorHandler, {
                labelSelector: `${SECRET_LABEL_SECRET_TYPE}=${type}`,
            });
        }
        return streamResults(url, dataHandler, errorHandler);
    }
}
