import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareConfFormComponent } from './hardware-conf-form.component';
import { FormGroupDirective, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { defaultFormValues } from './hardware-conf-form.component.mock';

describe('HardwareConfFormComponent', () => {
    let component: HardwareConfFormComponent;
    let fixture: ComponentFixture<HardwareConfFormComponent>;

    beforeEach(async () => {
        const fb = new FormBuilder();
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = fb.group({
            test: fb.control(null),
        });

        await TestBed.configureTestingModule({
            declarations: [HardwareConfFormComponent],
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

        fixture = TestBed.createComponent(HardwareConfFormComponent);
        component = fixture.componentInstance;
        component.defaultFormValues = defaultFormValues;
        component.showHelp = true;
        component.showFields = {
            cpu_num: true,
            ram: true,
            disk: true,
            gpu_num: true,
            gpu_type: true,
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('check valid config', () => {
        let cpuNumberInput =
            component.hardwareConfFormGroup.controls['cpuNumberInput'];
        cpuNumberInput.setValue('1');
        let ramMemoryInput =
            component.hardwareConfFormGroup.controls['ramMemoryInput'];
        ramMemoryInput.setValue('1');
        let diskMemoryInput =
            component.hardwareConfFormGroup.controls['diskMemoryInput'];
        diskMemoryInput.setValue('1');

        // check required restrictions (no gpu)
        expect(component.hardwareConfFormGroup.valid).toBeTruthy();

        // check required restrictions (gpu)
        let gpuNumberInput =
            component.hardwareConfFormGroup.controls['gpuNumberInput'];
        gpuNumberInput.setValue(1);

        let gpuModelSelect =
            component.hardwareConfFormGroup.controls['gpuModelSelect'];
        gpuModelSelect.setValue('Test');

        expect(
            component.hardwareConfFormGroup.controls.gpuNumberInput
        ).toBeTruthy();
        expect(
            component.hardwareConfFormGroup.controls.gpuModelSelect
        ).toBeTruthy();
        expect(component.hardwareConfFormGroup.valid).toBeTruthy();
    });

    it('check invalid config', () => {
        let cpuNumberInput =
            component.hardwareConfFormGroup.controls['cpuNumberInput'];
        cpuNumberInput.setValue('5');

        let ramMemoryInput =
            component.hardwareConfFormGroup.controls['ramMemoryInput'];
        ramMemoryInput.setValue('5');

        let diskMemoryInput =
            component.hardwareConfFormGroup.controls['diskMemoryInput'];
        diskMemoryInput.setValue('5');

        // check required restrictions (no gpu)
        expect(component.hardwareConfFormGroup.valid).toBeFalsy();

        // check required restrictions (gpu)
        let gpuNumberInput =
            component.hardwareConfFormGroup.controls['gpuNumberInput'];
        gpuNumberInput.setValue(5);

        expect(component.hardwareConfFormGroup.valid).toBeFalsy();
    });
});
