import { peerIdFromKeys } from "@libp2p/peer-id"
import { readFileSync } from 'fs'


/**
 * 读取pubkey、prikey
 * 生成peerid
 * @param {Uint8Array} pubkey
 * @param {Uint8Array} prikey
 */
export async function generatePeeridByreadKey () {

    const prikey = readFileSync('../peerid-pri.bin')
    const pubkey = readFileSync('../peerid-pub.bin')
    const peerId = await peerIdFromKeys(pubkey, prikey)
    if (!pubkey || !prikey) throw Error('Please check key!')
    return await peerIdFromKeys(pubkey, prikey)
}