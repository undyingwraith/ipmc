import React, {createContext, PropsWithChildren, useContext, useEffect, useMemo, useState} from "react";
import {createHelia, Helia} from "helia";
import {Backdrop, Box, CircularProgress, Typography} from "@mui/material";
import {createLibp2p, Libp2p} from 'libp2p'
import {IDBDatastore} from "datastore-idb";
import {IDBBlockstore} from "blockstore-idb";
import {IAppConfiguration} from "ipm-core";
import {StartConfiguration} from "./components/StartConfiguration";
import {webSockets} from '@libp2p/websockets'
import {noise} from '@chainsafe/libp2p-noise'
import Protector from "libp2p-pnet";
import {CID} from 'multiformats'
import {LibraryBrowser} from "./LibraryBrowser";
import { webTransport } from '@libp2p/webtransport'
import {useTranslation} from "react-i18next";
import { bootstrap } from '@libp2p/bootstrap'

export interface IAppContext {
    node: Helia<Libp2p<any>>
    library: LibraryBrowser
}

const AppContext = createContext<IAppContext>({} as IAppContext);

export function AppContextProvider(props: PropsWithChildren<{}>) {
    const [_t] = useTranslation()
    const [node, setNode] = useState<Helia<Libp2p<any>>>()
    const [mediaRoot, setMediaRoot] = useState<CID>(CID.parse('QmfZvnfEwzWXrYNTfsKogZkuCVjhu8bnBa3jTLG6BeuCeU'))
    const [config, setConfig] = useState<IAppConfiguration>()
    const library = useMemo(() => node && mediaRoot ? new LibraryBrowser(node, mediaRoot) : undefined, [node, mediaRoot])

    useEffect(() => {
        const data = window.localStorage.getItem('ipm-config')
        if (data) {
            setConfig(JSON.parse(data))
        }
        const params = new URLSearchParams(window.location.search);
        if (params.has('init')) {
            console.debug(atob(params.get('init')!));
            const test = JSON.parse(atob(params.get('init')!))
            test.bootstrap.push('/ip4/185.66.109.132/udp/4002/quic/12D3KooWT32d14NuEWbGLrAhZFyqQHFzmeDDtLiw7FsTDFJU8Xhz')
            test.bootstrap.push('/ip4/185.66.109.132/tcp/4002/ws/12D3KooWT32d14NuEWbGLrAhZFyqQHFzmeDDtLiw7FsTDFJU8Xhz')
            setConfig(test); //JSON.parse(atob(params.get('init')!)))
        }
    }, []);

    useEffect(() => {
        if (config) {
            console.info('Starting with config', config)
            createLibp2p({
                connectionProtector: () => new Protector(Buffer.from(new TextEncoder().encode(config.swarmKey))),
                transports: [
                    webSockets(),
                    webTransport(),
                ],
                connectionEncryption: [noise()],
                peerDiscovery: [
                    bootstrap({
                        list: config.bootstrap,
                        timeout: 1000, // in ms,
                        tagName: 'bootstrap',
                        tagValue: 50,
                        tagTTL: 120000 // in ms
                    })
                ]
            }).then(async (r) => {
                const datastore = new IDBDatastore('data');
                await datastore.open();
                const blockstore = new IDBBlockstore('blocks');
                await blockstore.open();
                return createHelia({
                    start: true,
                    datastore,
                    blockstore,
                    libp2p: r,
                })

            })
                .then(setNode)
                .catch(e => {
                    console.error(e)
                })
        }
    }, [config]);

    useEffect(() => {
        if (node) {
            const i = setInterval(() => {
                //TODO: load media root
                // node.libp2p
            }, 15000);

            return () => {
                clearTimeout(i);
            }
        }
        return () => {
        }
    }, [node]);

    if (!config) {
        return <StartConfiguration/>
    }

    if (!node) {
        return <Backdrop open={true}>
            <Box>
                <Typography>{_t('Starting')}</Typography>
                <CircularProgress/>
            </Box>
        </Backdrop>
    }

    return <AppContext.Provider value={{
        node: node,
        library: library!,
    }}>
        {props.children}
    </AppContext.Provider>
}

export function useApp() {
    return useContext(AppContext)
}