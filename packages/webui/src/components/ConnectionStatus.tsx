import React, {useEffect, useState} from "react";
import {useApp} from "../AppContext";

export function ConnectionStatus() {
    const {node} = useApp()
    const [peers, setPeers] = useState<any[]>([])

    useEffect(() => {
        const i = setInterval(() => setPeers(node.libp2p.getPeers()), 5000);

        return () => {
            clearInterval(i)
        }
    }, []);

    return <div>{peers.length}</div>
}