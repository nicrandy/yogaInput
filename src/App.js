import './App.css';
import CreateWorkout from './components/Instructor/createWorkout'
import CreatePoses from './components/Instructor/createPoses'

import { useState } from 'react'


export default function App() {
  const [toggles, setToggles] = useState({
    poses: false,
    workouts: false,
    profile: false
  })
  function displayToggle(toggle) {
    if (toggle === 'poses') {
      setToggles({
        poses: true,
        workouts: false,
        profile: false
      })
    } else if (toggle === 'workouts') {
      setToggles({
        poses: false,
        workouts: true,
        profile: false
      })
    } else if (toggle === 'profile') {
      setToggles({
        poses: false,
        workouts: false,
        profile: true
      })
    }
  }

  console.log(toggles)

  return (
    <div className="App">
      <div className='displayToggleButtons'>
        <div className='toggleButton'>
          <button className='indivToggleButtons' onClick={() => displayToggle("poses")}>Poses</button>
        </div>
        <div className='toggleButton'>
          <button className='indivToggleButtons' onClick={() => displayToggle("workouts")}>Workouts</button>
        </div>
        <div className='toggleButton'>
          <button className='indivToggleButtons' onClick={() => displayToggle("profile")}>Profile</button>
        </div>
      </div>
      {toggles.poses ? <CreatePoses /> : null}
      {toggles.workouts ? <CreateWorkout /> : null}
    </div>
  );
}

