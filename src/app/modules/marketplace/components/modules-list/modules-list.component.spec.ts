import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesListComponent } from './modules-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { SharedModule } from '@app/shared/shared.module';
import { SearchPipe } from '../../pipes/search-card-pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '@app/core/services/auth/auth.service';

const mockedConfigService: any = {};
const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
};

describe('ModulesListComponent', () => {
    let component: ModulesListComponent;
    let fixture: ComponentFixture<ModulesListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModulesListComponent, SearchPipe],
            imports: [
                HttpClientTestingModule,
                SharedModule,
                NoopAnimationsModule,
            ],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: AuthService, useValue: mockedAuthService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ModulesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
