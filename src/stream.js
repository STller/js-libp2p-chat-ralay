import { pipe } from 'it-pipe'
import * as lp from 'it-length-prefixed'
import map from 'it-map'
import { fromString as unit8ArrayFromString } from 'uint8arrays/from-string'
import { toString as unit8ArrayToString } from 'uint8arrays/to-string'

export function stdinToStream(stream){
    // read utf-8 from stdin
    process.stdin.setEncoding('utf-8')
    pipe(
        process.stdin,
        (source)=>map(source,(string)=>unit8ArrayFromString(string)),
        lp.encode(),
        stream.sink
    )
}

export function streamToConsole(stream){
    pipe(
        stream.source,
        lp.decode(),
        (source)=>map(source,(buf)=>unit8ArrayToString(buf.subarray())),
        async function(source){
            for await (const msg of source){
                console.log(`> ${msg.toString().replace('\n', '')}`)
            }
        }
    )
}