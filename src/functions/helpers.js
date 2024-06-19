export function handleCSVFile(e) {
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
      findFrame(data);
    }
    reader.readAsText(file.files[0]);
};

export function csvStringToArray(strData, header = true){
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
};  

export async function createAFrame(group, name){
   console.log("Name: ", name)
    const frame = await miro.board.createFrame({
        title: `${name}`,
        x: 0,
        y: 0,
        style: {
            fillColor: '#ffffff',
        },
        width: 2000,
        height: 1000,
        })
    
        await frame.add(group)

};


