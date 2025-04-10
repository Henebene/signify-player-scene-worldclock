import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade } from 'swiper/modules'
import useInterval from '../../utils/useInterval'
import 'swiper/css'
import 'swiper/css/effect-fade'
import './Scene.css'

// Import scene components
import Image from '../../scenes/image'
import WorldClock from '../../scenes/worldclock'
import Weather from '../../scenes/weather'

/**
 * Scene component, which handles the rendering and switching of scenes.
 *
 * @component
 * @author Pekka Tapio Aalto
 */
function Scene(props) {    

  // Create deck of scenes. Each scene component must be located
  // inside a SwiperSlide component. If you add new scenes, the
  // implementation of the Image component will serve as an example.
  const scenedeck = props.scenes.map(scene => {
    // Select the scene type of the current scene. 
    switch (scene.type) {
      case "WorldClock":
        return (<SwiperSlide key={scene.id}><WorldClock format={scene.data.format} timezone={scene.data.timezone} /></SwiperSlide>)
      case "image":
        return (<SwiperSlide key={scene.id}><Image orientation={props.orientation} url={scene.data.url} /></SwiperSlide>)
      case "weather":
        return (<SwiperSlide key={scene.id}><Weather orientation={props.orientation} url={scene.data.url} location={scene.data.location} locale={scene.data.locale} timezone={scene.data.timezone} /></SwiperSlide>)
      default:
        return null
    }
  })

  // State variable to contain change interval time in millisecons.
  // Start with tge duration of the first scene.
  const [sceneDuration, setSceneDuration] = useState(props.scenes[0].duration)

  // Create a reference handle for Swiper.
  const swiperRef = useRef();

  // Performs a change of scene and updates the duration if necessary.
  //  - Change to the next scene.
  //  - Find out the index number of the new scene in the scenes array.
  //  - Update change duration if necessary.
  function handleSceneChange() {
    swiperRef.current.slideNext()
    const currentScene = swiperRef.current.realIndex
    if (props.scenes[currentScene].duration && sceneDuration != props.scenes[currentScene].duration) {
      setSceneDuration(props.scenes[currentScene].duration)
    }
  }

  // Start a timer, which takes care of the scene change.
  // Timer uses custom React Hooks function.
  useInterval(handleSceneChange, sceneDuration)

  // Return the Swiper-component.
  return (
    <Swiper
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      loop={true}
      effect={'fade'}
      modules={[EffectFade]}>
      {scenedeck}
    </Swiper>
  )
}

export default Scene