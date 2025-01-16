import { Pipe, PipeTransform } from '@angular/core';
import {
    Ai4lifeModuleSummary,
    ModuleSummary,
} from '@app/shared/interfaces/module.interface';

@Pipe({
    name: 'searchAi4eoscModule',
})
export class SearchAi4eoscPipe implements PipeTransform {
    public transform(value: Array<ModuleSummary>, searchValue: string) {
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
})
export class SearchAi4lifePipe implements PipeTransform {
    public transform(value: Array<Ai4lifeModuleSummary>, searchValue: string) {
        if (!searchValue) return value;

        return value.filter(
            (v: Ai4lifeModuleSummary) =>
                v.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
                v.description.toLowerCase().indexOf(searchValue.toLowerCase()) >
                    -1
        );
    }
}
