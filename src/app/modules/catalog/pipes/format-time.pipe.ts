import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const DAYS_PER_MONTH = 30.4375; // 365.25 / 12

const formatters = new Map<string, Intl.RelativeTimeFormat>();

function getFormatter(lang: string): Intl.RelativeTimeFormat {
    let formatter = formatters.get(lang);
    if (!formatter) {
        try {
            formatter = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
        } catch {
            formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        }
        formatters.set(lang, formatter);
    }
    return formatter;
}

function toRelative(diff: number): [number, Intl.RelativeTimeFormatUnit] {
    const abs = Math.abs(diff);
    const sign = Math.sign(diff);
    const days = abs / DAY;

    if (abs < MINUTE) return [0, 'second'];
    if (abs < HOUR) return [sign * Math.floor(abs / MINUTE), 'minute'];
    if (abs < DAY) return [sign * Math.floor(abs / HOUR), 'hour'];
    if (days < 7) return [sign * Math.floor(days), 'day'];
    if (days < DAYS_PER_MONTH) return [sign * Math.floor(days / 7), 'week'];

    const months = Math.floor(days / DAYS_PER_MONTH);
    if (months < 12) return [sign * months, 'month'];
    return [sign * Math.floor(months / 12), 'year'];
}

/**
 * Formats a date as a localized relative time ("4 months ago", "yesterday").
 *
 * Usage: {{ module.dates.updated | relativeTime }}
 */
@Pipe({
    name: 'relativeTime',
    standalone: true,
    pure: false,
})
export class RelativeTimePipe implements PipeTransform {
    private readonly translate = inject(TranslateService);

    transform(value: string | number | Date | null | undefined): string {
        if (value === null || value === undefined || value === '') {
            return '';
        }

        const time = new Date(value).getTime();
        if (Number.isNaN(time)) {
            return '';
        }

        const lang =
            this.translate.currentLang() ||
            this.translate.fallbackLang() ||
            'en';
        const [amount, unit] = toRelative(time - Date.now());
        return getFormatter(lang).format(amount, unit);
    }
}
