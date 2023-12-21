import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from './core/services/app-config/app-config.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'ai4-dashboard';

    constructor(
        private titleService: Title,
        private appConfigService: AppConfigService
    ) {}

    addPlausibleScript() {
        const node = document.createElement('script'); // creates the script tag
        node.src = this.appConfigService.analytics['src']; // sets the source (insert url in between quotes)
        node.type = 'text/javascript'; // set the script type
        node.defer = true;
        node.setAttribute(
            'data-domain',
            this.appConfigService.analytics['domain']
        );
        document.getElementsByTagName('head')[0].appendChild(node);
        console.log('Acabo', node);
    }

    ngOnInit(): void {
        this.titleService.setTitle(this.appConfigService.title);
        this.addPlausibleScript();
    }
}
