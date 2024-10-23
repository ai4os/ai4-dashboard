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

export interface ZenodoCommunity {
    id: string;
    title: string;
    link: string;
}

export interface ZenodoSimpleDataset {
    doiOrUrl: string;
    title: string;
    source: string;
    force_pull: boolean;
}
