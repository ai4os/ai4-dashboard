export interface ZenodoDataset {
    id: string;
    created: string;
    doi_url: string;
    title: string;
    doi: string;
    description: string;
    creators: string[];
    keywords: string[];
    communities: string[];
}

export interface ZenodoDatasetVersion {
    id: string;
    version: string;
    title: string;
    doi: string;
    lastest: boolean;
}
