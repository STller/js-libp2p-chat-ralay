import { createEd25519PeerId } from "@libp2p/peer-id-factory"
import { writeFileSync } from 'fs'

/**
 * 生成密钥对并保存本地
 */
const peerid = await createEd25519PeerId()
const { publicKey, privateKey } = peerid
writeFileSync('peerid-pri.bin', privateKey)
writeFileSync('peerid-pub.bin', publicKey)