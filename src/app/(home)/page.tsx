import { About } from '@/components/PageComponents/HomePage/About'
import { Advisor } from '@/components/PageComponents/HomePage/Advisor'
import { Contact } from '@/components/PageComponents/HomePage/Contact'
import { Focus } from '@/components/PageComponents/HomePage/Focus'
import { Hero } from '@/components/PageComponents/HomePage/Hero'
import { Notices } from '@/components/PageComponents/HomePage/Notices'
import { Projects } from '@/components/PageComponents/HomePage/Projects'
import { Team } from '@/components/PageComponents/HomePage/Team'
import { db } from '@/lib/db'
import React from 'react'

const page = async() => {
  return (
    <div>
      <Hero></Hero>
      <Focus></Focus>
      <Projects></Projects>
      <Notices></Notices>
      <Advisor></Advisor>
      <Team></Team>
      <About></About>
      <Contact></Contact>
    </div>
  )
}

export default page