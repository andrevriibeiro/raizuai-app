import { Injectable } from '@angular/core';

/**
 * Home Service
 *
 * @export
 * @class HomeService
 */
@Injectable({
    providedIn: 'root'
})
export class HomeService {

    /**
     * This method is responsible to build a new notification to be displayed on application
     *
     * @param {string} actionName: action button name
     * @param {string} actionId: action id to be identified by application
     * @param {string} actionIconName action icon name to be find
     * @returns
     * @memberof HomeService
     */
    public buildNotificationWithCustomActionButton(actionName: string, actionId: string, actionIconName: string) {
        return {
            id: 1,
            title: 'RaizUai - Web Rádio Caipira Bruto',
            icon: 'res://ic_raiz_logo.png',
            vibrate: false,
            actions: [
                {
                    id: actionId,
                    title: actionName,
                    icon: actionIconName,
                    launch: false
                },
                {
                    id: 'close',
                    title: 'Fechar',
                    icon: 'res://ic_action_remove.png',
                    launch: false
                }
            ]
        };
    }

    /**
     * Method responsible to convert a timer in number format to string format
     *
     * @param {*} timer to be convert in string format
     * @returns {string}
     * @memberof HomeService
     */
    public convertNumberTimerFormat(timer: number): string {
        const hour = ('0' + Math.round(timer / 3600));
        const calcMinutes = (timer / 60);
        const minute = calcMinutes < 10 ? ('0' + calcMinutes).slice(0, 2) : Math.round(calcMinutes);
        const calcSeconds = (timer % 60);
        const seconds = calcSeconds < 10 ? ('0' + calcSeconds).slice(0, 2) : Math.round(calcSeconds);

        return hour + ':' + minute + ':' + seconds;
    }

    /**
     * Method responsible to convert a timer in string format to number format
     *
     * @param {string} timer to be convert in number format
     * @returns {number}
     * @memberof HomeService
     */
    public convertStringTimerFormat(timer: string): number {
        const timerArray = timer.split(':');
        return parseInt(timerArray[0], 10) * 3600 + parseInt(timerArray[1], 10) * 60 + parseInt(timerArray[2], 10);
    }
}
