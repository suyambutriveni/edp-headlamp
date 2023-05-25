/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { GIT_SERVER_FORM_NAMES } from '../../../../widgets/CreateGitServer/names';
import { createGitServerInstance } from './index';

beforeEach(() => {
    jest.spyOn(global.window.crypto, 'getRandomValues').mockReturnValue(
        new Uint32Array([2736861854, 4288701136, 612580786, 3178865852, 3429947584])
    );
});

afterEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global.window.crypto, 'getRandomValues').mockRestore();
});

describe('testing createGitServerInstance', () => {
    it('should return valid kube object', () => {
        const object = createGitServerInstance(GIT_SERVER_FORM_NAMES, {
            sshPort: 22,
            httpsPort: 443,
            gitUser: 'git',
            gitProvider: 'gerrit',
            gitHost: 'github.com',
        });

        expect(object).toEqual({
            apiVersion: 'v2.edp.epam.com/v1',
            kind: 'GitServer',
            metadata: { name: 'github.com-8ygse' },
            spec: {
                gitHost: 'github.com',
                nameSshKeySecret: 'github.com-8ygse-config',
                sshPort: 22,
                httpsPort: 443,
                gitUser: 'git',
                gitProvider: 'gerrit',
            },
        });
    });
});