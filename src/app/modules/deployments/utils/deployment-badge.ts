export function getDeploymentBadge(status: string) {
    let statusBadge
    switch (status) {
        case 'pending':
        case 'scheduled':
        case 'queued':
            statusBadge = status + '-yellow'
            break;
        case 'starting':
        case 'running':
        case 'complete':
            statusBadge = status + '-brightgreen'
            break;
        case 'failed':
            statusBadge = status + '-red'
            break;
        case 'dead':
        case 'draining':
            statusBadge = status + '-lightgrey'
            break;
        default:
            statusBadge = 'unknown-lightgrey'
            break;
    }
    return statusBadge
}