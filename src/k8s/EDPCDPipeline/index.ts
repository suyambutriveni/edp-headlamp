import { pluginLib } from '../../plugin.globals';
import { KubeObjectListInterface } from '../../types/k8s';
import { streamResult } from '../common/streamResult';
import { EDPCDPipelineKubeObjectConfig } from './config';
import { EDPCDPipelineKubeObjectInterface, EDPCDPipelineSpec, EDPCDPipelineStatus } from './types';

const {
    ApiProxy,
    K8s: {
        cluster: { makeKubeObject },
    },
} = pluginLib;
const {
    name: { singularForm, pluralForm },
    group,
    version,
} = EDPCDPipelineKubeObjectConfig;

export class EDPCDPipelineKubeObject extends makeKubeObject<EDPCDPipelineKubeObjectInterface>(
    singularForm
) {
    static apiEndpoint = ApiProxy.apiFactoryWithNamespace(group, version, pluralForm);

    static get className(): string {
        return singularForm;
    }

    get spec(): EDPCDPipelineSpec {
        return this.jsonData!.spec;
    }

    get status(): EDPCDPipelineStatus {
        return this.jsonData!.status;
    }

    static getList(
        namespace: string
    ): Promise<KubeObjectListInterface<EDPCDPipelineKubeObjectInterface>> {
        const url = `/apis/${group}/${version}/namespaces/${namespace}/${pluralForm}`;
        return ApiProxy.request(url);
    }

    static getItemByName(
        namespace: string,
        name: string
    ): Promise<EDPCDPipelineKubeObjectInterface> {
        const url = `/apis/${group}/${version}/namespaces/${namespace}/${pluralForm}/${name}`;
        return ApiProxy.request(url);
    }
}

export const streamCDPipeline = (
    name: string,
    namespace: string,
    cb: (data: EDPCDPipelineKubeObjectInterface | EDPCDPipelineKubeObjectInterface[]) => void,
    errCb: (err: Error) => void
): any => {
    const url = `/apis/${group}/${version}/namespaces/${namespace}/${pluralForm}`;
    return streamResult(url, name, cb, errCb);
};
