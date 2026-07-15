import { Pipe, PipeTransform } from '@angular/core';
import {
    Ai4lifeModule,
    ModuleSummary,
    VllmModelConfig,
} from '@app/shared/interfaces/module.interface';

@Pipe({
    name: 'searchAi4eoscModule',
    standalone: false,
})
export class SearchAi4eoscPipe implements PipeTransform {
    public transform(value: ModuleSummary[], searchValue: string) {
        if (!searchValue) return value;

        return value.filter(
            (v: ModuleSummary) =>
                v.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
                v.summary.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        );
    }
}

@Pipe({
    name: 'searchAi4lifeModule',
    standalone: false,
})
export class SearchAi4lifePipe implements PipeTransform {
    public transform(value: Ai4lifeModule[], searchValue: string) {
        if (!searchValue) return value;

        return value.filter(
            (v: Ai4lifeModule) =>
                v.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
                v.description.toLowerCase().indexOf(searchValue.toLowerCase()) >
                    -1
        );
    }
}

@Pipe({
    name: 'searchLlms',
    standalone: false,
})
export class SearchLlmsPipe implements PipeTransform {
    public transform(value: VllmModelConfig[], searchValue: string) {
        if (!searchValue) return value;

        return value.filter(
            (v: VllmModelConfig) =>
                v.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
                v.description.toLowerCase().indexOf(searchValue.toLowerCase()) >
                    -1
        );
    }
}
