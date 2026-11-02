export const endpoints = {
    // Catalog (modules)
    modulesSummary: '/catalog/modules/detail',
    module: '/catalog/modules/:name/metadata',
    moduleNomadConfiguration: '/catalog/modules/:name/config',

    // Catalog (tools)
    toolsSummary: '/catalog/tools/detail',
    tool: '/catalog/tools/:name/metadata',
    toolConfiguration: '/catalog/tools/:name/config',

    // Catalog (LLMs)
    llmsSelfSummary: '/catalog/llms/self/detail',
    llmsPlatformSummary: '/catalog/llms/platform/detail',

    // Deployments (modules)
    deployments: '/deployments/modules',

    deploymentByUUID: '/deployments/modules/:deploymentUUID',

    // Deployments (tools)
    toolByUUID: '/deployments/tools/:deploymentUUID',
    tools: '/deployments/tools',

    // Deployments (try me)
    nomadTryMeDeployments: '/try_me/nomad',
    nomadTryMeDeployment: '/try_me/nomad/:deployment_uuid',

    // Deployments (snapshots)
    deploymentSnapshots: '/snapshots',

    moduleOscarConfiguration: '/inference/oscar/conf',
    trainModule: '/deployments/modules',
    trainTool: '/deployments/tools',

    secrets: '/secrets',
    userStats: '/deployments/stats/user',
    clusterStats: '/deployments/stats/cluster',
    zenodo: '/proxies/zenodo',
    oscarServices: '/inference/oscar/services',
    oscarServiceByName: '/inference/oscar/services/:serviceName',

    snapshots: '/storage/:storage_name',
    batchDeployments: '/batch',
    batchDeploymentsByUUID: '/batch/:deploymentUUID',
    //OSCAR endpoints
    services: '/services',
    serviceByName: '/services/:name',
    runService: '/run/:name',
    // AI4Life modules
    ai4lifeModulesSummary:
        'https://raw.githubusercontent.com/ai4os/ai4os-ai4life-loader/main/models/filtered_models.json',
    // LLM chatbot
    chatCompletions: '/llm/chat',
    // LLM api keys (LiteLLM)
    litellm: '/llm/api_keys',
};
