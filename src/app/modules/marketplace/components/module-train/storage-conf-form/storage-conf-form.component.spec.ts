import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageConfFormComponent } from './storage-conf-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';

describe('StorageConfFormComponent', () => {
    let component: StorageConfFormComponent;
    let fixture: ComponentFixture<StorageConfFormComponent>;

    beforeEach(async () => {
        const fb = new FormBuilder();
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = fb.group({
            test: fb.control(null),
        });

        await TestBed.configureTestingModule({
            declarations: [StorageConfFormComponent],
            imports: [
                SharedModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
            ],
            providers: [
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StorageConfFormComponent);
        component = fixture.componentInstance;
        component.showHelp = true;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
