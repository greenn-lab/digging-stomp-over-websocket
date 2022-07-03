import {useContext, memo} from 'react'
import AudioBuffer from "../context/AudioBuffer";

const AudioWaveStream = ({source}) => {

  // const audioBuffer = useContext(AudioBuffer);

  // setInterval(() => console.log('audioBuffer', audioBuffer.length), 1000)

  console.log('AudioWaveSteam re-rendering')

  return (
      <div>
        <div onClick={() => console.log(source.length)}>wave2</div>
        <div>wave3</div>
      </div>
  )
}

export default memo(AudioWaveStream, (prev, next) => {
  console.log('memo', prev, next)
  return true
})
