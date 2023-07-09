export const endpoints = {
  modulesSummary: '/modules/summary',
  module: '/modules/metadata/:name',
  moduleConfiguration: '/info/conf/:name',
  trainModule: '/deployments',
  deploymentByUUID: '/deployments/:deploymentUUID',
  deployments: '/deployments',

  //OSCAR endpoints
  services: '/services',
  serviceByName: '/services/:name',
  runService: '/run/:name'

};
