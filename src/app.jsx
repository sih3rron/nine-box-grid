import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { csvStringToArray, createAFrame } from './functions/helpers';

import '../src/assets/style.css';

export default function App() {

  const [isFileSelected, setIsFileSelected] = useState(false);
  const [frameName, setFrameName] = useState("Nine-Box-Grid");

  async function createGroup(ids, name = frameName) {
    const group = await miro.board.group({items: ids});
    await createAFrame(group, name);
  }


  //Fn to set the file selected state
  function handleFileChange(e) {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) { setIsFileSelected(!!file); }
  };

  async function handleCSVFile(e) {
    e.preventDefault();

    const file = document.getElementById('formFile');
    const reader = new FileReader();

    reader.onload = async (e) => {

      const dimensions = 286.53049992182156;
      const axis = [
        { x: 187.34205855249775, y: -286.53049992182173, content: "<p><b>High professional</b></p>"}, 
        { x: 473.87255847432016, y: -286.53049992182173, content: "<p><b>Emerging talent</b></p>" }, 
        { x: 760.4030583961408, y: -286.53049992182173, content: "<p><b>High potential</b></p>" },

        { x: 187.34205855249775, y: 0, content: "<p><b>Solid performer</b></p>" }, 
        { x: 473.87255847432016, y: -2.2737367544323206e-13, content: "<p><b>Solid performer with some potential</b></p>" }, 
        { x: 760.4030583961408, y: -2.2737367544323206e-13, content: "<p><b>Solid performer with strong potential</b></p>" },

        { x: 187.34205855249775, y: 286.53049992182173, content: "<p><b>Immediate improvement required</b></p>" }, 
        { x: 473.87255847432016, y: 286.53049992182173, content: "<p><b>Needs improvement</b></p>" }, 
        { x: 760.4030583961408, y: 286.53049992182173, content: "<p><b>New to role or Developing with strong potential</b></p>" },
      ];
      const csv = e.target.result;
      const data = csvStringToArray(csv, true);
      const gridIds = [];

      const gridHeadings = [
        {h: "High professional"},
        {h: "Emerging talent"},
        {h: "High potential"},
        {h: "Solid performer"},
        {h: "Solid performer with some potential"},
        {h: "Solid performer with strong potential"},
        {h: "Immediate improvement required"},
        {h: "Needs improvement"},
        {h: "New to role or Developing with strong potential"},
      ];

      const grid = axis.map((x, i) => 
        miro.board.createShape({
            content: `<p>${x.content}</p>`,
            shape: 'rectangle',
            relativeTo: "canvas_center",
            x: x.x,
            y: x.y,
            width: dimensions,
            height: dimensions,
            style: {
                borderColor: "#ff7400",
                borderOpacity: 1,
                borderStyle: "normal",
                borderWidth: 2,
                color: "#1a1a1a",
                fillColor: "#fef445",
                fillOpacity: 1,
                fontFamily: "open_sans",
                fontSize: 10,
                textAlign: "left",
                textAlignVertical: "top",
            }
        })
    );
    
    
    Promise.all(grid).then(squares => {

        squares.forEach(square => gridIds.push(square.id));

        squares.forEach((sq, i) => {
          data.filter(d => { if(
            d.Block.toLowerCase().includes(gridHeadings[i].h.toLowerCase()) 
            && sq.content.toLowerCase().includes(gridHeadings[i].h.toLowerCase())
          ){ 
            miro.board.createStickyNote({
              content: `<p>${d.Name}<br/>${d.Title}</p>`,
              style: {
                fillColor: 'light_yellow', 
                textAlign: 'center', 
                textAlignVertical: 'middle', 
              },
              x: sq.x - 105, 
              y: sq.y - 80, 
              shape: 'square',
              width: 22, 
            })
          }})
        
          });

        createGroup(squares)
          

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
          <input className="input" type="text" id="frameName" placeholder="Nine-Box-Grid" onChange={e => setFrameName(`${e.target.value.toLowerCase().replace(/\s+/g, '-')}-` + `${today.toLocaleDateString('en-US',{
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}`)}
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
