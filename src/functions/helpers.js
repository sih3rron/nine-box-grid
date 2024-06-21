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
    y: 0,
    style: {
      fillColor: "#ffffff",
    },
    width: 2000,
    height: 1000,
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
