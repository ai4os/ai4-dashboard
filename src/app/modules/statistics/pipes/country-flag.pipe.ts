import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'countryFlag', standalone: true })
export class CountryFlagPipe implements PipeTransform {
    transform(countryCode: string | undefined): string {
        if (!countryCode || countryCode.length !== 2) return '';
        return countryCode
            .toUpperCase()
            .split('')
            .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
            .join('');
    }
}
