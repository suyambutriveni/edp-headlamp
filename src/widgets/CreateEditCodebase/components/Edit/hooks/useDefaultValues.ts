import React from 'react';
import { useSpecificDialogContext } from '../../../../../providers/Dialog/hooks';
import { CREATE_EDIT_CODEBASE_DIALOG_NAME } from '../../../constants';
import { CODEBASE_FORM_NAMES } from '../../../names';
import { EditCodebaseFormDialogForwardedProps } from '../types';

export const useDefaultValues = () => {
    const {
        forwardedProps: { codebaseData },
    } = useSpecificDialogContext<EditCodebaseFormDialogForwardedProps>(
        CREATE_EDIT_CODEBASE_DIALOG_NAME
    );

    return React.useMemo(
        () => ({
            [CODEBASE_FORM_NAMES.hasJiraServerIntegration.name]: !!codebaseData?.spec.jiraServer,
            [CODEBASE_FORM_NAMES.namespace.name]: codebaseData?.metadata.namespace,
            [CODEBASE_FORM_NAMES.jiraServer.name]: codebaseData?.spec.jiraServer,
            [CODEBASE_FORM_NAMES.commitMessagePattern.name]:
                codebaseData?.spec.commitMessagePattern,
            [CODEBASE_FORM_NAMES.ticketNamePattern.name]: codebaseData?.spec.ticketNamePattern,
            [CODEBASE_FORM_NAMES.jiraIssueMetadataPayload.name]:
                codebaseData?.spec.jiraIssueMetadataPayload,
        }),
        [codebaseData]
    );
};