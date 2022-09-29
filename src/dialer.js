import { Multiaddr } from '@multiformats/multiaddr'
import { createLibp2p } from './libp2p.js'
import { stdinToStream, streamToConsole } from './stream.js'
import { createFromJSON } from '@libp2p/peer-id-factory'
import peerIdDialerJson from './peer-id-dialer.js'
import peerIdListenerJson from './peer-id-listener.js'
import peerids from './bootPeerid.js'
import { MulticastDNS } from '@libp2p/mdns'
import { TCP } from '@libp2p/tcp'
import { Mplex } from '@libp2p/mplex'
import { Noise } from '@chainsafe/libp2p-noise'
import { KadDHT } from '@libp2p/kad-dht'
import { writeFileSync, writeFile } from 'node:fs'
import { Buffer } from 'node:buffer'
import { readFile, readFileSync } from 'fs'
import { Bootstrap } from '@libp2p/bootstrap'
import bootPeerid from './bootPeerid.js'
import { generatePeeridByreadKey } from './utils/readLocalKeysPair.js'
import { multiaddr } from 'multiaddr'
import { WebSockets } from '@libp2p/websockets'

async function run () {
    const [idDialer,idListener] = await Promise.all([
        createFromJSON(peerIdDialerJson),
        // createFromJSON(peerIdListenerJson),
    ])
    
    console.log(idDialer.toString())

    const nodeDialer = await createLibp2p({
        // peerId:idDialer,
        addresses:{
            listen:['/ip4/0.0.0.0/tcp/0'],
        },
        transports: [new WebSockets(), new TCP()],
        streamMuxers: [new Mplex()],
        connectionEncryption: [new Noise()],
        peerDiscovery: [
            // new KadDHT(),
            new MulticastDNS({
                interval: 10e3,
            }),
        ],
        
    })
    
    await nodeDialer.start()
    
    console.log('Dialer ready, listening on:')
    nodeDialer.getMultiaddrs().forEach((ma)=>{
        console.log(ma.toString())
    })
    
    const listenerMa = new Multiaddr(`${peerids[0]}`)
    try {
        const stream = await nodeDialer.dialProtocol(listenerMa, '/chat/1.0.0')
        console.log('dialer dialed to listener on protocol: /chat/1.0.0')
        console.log('type a message and see what happens')
        stdinToStream(stream)
        streamToConsole(stream)
    } catch (error) {
        console.log(error)
    }
}

run()