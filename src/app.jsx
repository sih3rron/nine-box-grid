import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import '../src/assets/style.css';

export default function App(){
  const [isFileSelected, setIsFileSelected] = useState(false);

  function handleFileChange(e) {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) { setIsFileSelected(!!file);} 
  };

  function handleCSVFile(e) {
    e.preventDefault();

    const file = document.getElementById('formFile');
    const reader = new FileReader();

    function csvStringToArray(strData, header = true){
      const pattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"((?:\\\\.|\"\"|[^\\\\\"])*)\"|([^\\,\"\\r\\n]*))"), "gi");
      let arrMatches = null, arrData = [[]];
      while (arrMatches = pattern.exec(strData)) {
        if (arrMatches[1].length && arrMatches[1] !== ",") arrData.push([]);
        arrData[arrData.length - 1].push(arrMatches[2] ?
          arrMatches[2].replace(new RegExp("[\\\\\"](.)", "g"), '$1') :
          arrMatches[3]);
      }
      if (header) {
        let hData = arrData.shift();
        let hashData = arrData.map(row => {
          let i = 0;
          return hData.reduce(
            (acc, key) => {
              acc[key] = row[i++];
              return acc;
            },
            {}
          );
        });
        return hashData;
      } else {
        return arrData;
      }
    }



    reader.onload = function (e) {
      const csv = e.target.result;
      const data = csvStringToArray(csv, true);
      data.forEach(async (d) => {
        console.log(d)
        await addASticky(d);
      });
    }
    reader.readAsText(file.files[0]);
  };

  async function addASticky(data){

    const sticky = await miro.board.createStickyNote({
      content: `<p>${data.Timestamp}</p>`,
      style: {
        fillColor: 'light_yellow', // Default value: light yellow
        textAlign: 'center', // Default alignment: center
        textAlignVertical: 'middle', // Default alignment: middle
      },
      x: 0, // Default value: horizontal center of the board
      y: 0, // Default value: vertical center of the board
      shape: 'square',
      width: 200, 
    });

  }

  return (
    <div className="grid wrapper">
      <form id="csvUpload" onSubmit={e => handleCSVFile(e)}>
        <div className="form-group">
          <label htmlFor="formFile">Load your .CSV Data file.</label>
          <input type="file" id="formFile" accept=".csv, .tsv" onChange={handleFileChange}/>
        </div>
        <button type="submit" className="button button-primary button-medium" disabled={!isFileSelected}>Submit</button>
      </form>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
