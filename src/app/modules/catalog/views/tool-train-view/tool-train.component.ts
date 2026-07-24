import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FederatedServerComponent } from '../../components/train/tool-train/federated-server/federated-server.component';
import { CvatComponent } from '../../components/train/tool-train/cvat/cvat.component';
import { Ai4lifeLoaderComponent } from '../../components/train/tool-train/ai4life-loader/ai4life-loader.component';
import { LlmComponent } from '../../components/train/tool-train/llm/llm.component';
import { NvflareComponent } from '../../components/train/tool-train/nvflare/nvflare.component';
import { NomadTrainComponent } from '../../components/train/nomad-train/nomad-train.component';

@Component({
    selector: 'app-tool-train',
    templateUrl: './tool-train.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FederatedServerComponent,
        CvatComponent,
        Ai4lifeLoaderComponent,
        LlmComponent,
        NvflareComponent,
        NomadTrainComponent,
    ],
})
export class ToolTrainComponent implements OnInit {
    route = inject(ActivatedRoute);

    protected toolID = '';

    ngOnInit(): void {
        this.toolID = this.route.snapshot.parent?.params['id'];
    }
}
