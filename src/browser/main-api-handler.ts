import { BrowserWindow, ipcMain } from 'electron';

import { apiCmds, apiName, IApiArgs } from '../common/api-interface';
import { logger } from '../common/logger';
import { windowHandler } from './window-handler';
import { setDataUrl, showBadgeCount } from './window-utils';

const checkValidWindow = true;

/**
 * Ensure events comes from a window that we have created.
 * @param  {EventEmitter} event  node emitter event to be tested
 * @return {Boolean} returns true if exists otherwise false
 */
function isValidWindow(event: Electron.Event): boolean {
    if (!checkValidWindow) {
        return true;
    }
    let result = false;
    if (event && event.sender) {
        // validate that event sender is from window we created
        const browserWin = BrowserWindow.fromWebContents(event.sender);
        // @ts-ignore
        const winKey = event.sender.browserWindowOptions && event.sender.browserWindowOptions.winKey;

        result = windowHandler.hasWindow(winKey, browserWin);
    }

    if (!result) {
       logger.warn('invalid window try to perform action, ignoring action', event.sender);
    }

    return result;
}

/**
 * Handle API related ipc messages from renderers. Only messages from windows
 * we have created are allowed.
 */
ipcMain.on(apiName.symphonyApi, (event: Electron.Event, arg: IApiArgs) => {
    if (!isValidWindow(event)) {
        return;
    }

    if (!arg) {
        return;
    }

    switch (arg.cmd) {
        /*case ApiCmds.isOnline:
            if (typeof arg.isOnline === 'boolean') {
                windowMgr.setIsOnline(arg.isOnline);
            }
            break;*/
        case apiCmds.setBadgeCount:
            if (typeof arg.count === 'number') {
                console.log(arg.count);
                showBadgeCount(arg.count);
            }
            break;
        /*case ApiCmds.registerProtocolHandler:
            protocolHandler.setProtocolWindow(event.sender);
            protocolHandler.checkProtocolAction();
            break;*/
        case apiCmds.badgeDataUrl:
            if (typeof arg.dataUrl === 'string' && typeof arg.count === 'number') {
                setDataUrl(arg.dataUrl, arg.count);
            }
            break;
        /*case ApiCmds.activate:
            if (typeof arg.windowName === 'string') {
                windowMgr.activate(arg.windowName);
            }
            break;
        case ApiCmds.registerBoundsChange:
            windowMgr.setBoundsChangeWindow(event.sender);
            break;*/
        case apiCmds.registerLogger:
            // renderer window that has a registered logger from JS.
            logger.setLoggerWindow(event.sender);
            break;
        /*case ApiCmds.registerActivityDetection:
            if (typeof arg.period === 'number') {
                // renderer window that has a registered activity detection from JS.
                activityDetection.setActivityWindow(arg.period, event.sender);
            }
            break;
        case ApiCmds.showNotificationSettings:
            if (typeof arg.windowName === 'string') {
                configureNotification.openConfigurationWindow(arg.windowName);
            }
            break;
        case ApiCmds.sanitize:
            if (typeof arg.windowName === 'string') {
                sanitize(arg.windowName);
            }
            break;
        case ApiCmds.bringToFront:
            // validates the user bring to front config and activates the wrapper
            if (typeof arg.reason === 'string' && arg.reason === 'notification') {
                bringToFront(arg.windowName, arg.reason);
            }
            break;
        case ApiCmds.openScreenPickerWindow:
            if (Array.isArray(arg.sources) && typeof arg.id === 'number') {
                openScreenPickerWindow(event.sender, arg.sources, arg.id);
            }
            break;
        case ApiCmds.popupMenu: {
            let browserWin = electron.BrowserWindow.fromWebContents(event.sender);
            if (browserWin && !browserWin.isDestroyed()) {
                windowMgr.getMenu().popup(browserWin, {x: 20, y: 15, async: true});
            }
            break;
        }
        case ApiCmds.optimizeMemoryConsumption:
            if (typeof arg.memory === 'object'
                && typeof arg.cpuUsage === 'object'
                && typeof arg.memory.workingSetSize === 'number') {
                setPreloadMemoryInfo(arg.memory, arg.cpuUsage);
            }
            break;
        case ApiCmds.optimizeMemoryRegister:
            setPreloadWindow(event.sender);
            break;
        case ApiCmds.setIsInMeeting:
            if (typeof arg.isInMeeting === 'boolean') {
                setIsInMeeting(arg.isInMeeting);
            }
            break;
        case ApiCmds.setLocale:
            if (typeof arg.locale === 'string') {
                let browserWin = electron.BrowserWindow.fromWebContents(event.sender);
                windowMgr.setLocale(browserWin, { language: arg.locale });
            }
            break;
        case ApiCmds.keyPress:
            if (typeof arg.keyCode === 'number') {
                windowMgr.handleKeyPress(arg.keyCode);
            }
            break;*/
        default:
    }

});