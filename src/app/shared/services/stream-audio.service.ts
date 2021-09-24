import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

/**
 * Request stream audio on API
 *
 * @export
 * @class StreamAudioService
 */
@Injectable({
    providedIn: 'root'
})
export class StreamAudioService {

    // private url = '/radio/8020/stats?sid=1&json=1'; // RaizUai api rest
    private url = 'https://radion.jmhost.com.br/api/live/nowplaying/raizeuai';

    /**
     * Creates an instance of StreamAudioService.
     *
     * @param {HttpClient} httpClient
     * @memberof StreamAudioService
     */
    public constructor(private httpClient: HttpClient) { }

    /**
     * Retrieves playing information
     *
     * @returns {Observable<any[]>}
     * @memberof SimCardService
     */
    public getNowPlaying(): Observable<any> {
        return this.httpClient.get<any>(this.url)
            .pipe(
                retry(2),
                catchError(this.handleError));
    }

    // Manipulação de erros
    handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Erro ocorreu no lado do client
            errorMessage = error.error.message;
        } else {
            // Erro ocorreu no lado do servidor
            errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
        };
        return throwError(errorMessage);
    }
}
