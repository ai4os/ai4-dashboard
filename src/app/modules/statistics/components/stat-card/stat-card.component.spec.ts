import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatCardComponent } from './stat-card.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';

describe('StatCardComponent', () => {
    let component: StatCardComponent;
    let fixture: ComponentFixture<StatCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StatCardComponent],
            imports: [TranslateModule.forRoot(), SharedModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(StatCardComponent);
        component = fixture.componentInstance;
        component.title = 'CPUs';
        component.usedValue = 10;
        component.totalValue = 20;
        component.iconName = 'memory';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show resource (NOT GPU)', () => {
        const titleElement = fixture.debugElement.query(By.css('.title-text'));
        const titleValue = titleElement.nativeElement.textContent;
        expect(titleValue).toEqual('CPUs');

        const iconElement = fixture.debugElement.query(By.css('.icon'));
        const iconValue = iconElement.nativeElement.textContent;
        expect(iconValue).toEqual('memory');

        const canvas = fixture.debugElement.query(By.css('#canvas'));
        expect(canvas).toBeTruthy();

        const button = fixture.debugElement.query(By.css('#detail-button'));
        expect(button).toBeFalsy();
    });

    it('should show resource (GPU)', () => {
        component.title = 'GPUs';
        component.usedValue = 5;
        component.totalValue = 40;
        component.iconName = 'developer_board';
        component.gpuPerModelCluster = [];
        fixture.detectChanges();

        const titleElement = fixture.debugElement.query(By.css('.title-text'));
        const titleValue = titleElement.nativeElement.textContent;
        expect(titleValue).toEqual('GPUs');

        const iconElement = fixture.debugElement.query(By.css('.icon'));
        const iconValue = iconElement.nativeElement.textContent;
        expect(iconValue).toEqual('developer_board');

        const canvas = fixture.debugElement.query(By.css('#canvas'));
        expect(canvas).toBeTruthy();

        const button = fixture.debugElement.query(By.css('#detail-button'));
        expect(button).toBeTruthy();
    });
});
