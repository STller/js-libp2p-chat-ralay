import { createLibp2p } from 'libp2p'
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
import { Multiaddr } from '@multiformats/multiaddr'
import { generatePeeridByreadKey } from './utils/readLocalKeysPair.js'
import { stdinToStream, streamToConsole } from './stream.js'
import { multiaddr } from 'multiaddr'

const createNode = async () => {
    const peerid = await generatePeeridByreadKey()
    return createLibp2p({
        peerId: peerid,
        addresses: {
            listen: ['/ip4/0.0.0.0/tcp/55275'],
        },
        transports: [new TCP()],
        streamMuxers: [new Mplex()],
        connectionEncryption: [new Noise()],
        peerDiscovery: [
            new MulticastDNS({
                interval: 10e3,
            }),
            new Bootstrap({
                interval: 10e3,
                list: bootPeerid,
            })
        ],
        dht: new KadDHT(),
    })
}

const node1 = await createNode()
// const [node1] = await Promise.all([
//     createNode(peerid),
// ])

await Promise.all([
    node1.start(),
])

// node1.getMultiaddrs().forEach((ma)=>console.log(`Multiaddr: ${ma}`))
node1.addEventListener('peer:discovery', (peer) => {
    console.log('Discovered:', peer.detail.id.toString())
})
node1.connectionManager.addEventListener('peer:connect', async (conn) => {
    console.log(`Connected :${conn.detail.remoteAddr}`)
})

// console.log(`Stream peerid: ${multiaddr(bootPeerid[0])}`)
// try {
    // const stream = await node1.dialProtocol(multiaddr(bootPeerid[0]),'/chat/1.0.0')
    // console.log(`Stream: ${stream}`)
    // stdinToStream(stream)
    // streamToConsole(stream)
// } catch (error) {
//     console.log(error)
// }
node1.dial(multiaddr(bootPeerid[0]))
// node1.getPeers().forEach((peer) => console.log(peer))