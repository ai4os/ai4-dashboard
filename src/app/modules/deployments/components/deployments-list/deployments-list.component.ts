import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';

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
    private translateService: TranslateService
    ) {
  }
  

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

  removeDeployment(index: number){
    
    console.log("removing...", index)
  }

  ngOnInit(): void {
    this.dataset = [
      {
        uuid: "11edc702-17a4-c685-b970-0242bb56267d",
        status: "CREATE_COMPLETE",
        containerName: "deephdc/deep-oc-generic-dev:latest",
        gpus: 2,
        creationTime: "test",
        deployedAt: "test"
      },
      {
        uuid: "11edc702-17a4-c685-b970-0242bb56267d",
        status: "CREATE_COMPLETE",
        containerName: "test",
        gpus: 2,
        creationTime: "test",
        deployedAt: "test"
      },
      {
        uuid: "11edc702-17a4-c685-b970-0242bb56267d",
        status: "CREATE_COMPLETE",
        containerName: "test",
        gpus: 2,
        creationTime: "test",
        deployedAt: "test"
      },
      {
        uuid: "11edc702-17a4-c685-b970-0242bb56267d",
        status: "test",
        containerName: "test",
        gpus: 2,
        creationTime: "test",
        deployedAt: "test"
      },
      {
        uuid: "11edc702-17a4-c685-b970-0242bb56267d",
        status: "test",
        containerName: "test",
        gpus: 2,
        creationTime: "test",
        deployedAt: "test"
      },
      {
        uuid: "11edc702-17a4-c685-b970-0242bb56267d",
        status: "test",
        containerName: "test",
        gpus: 2,
        creationTime: "test",
        deployedAt: "test"
      },
      {
        uuid: "11edc702-17a4-c685-b970-0242bb56267d",
        status: "test",
        containerName: "test",
        gpus: 2,
        creationTime: "test",
        deployedAt: "test"
      },
   
   
    ]
    // set checkbox column
    this.displayedColumns.push("select");

    // set table columns
    this.displayedColumns = this.displayedColumns.concat(this.columns.map(x => x.columnDef));    // pre-fix static
    // add action column
    this.displayedColumns.push("action");
    this.dataSource = new MatTableDataSource<any>(this.dataset);

    // set pagination
    //this.dataSource.paginator = this.paginator;
  }

}
