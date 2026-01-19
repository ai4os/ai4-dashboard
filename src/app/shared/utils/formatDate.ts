export function formatDate(input: string, showHour: boolean = true): string {
    const date = typeof input === 'string' ? new Date(input) : input;

    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(date);

    const year = parts.find((p) => p.type === 'year')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;
    const hour = parts.find((p) => p.type === 'hour')?.value;
    const minute = parts.find((p) => p.type === 'minute')?.value;
    const second = parts.find((p) => p.type === 'second')?.value;

    if (!showHour) {
        return `${day}-${month}-${year}`;
    }

    return `${hour}:${minute}:${second} ${day}-${month}-${year} `;
}
