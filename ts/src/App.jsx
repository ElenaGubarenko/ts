import { useState } from 'react'
// import './App.css'
import styles from '././app.module.scss';
import TournamentEconomics from './components/TournamentEconomics/TournamentEconomics'

function App() {

  return (
    
    <div className={styles.page}>
    <TournamentEconomics></TournamentEconomics>
    </div>
  )
}

export default App
