import { set } from 'lodash';
import { FormNameObject } from '../../../../../../types/forms';
import { DeepPartial } from '../../../../../../types/global';
import { EDPKubeObjectInterface } from '../../../../../../types/k8s';
import { safeEncode } from '../../../../../../utils/decodeEncode';
import { CodemieSecretFormValues } from '../../../../../../widgets/ManageCodeMie/types';
import {
  SECRET_LABEL_ASSOCIATED_KIND,
  SECRET_LABEL_SECRET_TYPE,
} from '../../../../default/Secret/labels';
import { CodemieKubeObjectConfig } from '../../config';

export const createCodemieSecretInstance = (
  names: {
    [key: string]: FormNameObject;
  },
  formValues: CodemieSecretFormValues
): DeepPartial<EDPKubeObjectInterface> => {
  const { clientId, clientSecret, name, ...restProps } = formValues;

  const base: DeepPartial<EDPKubeObjectInterface> = {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name,
      labels: {
        [SECRET_LABEL_SECRET_TYPE]: 'codemie',
        [SECRET_LABEL_ASSOCIATED_KIND]: CodemieKubeObjectConfig.kind,
      },
    },
    data: {
      client_id: safeEncode(clientId),
      client_secret: safeEncode(clientSecret),
    },
    type: 'Opaque',
  };

  for (const [propKey, propValue] of Object.entries(restProps)) {
    const propPath = names[propKey].path;
    set(base, propPath, propValue);
  }

  return base;
};
