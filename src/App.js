import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Joukkueet from './Components/Joukkueet';
import Tasks from './Components/Tasks';
import Competition from './Components/Competition';
import CompetitionAlkuerä from './Components/CompetitionAlkuerä';
import CompetitionKeräilyerä from './Components/CompetitionKeräilyerä';
import CompetitionVälierä from './Components/CompetitionVälierä';
import CompetitionFinaali from './Components/CompetitionFinaali';
import Ajastin from './Components/Ajastin';
import NewAjastinChild from './Components/NewAjastinChild';
import NewAjastinGranChild from './Components/NewAjastinGranChild';
import './css/app.css';
function App() {
  return (
    <Router>
      <div className="layout">
        <div className="header">
          <h1>Taitajat</h1>
        </div>
        <div className="sidebar">
          <ul>
            <li>
              <Link to="/">Register</Link>
            </li>
            <li>
              <Link to="tasks">Tasks</Link>
            </li>
            <br/>
            <li>
            <Link to="competition">Turnaus</Link>
            </li>
            <li>
            <Link to="alkuerät">Alkuerät</Link>
            </li>
            <li>
            <Link to="keräilyerät">Keräilyerät</Link>
            </li>
            <li>
            <Link to="välierät">Välierät</Link>
            </li>
            <li>
            <Link to="finaali">Finaali</Link>
            </li>

          </ul>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Joukkueet />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="retired" element={<Competition />} />
            <Route path="alkuerät" element={<CompetitionAlkuerä />} />
            <Route path="keräilyerät" element={<CompetitionKeräilyerä />} />
            <Route path="välierät" element={<CompetitionVälierä />} />
            <Route path="finaali" element={<CompetitionFinaali />} />
            <Route path="team/:teamId" element={<Ajastin />} />
            <Route path="competition" element={<NewAjastinChild/>} />
            <Route path="team/:teamId/Newtimer" element={<NewAjastinGranChild/>} />
          </Routes>
        </div>
        <div className="footer">
          <p>&copy; 2023 My App</p>
        </div>
      </div>
    </Router>
  );
}

export default App;
