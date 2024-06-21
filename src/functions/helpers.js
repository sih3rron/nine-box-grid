export function handleCSVFile(e) {
  e.preventDefault();

  const file = document.getElementById("formFile");
  const reader = new FileReader();

  function csvStringToArray(strData, header = true) {
    const pattern = new RegExp(
      '(\\,|\\r?\\n|\\r|^)(?:"((?:\\\\.|""|[^\\\\"])*)"|([^\\,"\\r\\n]*))',
      "gi",
    );
    let arrMatches = null, arrData = [[]];
    while (arrMatches = pattern.exec(strData)) {
      if (arrMatches[1].length && arrMatches[1] !== ",") arrData.push([]);
      arrData[arrData.length - 1].push(
        arrMatches[2]
          ? arrMatches[2].replace(new RegExp('[\\\\"](.)', "g"), "$1")
          : arrMatches[3],
      );
    }
    if (header) {
      let hData = arrData.shift();
      let hashData = arrData.map((row) => {
        let i = 0;
        return hData.reduce(
          (acc, key) => {
            acc[key] = row[i++];
            return acc;
          },
          {},
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
    findFrame(data);
  };
  reader.readAsText(file.files[0]);
}

export function csvStringToArray(strData, header = true) {
  const pattern = new RegExp(
    '(\\,|\\r?\\n|\\r|^)(?:"((?:\\\\.|""|[^\\\\"])*)"|([^\\,"\\r\\n]*))',
    "gi",
  );
  let arrMatches = null, arrData = [[]];
  while (arrMatches = pattern.exec(strData)) {
    if (arrMatches[1].length && arrMatches[1] !== ",") arrData.push([]);
    arrData[arrData.length - 1].push(
      arrMatches[2]
        ? arrMatches[2].replace(new RegExp('[\\\\"](.)', "g"), "$1")
        : arrMatches[3],
    );
  }
  if (header) {
    let hData = arrData.shift();
    let hashData = arrData.map((row) => {
      let i = 0;
      return hData.reduce(
        (acc, key) => {
          acc[key] = row[i++];
          return acc;
        },
        {},
      );
    });
    return hashData;
  } else {
    return arrData;
  }
}

export async function createAnewFrame(name, squares) {
  const frame = await miro.board.createFrame({
    title: `${name}`,
    x: 0,
    y: 9.968982408466786,
    style: {
      fillColor: "#ffffff",
    },
    width: 2000,
    height: 1131.386763443936,
  });
  return frame;
}

export async function createGroup(frame, ids,) {
  const group = await miro.board.group({ items: ids });
  await frame.add(group);
}

export function filter(data, matrix, sq) {
  data.filter((d, j) => {
    if (
      d.Block.toLowerCase().includes(matrix.h.toLowerCase()) &&
      sq.content.toLowerCase().includes(matrix.h.toLowerCase())
    ) {
      const row = Math.floor(j / 6);
      const col = j % 6;

      miro.board.createStickyNote({
        content: `<p>${d.Name}<br/>${d.Title}<br/>${d.Block}</p>`,
        style: {
          fillColor: `${d.Color}`,
          textAlign: "center",
          textAlignVertical: "middle",
        },
        x: matrix.stX + (col * (40)),
        y: matrix.stY + (row * (40)),
        shape: "square",
        width: 40,
      }).then((note)=> {
        miro.board.select({id: note.id})
      })
    }
  });

}

export async function zoomToObject(id) {
  await miro.board.viewport.zoomTo(id);
}

export async function myStickyGroup( newFrame ) {
  const stickies = await miro.board.getSelection();
  const groupNotes = await miro.board.group({ items: stickies });
  await miro.board.deselect();
  await newFrame.add(groupNotes);
  await zoomToObject(newFrame)
}

export function createContextItems(newFrame) {
  
  const cood = [
    {x: 0, y: -286.5304999218216, color: "#f0f0f3", content:"<p><strong>High</strong></p>", w: 65.65370654642821, h: 286.53049992182156, ta: "left", }, 
    {x: 0, y: 5.684341886080802e-14, color: "#d9d9d9", content:"<p><strong>Moderate</strong></p>", w: 65.65370654642821, h: 286.53049992182156, ta: "left"},
    {x: 0, y: 286.5304999218215, color: "#9a9994", content:"<p><strong>Low</strong></p>", w: 65.65370654642821, h: 286.53049992182156, ta: "left"},
    
    {x: 187.34205855249817, y: 482.72053105202116, color: "#9a9994", content:"<p><strong>Low</strong></p>", w: 286.5304999218224, h: 74.26545888207696, ta: "center"},
    {x: 473.87255847432056, y: 482.72053105202116, color: "#d9d9d9", content:"<p><strong>Medium</strong></p>", w: 286.5304999218224, h: 74.26545888207696, ta: "center"},
    {x: 760.403058396143, y: 482.72053105202116, color: "#f0f0f3", content:"<p><strong>High</strong></p>", w: 286.5304999218224, h: 74.26545888207696, ta: "center"},
  ];

  const measures = cood.map((c, i) => 
    miro.board.createShape({
      content: `<p>${c.content}</p>`,
      shape: 'rectangle',
      relativeTo: "canvas_center",
      x: c.x,
      y: c.y,
      width: c.w,
      height: c.h,
      style: {
          borderColor: "#ffffff",
          borderOpacity: 1,
          borderStyle: "normal",
          borderWidth: 2,
          color: "#1a1a1a",
          fillColor: `${c.color}`,
          fillOpacity: 1,
          fontFamily: "open_sans",
          fontSize: 10,
          textAlign: `${c.ta}`,
          textAlignVertical: "middle",
      }
  }))

  Promise.all(measures).then((dressing) => {
    createGroup(newFrame, dressing);
  }).catch(error => {console.error("Error creating High|Med|Low - shapes:", error)});
  
}

export async function createTitle(newFrame, heading){
  
  const title = await miro.board.createText({
    content: `<p><strong>${heading}</strong></p>`,
    style: {
      color: "#1a1a1a",
      fillColor: "#ff0000",
      fillOpacity: 1,
      fontFamily: "open_sans",
      fontSize: 48,
      textAlign: "center",
    },
    x: 674.4362407429135,
    y: -553.6743218690808,
    width: 936.4951616302652,
    height: 68.57142857142857,
  });
  await newFrame.add(title);
}
