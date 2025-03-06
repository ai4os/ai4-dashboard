export interface PlatformStatus {
    id: number;
    title: string;
    vo?: string;
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
