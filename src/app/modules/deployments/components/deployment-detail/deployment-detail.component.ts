import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DeploymentInfo } from '@app/shared/interfaces/deployment.interface';
import { DeploymentsService } from '../../services/deployments.service';

@Component({
  selector: 'app-deployment-detail',
  templateUrl: './deployment-detail.component.html',
  styleUrls: ['./deployment-detail.component.scss']
})
export class DeploymentDetailComponent implements OnInit {

  constructor(
    private deploymentsService: DeploymentsService,
    private route: ActivatedRoute,
    public confirmationDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  deploymentInfo: DeploymentInfo | undefined;
  statusBadge: string = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.deploymentsService.getDeploymentByUUID(params['uuid']).subscribe((deployment: DeploymentInfo) => {
        if (deployment.description == '') {
          deployment.description = '-'
        }
        switch (deployment.status) {
          case 'pending':
          case 'scheduled':
            this.statusBadge = deployment.status + '-yellow'
            break;
          case 'running':
          case 'complete':
            this.statusBadge = deployment.status + '-brightgreen'
            break;
          case 'dead':
          case 'draining':
            this.statusBadge = deployment.status + '-lightgrey'
            break;
          default:
            this.statusBadge = 'unknown-lightgrey'
            break;
        }
        
        this.deploymentInfo = deployment
      })
    });
  }

  deleteDeployment(){
    this.confirmationDialog.open(ConfirmationDialogComponent, {
      data: `¿Are you sure you want to delete this deployment?`
    })
      .afterClosed()
      .subscribe((confirmed: Boolean) => {
        if (confirmed) {
          let uuid = this.deploymentInfo!.job_ID
          this.deploymentsService.deleteDeploymentByUUID(uuid).subscribe({
            next: (response: any) => {
              if(response && response['status'] == 'success'){
                this.router.navigate(['/deployments']).then((navigated: boolean) => {
                  if (navigated) {
                    this._snackBar.open("Successfully deleted deployment with uuid: " + uuid)  
                  }
                });
              }else{
                this._snackBar.open("Error deleting deployment with uuid: " + uuid)  
              }
            },
            error: () => {
              this._snackBar.open("Error deleting deployment with uuid: " + uuid)
            }
          })
        }
      });
  }
  accessDeployment(){

  }

}
