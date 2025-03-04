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
    secrets: '/secrets',
    userStats: '/deployments/stats/user',
    clusterStats: '/deployments/stats/cluster',
    zenodo: '/datasets/zenodo',
    oscarServices: '/inference/oscar/services',
    oscarServiceByName: '/inference/oscar/services/:serviceName',
    nomadTryMeDeployments: '/try_me/nomad',
    nomadTryMeDeployment: '/try_me/nomad/:deployment_uuid',
    deploymentSnapshots: '/snapshots',
    snapshots: '/storage/:storage_name',
    //OSCAR endpoints
    services: '/services',
    serviceByName: '/services/:name',
    runService: '/run/:name',
    // AI4Life modules
    ai4lifeModulesSummary:
        'https://raw.githubusercontent.com/ai4os/ai4os-ai4life-loader/main/models/filtered_models.json',
    // LLM chatbot
    chatCompletions: '/chat/completions',
};
