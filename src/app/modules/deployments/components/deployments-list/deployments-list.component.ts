import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { DeploymentsService } from '../../services/deployments.service';
import { DeploymentDetailComponent } from '../deployment-detail/deployment-detail.component';

export interface TableColumn {
  columnDef: any;
  header: string;
  hidden?: boolean
}

@Component({
  selector: 'app-deployments-list',
  templateUrl: './deployments-list.component.html',
  styleUrls: ['./deployments-list.component.scss']
})



export class DeploymentsListComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private translateService: TranslateService,
    private deploymentsService: DeploymentsService,
    public confirmationDialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
  }

  isLoading = false;

  columns: Array<TableColumn> = [
    { columnDef: 'uuid', header: '', hidden: true },
    { columnDef: 'name', header: 'DEPLOYMENTS.DEPLOYMENT-NAME' },
    { columnDef: 'status', header: 'DEPLOYMENTS.STATUS' },
    { columnDef: 'containerName', header: 'DEPLOYMENTS.CONTAINER-NAME' },
    { columnDef: 'gpus', header: 'DEPLOYMENTS.GPUS' },
    { columnDef: 'creationTime', header: 'DEPLOYMENTS.CREATION-TIME' },
    { columnDef: 'deployedAt', header: 'DEPLOYMENTS.NAMESPACE' },
  ];
  dataset: Array<any> = [];

  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [];

  openDetailsDialog() {

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  removeDeployment(e: MouseEvent, index: number) {
    e.stopPropagation();
    this.confirmationDialog.open(ConfirmationDialogComponent, {
      data: `¿Are you sure you want to delete this deployment?`
    })
      .afterClosed()
      .subscribe((confirmed: Boolean) => {
        if (confirmed) {
          let uuid = this.dataset[index].uuid;
          this.deploymentsService.deleteDeploymentByUUID(uuid).subscribe({
            next: (response: any) => {
              if(response && response['status'] == 'success'){
              const itemIndex = this.dataset.findIndex(obj => obj['uuid'] === uuid);
              this.dataset.splice(itemIndex, 1);
              this.dataSource = new MatTableDataSource<any>(this.dataset);
              this._snackBar.open("Successfully deleted deployment with uuid: " + uuid, "X",  {
                duration: 3000,
                panelClass: ['primary-snackbar']
            })  
              }else{
                this._snackBar.open("Error deleting deployment with uuid: " + uuid, "X",  {
                  duration: 3000,
                  panelClass: ['red-snackbar']
              })  
              }
            },
            error: () => {
              this._snackBar.open("Error deleting deployment with uuid: " + uuid, "X",  {
                duration: 3000,
                panelClass: ['red-snackbar']
            })
            }
          })
        }
      });
  }

  getDeploymentsList() {
    this.isLoading = true;
    this.deploymentsService.getDeployments().subscribe((deploymentsList: any) => {
      this.isLoading = false;
      deploymentsList.forEach((deployment: any) => {

        let row =
        {
          uuid: deployment.job_ID,
          name: deployment.title,
          status: deployment.status,
          containerName: deployment.docker_image,
          gpus: "-",
          creationTime: deployment.submit_time,
          deployedAt: "IFCA"
        }
        if(deployment.resources && Object.keys(deployment.resources).length !== 0){
          row.gpus = deployment.resources.gpu_num
        }
        this.dataset.push(row)
      })
      this.dataSource = new MatTableDataSource<any>(this.dataset);
    })
  }

  ngOnInit(): void {
    this.dataset = []
    this.getDeploymentsList();
    // set checkbox column
    //this.displayedColumns.push("select");

    // set table columns
    this.displayedColumns = this.displayedColumns.concat(this.columns.filter(x => !x.hidden).map(x => x.columnDef));    // pre-fix static
    // add action column
    this.displayedColumns.push("action");
    this.dataSource = new MatTableDataSource<any>(this.dataset);

    // set pagination
    //this.dataSource.paginator = this.paginator;

  }

}
