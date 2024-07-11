import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { csvStringToArray, filter, myStickyGroup, createAnewFrame, createGroup, createContextItems, createTitle, createTags, createKey, contextTitles, createBullets, getTagColor } from './functions/helpers';

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
      const gridKey = await createKey(newFrame);
      const alignment = createContextItems(newFrame);
      const performancePotential = await contextTitles(newFrame);
      const dimensions = 574.3092907695121;

      const matrix = [
        { h: "Intriguing Challenge", x: -574.3092907695125, y: -564.3403083610458, content: "<p><b>Intriguing Challenge</b></p>", color: "#F7DFD2" , stX: -806.006964892445, stY: -643.9482746210322, },   
        { h: "Future Star", x: 1.8189894035458565e-12, y: -564.3403083610458 , content: "<p><b>Future Star</b></p>", color: "#BDE6EA" ,stX: -235.34116659719052, stY: -643.9482746210322, }, 
        { h: "Stand-out Leader", x: 574.3092907695127 , y: -564.3403083610458, content: "<p><b>Stand-out Leader</b></p>", color: "#76D6DE" ,stX: 338.96812417232195, stY: -643.9482746210322, },

        { h: "Puzzle/Concern", x: -574.3092907695125, y: 9.968982408466672, content: "<p><b>Puzzle/Concern</b></p>", color: "#FDCAD1" ,stX: -809.6504573667032, stY: -96.71037866560482, }, 
        { h: "Core Player", x: 1.8189894035458565e-12, y: 9.968982408466218, content: "<p><b>Core Player</b></p>", color: "#F6DFD0" ,stX: -235.34116659718893, stY: -96.71037866560482, }, 
        { h: "High Impact Performer", x: 574.3092907695127, y: 9.968982408466218, content: "<p><b>High Impact Performer</b></p>", color: "#BBE6E8" ,stX: 338.96812417232195, stY: -96.71037866560482,  },

        { h: "Needs Improvement", x: -574.3092907695125, y: 584.2782731779791, content: "<p><b>Needs Improvement</b></p>", color: "#FFA1A6" ,stX: -809.6504573667032, stY: 474.381371214962,  }, 
        { h: "Effective Performer", x: 1.8189894035458565e-12, y: 584.2782731779791, content: "<p><b>Effective Performer</b></p>", color: "#FCCBCD" ,stX: -235.34116659718893, stY: 474.381371214962, }, 
        { h: "Trusted Professional", x: 574.3092907695127, y: 584.2782731779791, content: "<p><b>Trusted Professional</b></p>", color: "#F6DFCE" ,stX: 338.96812417232195, stY: 474.381371214962, },
      ];

      const csv = e.target.result;
      const data = csvStringToArray(csv, true).sort(compare);
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
                fontSize: 18,
                textAlign: "left",
                textAlignVertical: "top",
            }
        }));

        const slalomTags = [];
        const slalomNewTags = data.filter(d => { 
          if(d["Talent Mgmt Flag"] !== "")
            { slalomTags.push(
              { tag: d["Talent Mgmt Flag"], 
                color: getTagColor(d["Talent Mgmt Flag"])
              }

          )}});

        slalomTags.forEach(tagObj => {
          if (!slalomNewTags[tagObj.tag]) {
            slalomNewTags[tagObj.tag] = tagObj.color;
          }
        });

        const tagsDictionary = await createTags(slalomNewTags);
        console.log("My Tags Dictionary: ", tagsDictionary);

        //const tagsDictionary = [];
        const bulletPoints = await createBullets(newFrame);
    Promise.all(grid).then((squares) => {
        
        squares.forEach((sq, i) => { 
          filter(data.filter(d => d.Box.toLowerCase().includes(matrix[i].h.toLowerCase())), matrix[i], sq, tagsDictionary) 
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
          <label htmlFor="formFile">Upload your CSV file</label>
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
