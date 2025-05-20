export const mockedOAuthModuleConfig: any = {
    resourceServer: {
        allowedUrls: ['https://api.test.ai4eosc.eu/v1'],
        sendAccessToken: true,
    },
};

export const mockedConfig = {
    title: 'AI4EOSC - Dashboard',
    sidenavMenu: [
        {
            name: 'SIDENAV.IAM',
            url: 'https://aai.egi.eu/',
        },
    ],
    voName: 'vo.ai4eosc.eu',
    projectName: 'AI4EOSC',
    projectUrl: 'https://ai4eosc.eu',
    acknowledgments:
        'The AI4EOSC dashboard is a service provided by CSIC, co-funded by ',
    footerLinks: [
        {
            name: 'SIDENAV.TERMS-OF-USE',
            url: 'https://ai4eosc.eu/platform/acceptable-use-policy/',
        },
    ],
};
