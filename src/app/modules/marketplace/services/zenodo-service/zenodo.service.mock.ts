import { ZenodoDataset } from '@app/shared/interfaces/dataset.interface';

export const datasets: ZenodoDataset[] = [
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
