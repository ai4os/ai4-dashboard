import {
    ZenodoCommunity,
    ZenodoDataset,
    ZenodoDatasetVersion,
    ZenodoSimpleDataset,
} from '@app/shared/interfaces/dataset.interface';
import { of } from 'rxjs';

export const mockedDatasets: ZenodoDataset[] = [
    {
        id: '1',
        created: '2024-03-15T10:50:47.284986+00:00',
        doi_url: 'https://doi.org/10.5281/zenodo.10777441',
        title: 'EyeOnWater training dataset for assessing the inclusion of water images',
        doi: '10.5281/zenodo.10777441',
        description: 'description',
        creators: ['Krijger, Tjerk'],
        keywords: ['EyeOnWater', 'training'],
        communities: ['imagine-project', 'eu'],
    },
    {
        id: '2',
        created: '2024-05-15T07:57:43.513436+00:00',
        doi_url: 'https://doi.org/10.5281/zenodo.11195949',
        title: 'Labeled Images at OBSEA for Object Detection Algorithms',
        doi: '10.5281/zenodo.11195949',
        description: 'description',
        creators: ['Baños Castelló, Pol', 'Prat Bayarri, Oriol'],
        keywords: ['underwater pictures', 'marine species'],
        communities: ['imagine-project', 'eu'],
    },
];

export const mockedVersions: ZenodoDatasetVersion[] = [
    {
        id: '10777412',
        title: 'EyeOnWater training dataset for assessing the inclusion of water images',
        doi: '10.5281/zenodo.10777441',
        version: '2',
        lastest: false,
    },
    {
        id: '10777441',
        title: 'EyeOnWater training dataset for assessing the inclusion of water images',
        doi: '10.5281/zenodo.10777441',
        version: '1',
        lastest: true,
    },
];

export const mockedCommunities: ZenodoCommunity[] = [
    {
        id: 'ai4eosc',
        title: 'AI4EOSC',
        link: 'www.ai4eosc.eu',
    },
    {
        id: 'imagine-project',
        title: 'iMagine',
        link: 'www.imagine-project.eu',
    },
];

export const mockedDataset: ZenodoSimpleDataset = {
    doiOrUrl: '10.1234/example',
    title: 'Example Dataset',
    source: 'zenodo',
    force_pull: false,
};

export const mockedDatasetRow = {
    doi: '10.1234/example.doi',
    name: 'Example Dataset',
    source: 'Zenodo',
    forcePull: true,
};

export const mockedZenodoService = {
    getCommunities: jest.fn().mockReturnValue(of(mockedCommunities)),
    getDataset: jest.fn().mockReturnValue(of(mockedDataset)),
};
