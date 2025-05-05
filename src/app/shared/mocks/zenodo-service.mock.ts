import { of } from 'rxjs';
import {
    ZenodoCommunity,
    ZenodoSimpleDataset,
} from '../interfaces/dataset.interface';

export const mockedCommunities: ZenodoCommunity = {
    id: '1',
    title: 'https://zenodo.org/communities/test',
    link: 'Community Test',
};

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
