import './App.css';
import React, { useState, useEffect } from 'react'

import Aussteller from './Aussteller';
import Inserat from './Inserat';

function App() {
  var Airtable = require('airtable');
  var base = new Airtable({ apiKey: 'keyigRrBXDdtbuUQ3' }).base('appShZ2e3RAuNGWGt');

  const [aussteller, setAussteller] = useState([]);
  const [ins, setIns] = useState([]);
  const [filterString, setfilterString] = useState("");
  const [filterBranche, setfilterBranche] = useState("");

  const suchstring = 'AND(SEARCH("' + filterString.toLowerCase() + '", LOWER({Firmenname})), SEARCH("' + filterBranche.toLowerCase() + '", LOWER({Branche})))';
  useEffect(() => {
    base('Aussteller').select({ filterByFormula: suchstring, view: "Grid view" })
      .eachPage((records, fetchNextPage) => {
        setAussteller(records);
        fetchNextPage();
      });

  }, [filterString, filterBranche]);

  useEffect(() => {
    base('Inserate').select({ view: "Grid view" })
      .eachPage((records, fetchNextPage) => {
        records.sort( ()=>Math.random()-0.5 );
        setIns(records);
        fetchNextPage();
      });
  }, []);



  const setFilter = (filter) => {
    setfilterString(filter.target.value);
  }
  const setBranchenFilter = (filter) => {
    console.log(filter);
    setfilterBranche(filter.target.value);
  }
  const clearFilter = () => {
    setfilterString("");
    setfilterBranche("");
  }

  const content = () => {
    let inhalt = [];

    inhalt.push(aussteller.map((e) => (
      <Aussteller key={e.id} aussteller={e.fields}/>
    )))

    for (let i =0; i<ins.length; i++){
      const verschiebung = 3;
      const insertpos = i *3+verschiebung;
        inhalt[0].splice(insertpos,0,<Inserat screen="mobile shuffle" bild={ins[i].fields.Inserat[0].url} />)
    console.log(inhalt);
    }

    // for (let i =3; i<inhalt[0].length; i+=4){
    //   for (let j =0; j<ins.length; j++){
    //     inhalt[0].splice(i,0,<Inserat screen="mobile shuffle" bild={ins[j].fields.Inserat[0].url} />)
        
    //   }
    // console.log(inhalt);
    // }

    return inhalt;

  }

  return (
    <div className="App">
      <header>
        <h1>Tischmesse 2023</h1>
        <div className='filter'>
          <div className='filter-col' id="suche">
            <label>Suchen Sie eine Firma:</label>
            <input type="text" placeholder="Ihr Suchtext..." onChange={setFilter} />

          </div>
          <div className='filter-col' id="auswahl">
            <label for="branchen">Filtern nach Branche:</label>
            <select name="branchen" id="brachen" onChange={setBranchenFilter}>
              <option value="">---</option>
              <option value="EDV">EDV</option>
              <option value="Industrie">Industrie</option>
              <option value="Medien">Medien</option>
              <option value="Finanzen">Finanzen</option>
            </select>
          </div>

          <div className='filter-col' id="clean">

          <label for="loeschen">_</label>
          <input type="button" value="Filter löschen" onClick={clearFilter} />
          </div>
        </div>

      </header >
    <main>
      <div id="aussteller-cards">
        {
          content()
        }
        
      </div>
      <div id="sidebar">
        {ins.map((e, index) => (
          <Inserat screen="desktop" key={e.id} bild={e.fields.Inserat[0].url} />
        ))}

      </div>
    </main>
    </div >
  );
}

export default App;
