import { Pipe, PipeTransform } from '@angular/core';
import { ModuleSummary } from '@app/shared/interfaces/module.interface';

@Pipe({
    name: 'search',
})
export class SearchPipe implements PipeTransform {
    public transform(value: Array<ModuleSummary>, searchValue: string) {
        if (!searchValue) return value;

        return value.filter(
            (v: ModuleSummary) =>
                v.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
                v.summary.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        );
    }
}
