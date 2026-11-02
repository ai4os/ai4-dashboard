import { DeploymentTableRow } from '@app/shared/interfaces/deployment.interface';
import { UiTableColumn } from '../ui/ui-table/ui-table.component';

export const deploymentNameColumn: UiTableColumn<DeploymentTableRow> = {
    key: 'name',
    label: 'DEPLOYMENTS.DEPLOYMENT-NAME',
    sticky: true,
    sortable: true,
    width: '200px',
};

export const deploymentStatusColumn: UiTableColumn<DeploymentTableRow> = {
    key: 'status',
    label: 'DEPLOYMENTS.STATUS',
    align: 'center',
    sortable: true,
    width: '130px',
};

export const deploymentContainerColumn: UiTableColumn<DeploymentTableRow> = {
    key: 'containerName',
    label: 'DEPLOYMENTS.CONTAINER-NAME',
    minWidth: '230px',
};

export const deploymentCreationTimeColumn: UiTableColumn<DeploymentTableRow> = {
    key: 'creationTime',
    label: 'DEPLOYMENTS.CREATION-TIME',
    align: 'center',
    sortable: true,
    width: '190px',
};

export const deploymentActionsColumn: UiTableColumn<DeploymentTableRow> = {
    key: 'actions',
    label: 'DEPLOYMENTS.ACTIONS',
    align: 'right',
    width: 'auto',
};
