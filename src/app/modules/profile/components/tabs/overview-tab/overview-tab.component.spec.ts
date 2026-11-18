import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { UiChipComponent } from '@app/shared/components/ui/ui-chip/ui-chip.component';
import { UiListCardComponent } from '@app/shared/components/ui/ui-list-card/ui-list-card.component';
import { testProviders } from '@testing/test-providers';
import { OverviewTabComponent } from './overview-tab.component';

describe('OverviewTabComponent', () => {
    let fixture: ComponentFixture<OverviewTabComponent>;
    let component: OverviewTabComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OverviewTabComponent],
            providers: [
                ...testProviders,
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(OverviewTabComponent);
        component = fixture.componentInstance;
        component.vos = [
            {
                name: 'vo.fluid.ai4eosc.eu',
                roles: ['ap-u'],
                sharedHighestRole: 'ap-u',
            },
            {
                name: 'vo.arena.ai4eosc.eu',
                roles: ['ap-a'],
                sharedHighestRole: 'ap-u',
            },
            {
                name: 'vo.ai4eosc.eu',
                roles: ['ap-a'],
                sharedHighestRole: 'ap-u',
            },
            { name: 'vo.ai4life.eu', roles: ['ap-d'] },
        ];
        fixture.detectChanges();
    });

    it('shows grouped VOs separately and highlights the shared role only where it exists', () => {
        const cards = fixture.debugElement
            .queryAll(By.directive(UiListCardComponent))
            .map((debugElement) => debugElement.componentInstance);
        const chips = fixture.debugElement
            .queryAll(By.directive(UiChipComponent))
            .map((debugElement) => debugElement.componentInstance);

        expect(cards.map((card) => card.title)).toEqual([
            'vo.fluid.ai4eosc.eu',
            'vo.arena.ai4eosc.eu',
            'vo.ai4eosc.eu',
            'vo.ai4life.eu',
        ]);
        expect(cards.map((card) => card.theme)).toEqual([
            'primary',
            'primary',
            'primary',
            'default',
        ]);
        expect(cards.map((card) => card.tooltip)).toEqual([
            'PROFILE.OVERVIEW-TAB.VO-TOOLTIP',
            'PROFILE.OVERVIEW-TAB.VO-TOOLTIP',
            'PROFILE.OVERVIEW-TAB.VO-TOOLTIP',
            undefined,
        ]);
        expect(chips.map(({ text, variant }) => [text, variant])).toEqual([
            ['ap-u', 'accent-solid'],
            ['ap-a', 'default-solid'],
            ['ap-a', 'default-solid'],
            ['ap-d', 'default-solid'],
        ]);
    });
});
