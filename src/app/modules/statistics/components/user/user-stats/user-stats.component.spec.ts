import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { StatsStore } from '@app/modules/statistics/store/stats.store';
import { UserStatsComponent } from './user-stats.component';
import { testProviders } from '@testing/test-providers';

describe('UserStatsComponent', () => {
    let component: UserStatsComponent;
    let fixture: ComponentFixture<UserStatsComponent>;
    let authenticated: jest.Mock;
    let connectUser: jest.Mock;
    let navigate: jest.SpyInstance;

    beforeEach(async () => {
        authenticated = jest.fn().mockReturnValue(true);
        connectUser = jest.fn().mockReturnValue(() => undefined);

        await TestBed.configureTestingModule({
            imports: [UserStatsComponent],
            providers: [
                ...testProviders,
                {
                    provide: AuthService,
                    useValue: { isAuthenticated: authenticated },
                },
                {
                    provide: StatsStore,
                    useValue: {
                        user: signal({ loading: false, data: null }),
                        connectUser,
                    },
                },
            ],
        }).compileComponents();

        const router = TestBed.inject(Router);
        navigate = jest.spyOn(router, 'navigate').mockResolvedValue(true);
        fixture = TestBed.createComponent(UserStatsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('connects to user statistics when the session is authenticated', () => {
        expect(component).toBeTruthy();
        expect(connectUser).toHaveBeenCalledTimes(1);
        expect(navigate).not.toHaveBeenCalled();
    });

    it('redirects unauthenticated users to platform statistics', () => {
        authenticated.mockReturnValue(false);
        fixture.destroy();
        connectUser.mockClear();
        fixture = TestBed.createComponent(UserStatsComponent);
        fixture.detectChanges();

        expect(navigate).toHaveBeenCalledWith(['/statistics/platform'], {
            replaceUrl: true,
        });
        expect(connectUser).not.toHaveBeenCalled();
    });
});
