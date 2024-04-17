import * as React from 'react';
import {createRoot} from 'react-dom/client';
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import languageDetector from 'i18next-browser-languagedetector';

import en from 'ipm-core/translations/en.json'
import de from 'ipm-core/translations/de.json'
import {IAppConfiguration, IConfigurationService, IpmApp} from "ipm-core";
import {IDBDatastore} from "datastore-idb";
import {IDBBlockstore} from "blockstore-idb";


i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(languageDetector)
    .init({
        resources: {
            en: {
                translation: en
            },
            de: {
                translation: de
            }
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        }
    });

const root = createRoot(document.getElementById('root')!)

class LocalStorageConfigService implements IConfigurationService {
    getNodeConfig(): IAppConfiguration {
        const data = window.localStorage.getItem('ipm-config')
        if (data) {
            return JSON.parse(data)
        }
        const params = new URLSearchParams(window.location.search);
        if (params.has('init')) {
            console.debug(atob(params.get('init')!));
            const test = JSON.parse(atob(params.get('init')!))
            test.bootstrap.push('/ip4/185.66.109.132/udp/4002/quic/12D3KooWT32d14NuEWbGLrAhZFyqQHFzmeDDtLiw7FsTDFJU8Xhz')
            test.bootstrap.push('/ip4/185.66.109.132/tcp/4002/ws/12D3KooWT32d14NuEWbGLrAhZFyqQHFzmeDDtLiw7FsTDFJU8Xhz')
            // setConfig(test); //JSON.parse(atob(params.get('init')!)))
            return test;
        }
        return {
            swarmKey: '',
            bootstrap: []
        };
    }

    setNodeConfig(config: IAppConfiguration): void {
        window.localStorage.setItem('ipm-config', JSON.stringify(config))
    }
}

// root.render(<App/>);
root.render(<IpmApp init={async () => {
    const datastore = new IDBDatastore('data');
    await datastore.open();
    const blockstore = new IDBBlockstore('blocks');
    await blockstore.open();

    return {
        datastore,
        blockstore,
        configService: new LocalStorageConfigService()
    };
}}/>);
