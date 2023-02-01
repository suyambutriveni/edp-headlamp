import { EDPCodebaseSpecInterface } from '../../../k8s/EDPCodebase/types';
import { MuiCore, React } from '../../../plugin.globals';
import { NameValueTableRow } from '../../HeadlampNameValueTable/types';
import { Render } from '../../Render';

const { Typography, Divider } = MuiCore;

export const useRows = (
    codebaseSpec: EDPCodebaseSpecInterface,
    classes: { [key: string]: string }
) =>
    React.useMemo(() => {
        const base: NameValueTableRow[] = [
            {
                name: 'CI Tool',
                value: codebaseSpec.ciTool,
            },
        ];

        if (codebaseSpec.deploymentScript) {
            base.push({
                name: 'Deployment Script',
                value: codebaseSpec.deploymentScript,
            });
        }

        if (codebaseSpec.jobProvisioning) {
            base.push({
                name: 'Job Provisioning',
                value: codebaseSpec.jobProvisioning,
            });
        }

        if (codebaseSpec.jenkinsSlave) {
            base.push({
                name: 'Jenkins Agent',
                value: codebaseSpec.jenkinsSlave,
            });
        }

        if (codebaseSpec.gitUrlPath) {
            base.push({
                name: 'Git URL Path',
                value: codebaseSpec.gitUrlPath,
            });
        }

        if (codebaseSpec.repository) {
            base.push({
                name: 'Repository URL',
                value: codebaseSpec.repository.url,
            });
        }

        if (codebaseSpec.jiraServer) {
            base.push({
                name: 'Jira Server',
                value: codebaseSpec.jiraServer,
            });
        }

        if (codebaseSpec.jiraIssueMetadataPayload) {
            const parsedJiraConfiguration: {
                components: string;
                fixVersions: string;
                labels: string;
            } = JSON.parse(codebaseSpec.jiraIssueMetadataPayload);
            const parsedJiraConfigurationEntries = Object.entries(parsedJiraConfiguration);

            base.push({
                name: 'Jira Issue Metadata Payload',
                value: (
                    <Render condition={!!codebaseSpec.jiraIssueMetadataPayload}>
                        <>
                            {parsedJiraConfigurationEntries.map(([name, value], idx) => {
                                const key = `jiraProp::${idx}`;

                                return (
                                    <div key={key}>
                                        <Render condition={idx !== 0}>
                                            <Divider className={classes.divider} />
                                        </Render>
                                        <div>
                                            <Typography
                                                className={classes.statusLabel}
                                                component="span"
                                            >
                                                {name}:
                                            </Typography>
                                            <Typography
                                                component="div"
                                                className={classes.valueField}
                                            >
                                                "{value}"
                                            </Typography>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    </Render>
                ),
            });
        }

        if (codebaseSpec.commitMessagePattern) {
            base.push({
                name: 'Commit Message Pattern',
                value: (
                    <Render condition={!!codebaseSpec.commitMessagePattern}>
                        <Typography className={classes.statusLabel} component="span">
                            {codebaseSpec.commitMessagePattern}
                        </Typography>
                    </Render>
                ),
            });
        }

        if (codebaseSpec.ticketNamePattern) {
            base.push({
                name: 'Ticket Name Pattern',
                value: (
                    <Render condition={!!codebaseSpec.ticketNamePattern}>
                        <Typography className={classes.statusLabel} component="span">
                            {codebaseSpec.ticketNamePattern}
                        </Typography>
                    </Render>
                ),
            });
        }

        return base;
    }, [codebaseSpec, classes]);
