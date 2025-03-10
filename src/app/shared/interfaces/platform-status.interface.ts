export interface PlatformStatus {
    id: number;
    title: string;
    labels: IssueLabel[];
    body?: string;
    start?: Date;
    end?: Date;
}

export interface StatusNotification {
    title: string;
    vo?: string;
    summary?: string;
    start?: Date;
    end?: Date;
    downtimeStart?: Date;
    downtimeEnd?: Date;
    datacenters?: string[];
}

export interface IssueLabel {
    name: string;
}
