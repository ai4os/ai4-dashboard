import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeploymentInfo } from '@app/shared/interfaces/deployment.interface';
import { DeploymentsService } from '../../services/deployments.service';

@Component({
  selector: 'app-deployment-detail',
  templateUrl: './deployment-detail.component.html',
  styleUrls: ['./deployment-detail.component.scss']
})
export class DeploymentDetailComponent implements OnInit{

  constructor(
    private deploymentsService: DeploymentsService,
    private route: ActivatedRoute,
  ){}

  deploymentInfo: DeploymentInfo | undefined;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log("estos parametros", params['uuid'])
      this.deploymentsService.getDeploymentByUUID(params['uuid']).subscribe( (deployment: DeploymentInfo) => {
        if(deployment.description == ''){
          deployment.description = '-'
        }
        this.deploymentInfo = deployment
        console.log("Lo que viene del service", deployment)
      })
    });
  }

  tabLoadTimes: Date[] = [];


  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }



}
