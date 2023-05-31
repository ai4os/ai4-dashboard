import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }



  

  deploymentInfo: DeploymentInfo | undefined;
  statusBadge: string = '';
  isLoading: boolean = false;
  protected deploymentHasError: boolean = false;

  ngOnInit(): void {
    if (this.data.uuid) {
      this.isLoading =  true;
      this.deploymentsService.getDeploymentByUUID(this.data.uuid).subscribe((deployment: DeploymentInfo) => {
        this.isLoading = false;
        if(deployment.error_msg && deployment.error_msg != ""){
          this.deploymentHasError = true 
        }
        if (deployment.description == '') {
          deployment.description = '-'
        }
        switch (deployment.status) {
          case 'pending':
          case 'scheduled':
          case 'queued':
            this.statusBadge = deployment.status + '-yellow'
            break;
          case 'starting':
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
    }
  }

  deleteDeployment() {
    this.confirmationDialog.open(ConfirmationDialogComponent, {
      data: `¿Are you sure you want to delete this deployment?`
    })
      .afterClosed()
      .subscribe((confirmed: Boolean) => {
        if (confirmed) {
          let uuid = this.deploymentInfo!.job_ID
          this.deploymentsService.deleteDeploymentByUUID(uuid).subscribe({
            next: (response: any) => {
              if (response && response['status'] == 'success') {
                this.router.navigate(['/deployments']).then((navigated: boolean) => {
                  if (navigated) {
                    this._snackBar.open("Successfully deleted deployment with uuid: " + uuid, "X", {
                      duration: 3000,
                      panelClass: ['primary-snackbar']
                    })
                  }
                });
              } else {
                this._snackBar.open("Error deleting deployment with uuid: " + uuid, "X", {
                  duration: 3000,
                  panelClass: ['red-snackbar']
                })
              }
            },
            error: () => {
              this._snackBar.open("Error deleting deployment with uuid: " + uuid, "X", {
                duration: 3000,
                panelClass: ['red-snackbar']
              })
            }
          })
        }
      });
  }
  accessDeployment() {

  }

}
