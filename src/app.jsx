import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { csvStringToArray, filter, myStickyGroup, createAnewFrame, createGroup, createContextItems, createTitle } from './functions/helpers';

import '../src/assets/style.css';

export default function App() {
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [frameName, setFrameName] = useState(`Nine-Box-Grid | ${new Date().toLocaleDateString('en-US',{
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}`);
  
  const [heading, setHeading] = useState("")
  

  function handleFileChange(e) {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) { setIsFileSelected(!!file); }
  };

  function compare(a, b) {
    if (a.Block > b.Block)
      return -1;
    else if (a.Block == b.Block)
      return 0;
    else
      return 1;

  }

  async function handleCSVFile(e) {
    e.preventDefault();

    const file = document.getElementById('formFile');
    const reader = new FileReader();

    reader.onload = async (e) => {
      const newFrame = await createAnewFrame(frameName);
      const titleText= await createTitle(newFrame, heading);
      const alignment = createContextItems(newFrame);

      const dimensions = 286.53049992182156;
      const matrix = [
        { h: "Intriguing Challenge", x: 187.34205855249775, y: -286.53049992182173, content: "<p><b>Intriguing Challenge</b></p>", color: "#F7DFD2" , stX: 74.18655885735689, stY: -351.3604318679564, },   
        { h: "Future Star", x: 473.87255847432016, y: -286.53049992182173, content: "<p><b>Future Star</b></p>", color: "#BDE6EA" ,stX: 363.0359490263809, stY: -351.3604318679564, }, 
        { h: "Stand-out Leader", x: 760.4030583961408, y: -286.53049992182173, content: "<p><b>Stand-out Leader</b></p>", color: "#76D6DE" ,stX: 648.5272246437689, stY: -351.3604318679564, },

        { h: "Puzzle/Concern", x: 187.34205855249775, y: 0, content: "<p><b>Puzzle/Concern</b></p>", color: "#FDCAD1" ,stX: 74.18655885735689, stY: -67.07240925567447, }, 
        { h: "Core Player", x: 473.87255847432016, y: -2.2737367544323206e-13, content: "<p><b>Core Player</b></p>", color: "#F6DFD0" ,stX: 363.0359490263809, stY: -67.07240925567447, }, 
        { h: "High Impact Performer", x: 760.4030583961408, y: -2.2737367544323206e-13, content: "<p><b>High Impact Performer</b></p>", color: "#BBE6E8" ,stX: 648.5272246437689, stY: -67.07240925567447,  },

        { h: "Needs Improvement", x: 187.34205855249775, y: 286.53049992182173, content: "<p><b>Needs Improvement</b></p>", color: "#FFA1A6" ,stX: 74.18655885735689, stY: 220.4881634851996,  }, 
        { h: "Effective Performer", x: 473.87255847432016, y: 286.53049992182173, content: "<p><b>Effective Performer</b></p>", color: "#FCCBCD" ,stX: 363.0359490263809, stY: 220.4881634851996, }, 
        { h: "Trusted Professional", x: 760.4030583961408, y: 286.53049992182173, content: "<p><b>Trusted Professional</b></p>", color: "#F6DFCE" ,stX: 648.5272246437689, stY: 220.4881634851996, },
      ];

      const csv = e.target.result;
      const data = csvStringToArray(csv, true).sort(compare);
      const gridIds = [];
      const grid = matrix.map((x, i) => 
        miro.board.createShape({
            content: `<p>${x.content}</p>`,
            shape: 'rectangle',
            relativeTo: "canvas_center",
            x: x.x,
            y: x.y,
            width: dimensions,
            height: dimensions,
            style: {
                borderColor: "#ffffff",
                borderOpacity: 1,
                borderStyle: "normal",
                borderWidth: 2,
                color: "#1a1a1a",
                fillColor: `${x.color}`,
                fillOpacity: 1,
                fontFamily: "open_sans",
                fontSize: 10,
                textAlign: "left",
                textAlignVertical: "top",
            }
        })
    );
    
    Promise.all(grid).then((squares) => {

        squares.forEach((sq, i) => { 
          filter(data.filter(d => d.Block.toLowerCase().includes(matrix[i].h.toLowerCase())), matrix[i], sq) 
        });

        createGroup(newFrame, squares);
          
    }).then(()=> {
      setTimeout(() => {
        myStickyGroup(newFrame);
        console.log("Grouped to the Frame!")
      }, 2500);
      
    }).catch(error => {
        console.error("Error creating shapes:", error);
    })

    }

    reader.readAsText(file.files[0]);
  };

  const today = new Date();

  return (
    <div className="grid wrapper">

      <form className="cs1 ce12 form-example--main-content" id="csvUpload" onSubmit={e => handleCSVFile(e)} >

        <div className="form-group">

          <label htmlFor="frameName">Name your Nine-Box Grid</label>
          <input className="input" type="text" id="frameName" placeholder="Nine-Box-Grid" onChange={e => setFrameName(`${e.target.value.toLowerCase().replace(/\s+/g, '-')} | ` + `${today.toLocaleDateString('en-US',{
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}`)}
          />
        </div>
        <div className="form-group ">
          
          <label htmlFor="setBoxHeading">Label this Grid with Quarter and Year</label>
          <input 
            className="input" 
            type="text" 
            id="setBoxHeading" 
            placeholder="QQ - YYYY" 
            onChange={e => setHeading(`${e.target.value}`)}
            required
          />
          
        </div>

        <hr />

        <div className="form-group">
          <label htmlFor="uploadFile">Upload your CSV file</label>
          <input type="file" id="formFile" accept=".csv, .tsv" onChange={e => handleFileChange(e)} className='upload' />
        </div>

        <button type="submit" className="button button-primary button-medium" disabled={!isFileSelected}>Submit</button>
      </form>
    </div>
  );

};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
