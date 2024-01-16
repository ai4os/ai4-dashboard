import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { UserStats } from '@app/shared/interfaces/stats.interface';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class StatsService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);

    getUserStats(): Observable<UserStats> {
        const url = `${base}${endpoints.userStats}`;
        return this.http.get<UserStats>(url, {
            params: this.voParam,
        });
    }

    // getStats(): Observable<any> {
    //     const url = `${base}${endpoints.stats}`;
    //     const mockedResponse = {
    //         'full-agg': {
    //             cpu_num: 4877,
    //             cpu_MHz: 1930752,
    //             memory_MB: 11712167,
    //             disk_MB: 13260059,
    //             gpu_num: 595,
    //         },
    //         timeseries: {
    //             date: [
    //                 '2023-09-01',
    //                 '2023-09-02',
    //                 '2023-09-03',
    //                 '2023-09-04',
    //                 '2023-09-05',
    //                 '2023-09-06',
    //                 '2023-09-07',
    //                 '2023-09-08',
    //                 '2023-09-09',
    //                 '2023-09-11',
    //                 '2023-09-12',
    //                 '2023-09-13',
    //                 '2023-09-14',
    //                 '2023-09-15',
    //                 '2023-09-16',
    //                 '2023-09-17',
    //                 '2023-09-18',
    //                 '2023-09-19',
    //                 '2023-09-20',
    //                 '2023-09-21',
    //                 '2023-09-22',
    //                 '2023-09-23',
    //                 '2023-09-24',
    //                 '2023-09-25',
    //                 '2023-09-26',
    //                 '2023-09-27',
    //                 '2023-09-28',
    //                 '2023-09-29',
    //                 '2023-09-30',
    //                 '2023-10-01',
    //                 '2023-10-02',
    //             ],
    //             cpu_num: [
    //                 144, 144, 144, 144, 145, 146, 125, 148, 152, 153, 154, 154,
    //                 155, 155, 159, 163, 163, 161, 159, 161, 161, 161, 161, 164,
    //                 165, 165, 167, 172, 174, 174, 173,
    //             ],
    //             cpu_MHz: [
    //                 144, 144, 144, 144, 5341, 10538, 10517, 26108, 34904, 40766,
    //                 43698, 46296, 50627, 51493, 61089, 70685, 73477, 76028,
    //                 78257, 82655, 82655, 82655, 82655, 91585, 94651, 94651,
    //                 105045, 124102, 129946, 129946, 127014,
    //             ],
    //             memory_MB: [
    //                 351000, 351000, 351000, 351000, 351000, 351000, 307000,
    //                 326000, 334000, 367667, 376000, 376000, 377333, 378000,
    //                 386000, 394000, 394167, 399333, 395000, 399000, 399000,
    //                 399000, 399000, 401667, 399000, 390500, 384500, 393667,
    //                 403000, 403000, 400333,
    //             ],
    //             disk_MB: [
    //                 455400, 455400, 455400, 455400, 455500, 455600, 375600,
    //                 441350, 441600, 436933, 437100, 437200, 437967, 433300,
    //                 428800, 429300, 431133, 432883, 421550, 421800, 421800,
    //                 421800, 421800, 421967, 421800, 421800, 407300, 393217,
    //                 393800, 393800, 393633,
    //             ],
    //             gpu_num: [
    //                 17, 17, 17, 17, 17, 17, 16, 16, 17, 20, 20, 20, 20, 20, 20,
    //                 21, 21, 20, 20, 21, 21, 21, 21, 21, 20, 20, 20, 19, 19, 19,
    //                 19,
    //             ],
    //             queued: [
    //                 20, 20, 20, 20, 20, 16, 9, 7, 7, 5, 5, 5, 5, 4, 4, 4, 4, 4,
    //                 4, 3, 3, 3, 3, 4, 5, 4, 2, 3, 2, 2, 2,
    //             ],
    //             running: [
    //                 42, 42, 42, 42, 42, 42, 37, 42, 42, 43, 43, 43, 44, 44, 45,
    //                 46, 46, 46, 46, 47, 47, 47, 47, 47, 47, 47, 48, 49, 50, 50,
    //                 50,
    //             ],
    //         },
    //         'users-agg': {
    //             owner: '43f4e666c4a4625375b3acb679a86ac238ca97dcee169a56b79bc10ff31299ed@egi.eu',
    //             cpu_num: 366,
    //             cpu_MHz: 236030,
    //             memory_MB: 874667,
    //             disk_MB: 95617,
    //             gpu_num: 31,
    //         },
    //     };

    //     return of(mockedResponse);

    //     /* return this.http.get<any>(url, {
    //         params: this.voParam,
    //     }); */
    // }
}
