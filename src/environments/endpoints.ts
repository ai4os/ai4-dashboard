export const endpoints = {
    modulesSummary: '/catalog/modules/detail',
    module: '/catalog/modules/:name/metadata',
    moduleConfiguration: '/catalog/modules/:name/config',
    trainModule: '/deployments/modules',
    trainTool: '/deployments/tools',
    deploymentByUUID: '/deployments/modules/:deploymentUUID',
    toolByUUID: '/deployments/tools/:deploymentUUID',
    deployments: '/deployments/modules',
    tools: '/deployments/tools',
    toolsSummary: '/catalog/tools/detail',
    tool: '/catalog/tools/:name/metadata',
    toolConfiguration: '/catalog/tools/:name/config',
    userStats: '/deployments/stats/user',
    clusterStats: '/deployments/stats/cluster',
};
