import {useEffect, useState} from "react";
import * as StompJs from '@stomp/stompjs'
import {ActivationState, Client} from '@stomp/stompjs'
import AudioBuffer from "../context/AudioBuffer";
import AudioWaveStream from "./AudioWaveStream";

const client: Client = new StompJs.Client({
  brokerURL: 'ws://localhost:8080/sz',
  reconnectDelay: 5000,
  debug(msg) {
    console.debug('from StompJs.Client:\n %s', msg)
  }
});

// @ts-ignore
window._client = client


const Voice = () => {

  const [sources, setSources] = useState<AudioBufferSourceNode[]>([])

  useEffect(() => {
    if (client.state === ActivationState.INACTIVE) {
      const audioContext = new AudioContext();

      // @ts-ignore
      window._ac = audioContext

      client.onConnect = (frame) => {
        client.subscribe('/transcribe/streaming', ({binaryBody}) => {
          const source = audioContext.createBufferSource();
          audioContext.decodeAudioData(binaryBody.buffer)
          .then((resolve) => {
            source.buffer = resolve

            setSources(prev => {
              return [...prev, source]
            })
            // source.connect(audioContext.destination)
            // source.start()
          })
        })
      }

      client.activate()
    }
  })

  const send = () => {
    client.publish({
      destination: `/transcriber/audio/${sources.length}`,
      body: JSON.stringify({receiver: 'anon', message: 'Hello world'}),
      skipContentLengthHeader: true,
    })
  }

  const getSources = () => {
    console.log('Voice.getSources', sources.length)
    return sources
  }

  return (
      <>
        <div onClick={send}>hello { sources.length || 0 }</div>
          <AudioWaveStream source={sources} />
      </>
  )
}

export default Voice
