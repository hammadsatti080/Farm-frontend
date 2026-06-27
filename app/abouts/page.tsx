import React from 'react'
import Aboutsec from './Aboutsec'
import Ourteam from './Ourteam'
import TeamIntro from './Teamintro'
import GoogleMap from '@/Component/GoogleMap'

export default function Page() {
  return (
    <div>
     <Aboutsec /> 
       <TeamIntro /> 
      <Ourteam /> 
      <GoogleMap /> 
    </div>
  )
}
