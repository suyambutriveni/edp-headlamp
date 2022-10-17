import { getCodebasesByTypeLabel } from '../../../../../../k8s/EDPCodebase';
import { EDPCodebaseKubeObjectConfig } from '../../../../../../k8s/EDPCodebase/config';
import { EDPCodebaseKubeObjectInterface } from '../../../../../../k8s/EDPCodebase/types';
import { getCodebaseBranchesByCodebaseLabel } from '../../../../../../k8s/EDPCodebaseBranch';
import { React } from '../../../../../../plugin.globals';
import { createApplicationRowName } from '../../constants';
import { Application } from '../../types';

interface UseUpdatedApplicationsProps {
    setValue: (name: string, value: any) => void;
    values: {
        [key: string]: any;
    };
}

const getCodebaseWithBranchesList = (
    codebaseList: EDPCodebaseKubeObjectInterface[],
    namespaceFieldValue
): Promise<Application>[] => {
    return codebaseList.map(async ({ metadata: { name } }): Promise<Application> => {
        const { items: codebaseBranches } = await getCodebaseBranchesByCodebaseLabel(
            namespaceFieldValue,
            name
        );

        const branchesNames = codebaseBranches.map(el => el.metadata.name);

        if (branchesNames.length) {
            return {
                label: name,
                value: name,
                isUsed: false,
                availableBranches: branchesNames,
                chosenBranch: null,
                toPromote: false,
            };
        }

        return null;
    });
};

export const useUpdatedApplications = ({
    setValue,
    values,
}: UseUpdatedApplicationsProps): {
    applications: Application[];
    setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
    error: Error;
} => {
    const {
        namespaceFieldValue,
        applicationsFieldValue,
        applicationsToPromoteValue,
        applicationsBranchesFieldValue,
    } = values;

    const [applications, setApplications] = React.useState<Application[]>([]);
    const [error, setError] = React.useState<Error>(null);

    const updateUsedApp = React.useCallback(
        (applicationsFieldValueSet: Set<string>, applications: Application[]) => {
            if (!applicationsFieldValueSet.size) {
                return;
            }

            for (const app of applications) {
                if (!applicationsFieldValueSet.has(app.value)) {
                    continue;
                }

                const appRowName = `${createApplicationRowName(app.value)}-application-name`;

                setValue(appRowName, app.value);
                app.isUsed = true;
            }
        },
        [setValue]
    );

    const updateAppChosenBranch = React.useCallback(
        (applications: Application[]) => {
            if (!applicationsBranchesFieldValue || !applicationsBranchesFieldValue.length) {
                return;
            }

            for (const app of applications) {
                const applicationAvailableBranches = new Set(app.availableBranches);

                for (const applicationBranch of applicationsBranchesFieldValue) {
                    if (!applicationAvailableBranches.has(applicationBranch)) {
                        continue;
                    }

                    const appBranchRowName = `${createApplicationRowName(
                        app.value
                    )}-application-branch`;

                    setValue(appBranchRowName, applicationBranch);
                    app.chosenBranch = applicationBranch;
                }
            }
        },
        [applicationsBranchesFieldValue, setValue]
    );

    const updatePromotedApp = React.useCallback(
        (applicationsToPromoteValueSet: Set<string>, applications: Application[]) => {
            if (!applicationsToPromoteValueSet.size) {
                return;
            }

            for (const app of applications) {
                if (!applicationsToPromoteValueSet.has(app.value)) {
                    continue;
                }

                const appToPromoteRowName = `${createApplicationRowName(
                    app.value
                )}-application-promote`;

                setValue(appToPromoteRowName, true);
                app.toPromote = true;
            }
        },
        [setValue]
    );

    React.useEffect(() => {
        if (!namespaceFieldValue) {
            return;
        }

        const fetchApplications = async (): Promise<void> => {
            const { items: codebaseList } = await getCodebasesByTypeLabel(
                namespaceFieldValue,
                EDPCodebaseKubeObjectConfig.types.application.name.singularForm
            );

            const filteredApplications = (
                await Promise.all(getCodebaseWithBranchesList(codebaseList, namespaceFieldValue))
            ).filter(app => app !== null);

            const applicationsFieldValueSet = new Set<string>(applicationsFieldValue);
            const applicationsToPromoteValueSet = new Set<string>(applicationsToPromoteValue);

            updateUsedApp(applicationsFieldValueSet, filteredApplications);
            updateAppChosenBranch(filteredApplications);
            updatePromotedApp(applicationsToPromoteValueSet, filteredApplications);

            setApplications(filteredApplications);
            setError(null);
        };

        fetchApplications().catch(setError);
    }, [
        applicationsBranchesFieldValue,
        applicationsFieldValue,
        applicationsToPromoteValue,
        namespaceFieldValue,
        setValue,
        updateAppChosenBranch,
        updatePromotedApp,
        updateUsedApp,
    ]);

    return { applications, setApplications, error };
};