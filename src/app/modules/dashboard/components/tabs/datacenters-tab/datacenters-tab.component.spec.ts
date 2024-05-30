import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatacentersTabComponent } from './datacenters-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';
import { By } from '@angular/platform-browser';

describe('DatacentersTabComponent', () => {
    let component: DatacentersTabComponent;
    let fixture: ComponentFixture<DatacentersTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatacentersTabComponent],
            imports: [
                TranslateModule.forRoot(),
                SharedModule,
                BrowserAnimationsModule,
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(DatacentersTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('shows map', () => {
        const map = fixture.debugElement.query(By.css('#map'));
        expect(map).toBeTruthy();
    });
});
