export function getDeploymentBadge(status: string) {
    let statusBadge;
    switch (status) {
        case 'pending':
        case 'scheduled':
        case 'queued':
            statusBadge = status + '-fd5d00';
            break;
        case 'starting':
            statusBadge = status + '-yellow';
            break;
        case 'in progress':
            statusBadge = status + '-orange';
            break;
        case 'running':
            statusBadge = status + '-brightgreen';
            break;
        case 'failed':
        case 'error':
            statusBadge = status + '-red';
            break;
        case 'dead':
        case 'draining':
        case 'complete':
            statusBadge = status + '-lightgrey';
            break;
        default:
            statusBadge = 'unknown-lightgrey';
            break;
    }
    return statusBadge;
}

export function getSnapshotBadge(status: string) {
    let statusBadge;
    switch (status) {
        case 'queued':
            statusBadge = status + '-fd5d00';
            break;
        case 'starting':
            statusBadge = status + '-yellow';
            break;
        case 'in progress':
            statusBadge = status + '-orange';
            break;
        case 'running':
            statusBadge = status + '-brightgreen';
            break;
        case 'error':
            statusBadge = status + '-red';
            break;
        case 'complete':
            statusBadge = status + '-brightgreen';
            break;
        default:
            statusBadge = 'unknown-lightgrey';
            break;
    }
    return statusBadge;
}
