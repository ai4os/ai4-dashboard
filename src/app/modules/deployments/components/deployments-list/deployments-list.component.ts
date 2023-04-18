import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { DeploymentsService } from '../../services/deployments.service';
import { DeploymentDetailComponent } from '../deployment-detail/deployment-detail.component';

export interface TableColumn {
  columnDef: any;
  header: string
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
    ) {
  }
  
  isLoading = false;

  columns: Array<TableColumn> = [
    { columnDef: 'uuid', header: 'DEPLOYMENTS.UUID'},
    { columnDef: 'status', header: 'DEPLOYMENTS.STATUS'},
    { columnDef: 'containerName', header: 'DEPLOYMENTS.CONTAINER-NAME' },
    { columnDef: 'gpus', header: 'DEPLOYMENTS.GPUS' },
    { columnDef: 'creationTime', header: 'DEPLOYMENTS.CREATION-TIME' },
    { columnDef: 'deployedAt', header: 'DEPLOYMENTS.DEPLOYED-AT' },
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

  removeDeployment(e: MouseEvent, index: number){
    e.stopPropagation();
    console.log("removing...", index)
  }

  getDeploymentsList(){
    this.isLoading = true;
    this.deploymentsService.getDeployments().subscribe( (deploymentsList: any) => {
      this.isLoading = false;
      console.log("lista de deployments para janedoe", deploymentsList)
      deploymentsList.forEach((deployment: any) => {
        
        let row = 
        {
          uuid: deployment.job_ID,
          status: deployment.status,
          containerName: "deephdc/deep-oc-generic-dev:latest",
          gpus: 2,
          creationTime: deployment.submit_time,
          deployedAt: "IFCA"
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
    this.displayedColumns = this.displayedColumns.concat(this.columns.map(x => x.columnDef));    // pre-fix static
    // add action column
    this.displayedColumns.push("action");
    this.dataSource = new MatTableDataSource<any>(this.dataset);

    // set pagination
    //this.dataSource.paginator = this.paginator;
   
  }

}
