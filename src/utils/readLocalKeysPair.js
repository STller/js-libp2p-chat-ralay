import { peerIdFromKeys } from "@libp2p/peer-id"
import { readFileSync } from 'fs'
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

/**
 * 读取pubkey、prikey
 * 生成peerid
 * @param {Uint8Array} pubkey
 * @param {Uint8Array} prikey
 */
export async function generatePeeridByreadKey () {
    const prikey = readFileSync(`${path.dirname(__dirname)}/peerid-pri.bin`)
    const pubkey = readFileSync(`${path.dirname(__dirname)}/peerid-pub.bin`)
    const peerId = await peerIdFromKeys(pubkey, prikey)
    if (!pubkey || !prikey) throw Error('Please check key!')
    return await peerIdFromKeys(pubkey, prikey)
}