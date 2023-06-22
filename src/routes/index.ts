import { routeEDPCDPipelineDetails } from '../pages/edp-cdpipeline-details/route';
import { routeEDPCDPipelineList } from '../pages/edp-cdpipeline-list/route';
import { routeEDPClusterList } from '../pages/edp-cluster-list/route';
import { routeEDPComponentDetails } from '../pages/edp-component-details/route';
import { routeEDPComponentList } from '../pages/edp-component-list/route';
import { routeEDPGitServerDetails } from '../pages/edp-gitserver-details/route';
import { routeEDPGitServerList } from '../pages/edp-gitserver-list/route';
import { routeEDPOverviewList } from '../pages/edp-overview-list/route';
import { routeEDPStageDetails } from '../pages/edp-stage-details/route';

export default [
    // Overview
    routeEDPOverviewList,

    // Components & children
    routeEDPComponentList,
    routeEDPComponentDetails,

    // CD Pipelines & children
    routeEDPCDPipelineList,
    routeEDPCDPipelineDetails,
    routeEDPStageDetails,

    // Git Servers & children

    routeEDPGitServerList,
    routeEDPGitServerDetails,

    // Clusters & children
    routeEDPClusterList,
];
