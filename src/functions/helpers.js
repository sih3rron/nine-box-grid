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

export function filter(data, matrix, sq, dictionary) {
  data.filter((d, j) => {
    if (
      d.Box.toLowerCase().includes(matrix.h.toLowerCase()) &&
      sq.content.toLowerCase().includes(matrix.h.toLowerCase())
    ) {
      const row = Math.floor(j / 8);
      const col = j % 8;

      miro.board.createStickyNote({
        content: `<p>${d.Name}</p>`,
        style: {
          fillColor: assignStickyColor(d.Title),
          textAlign: "center",
          textAlignVertical: "middle",
        },
        x: matrix.stX + (col * (63)),
        y: matrix.stY + (row * (63)),
        shape: "square",
        width: 63,
        tagIds: d["Talent Mgmt Flag"] !== "" ? [dictionary.find(t => t.title.toLowerCase() === d["Talent Mgmt Flag"].toLowerCase()).id] : [],
      }).then((note) => {
        miro.board.select({ id: note.id });
      });
    }
  });
}

export function createContextItems(newFrame) {
  const cood = [
    {
      x: -932.2497346847081,
      y: -564.3403083610456,
      color: "#f0f0f3",
      content: "<p><strong>High</strong></p>",
      w: 108.19058415644948,
      h: 574.3092907695124,
      ta: "left",
    },
    {
      x: -932.2497346847081,
      y: 9.968982408466445,
      color: "#d9d9d9",
      content: "<p><strong>Moderate</strong></p>",
      w: 108.19058415644948,
      h: 574.3092907695124,
      ta: "left",
    },
    {
      x: -932.2497346847081,
      y: 584.2782731779791,
      color: "#9a9994",
      content: "<p><strong>Low</strong></p>",
      w: 108.19058415644948,
      h: 574.3092907695124,
      ta: "left",
    },
    {
      x: -574.3092907695113,
      y: 934.1172676348601,
      color: "#9a9994",
      content: "<p><strong>Low</strong></p>",
      w: 574.3092907695144,
      h: 88.98031927435123,
      ta: "center",
    },
    {
      x: 0.11060457615712949,
      y: 934.1172676348601,
      color: "#d9d9d9",
      content: "<p><strong>Medium</strong></p>",
      w: 574.3092907695144,
      h: 88.98031927435123,
      ta: "center",
    },
    {
      x: 574.5304999218242,
      y: 934.1172676348601,
      color: "#f0f0f3",
      content: "<p><strong>High</strong></p>",
      w: 574.309290769512,
      h: 88.98031927435123,
      ta: "center",
    },
  ];

  const measures = cood.map((c, i) =>
    miro.board.createShape({
      content: `<p>${c.content}</p>`,
      shape: "rectangle",
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
        fontSize: 18,
        textAlign: `${c.ta}`,
        textAlignVertical: "middle",
      },
    })
  );

  Promise.all(measures).then((dressing) => {
    createGroup(newFrame, dressing);
  }).catch((error) => {
    console.error("Error creating High|Med|Low - shapes:", error);
  });
}

export function getTagColor(tagname){
  const preassignedTags = [
    { tag:"ITP in Progress", color: "gray"},
    { tag:"Promo Ready", color: "green"},
    { tag:"Recent Promo (<12mo.)", color: "light_green"},
    { tag:"PIP", color: "red"}
  ]

  const assignedTag = preassignedTags.find(pat => pat.tag === tagname);

  return assignedTag ? assignedTag.color : "yellow";
}

export function assignStickyColor(title){
  const preAssignedTitles = [
    { title:"Associate Consultant", color: "light_green" },
    { title:"Consultant", color: "light_green" },
    { title:"Senior Consultant", color: "light_green" },
    { title:"SC + People Leadership", color: "pink" },
    { title:"Principal", color: "green" },
    { title:"Senior Principal", color: "green" },
    { title:"Director", color: "violet" },
    { title:"Senior Director", color: "violet" },
    { title:"Managing Director", color: "violet" },
    { title:"Sr. Manager", color: "blue" },
    { title:"Analyst", color: "orange" },
    { title:"Manager", color: "blue" },
    { title:"Lead", color: "blue" },
    { title:"Sr. Specialist", color: "orange" },
    { title:"Coordinator", color: "cyan" },
    { title:"Sr. Sales Director", color: "dark_blue" },
    { title:"Sales Executive", color: "dark_blue" },
  ];



  const assignedTitle = preAssignedTitles.find(pati => pati.title === title);

  return assignedTitle ? assignedTitle.color : "black";
}

export async function createAnewFrame(name, squares) {
  const frame = await miro.board.createFrame({
    title: `${name}`,
    x: 0,
    y: 9.968982408466786,
    style: {
      fillColor: "#ffffff",
    },
    width: 4000,
    height: 2262,
  });
  return frame;
}

export async function createGroup(frame, ids) {
  const group = await miro.board.group({ items: ids });
  await frame.add(group);
}

export async function zoomToObject(id) {
  await miro.board.viewport.zoomTo(id);
}

export async function myStickyGroup(newFrame) {
  const stickies = await miro.board.getSelection();
  const groupNotes = await miro.board.group({ items: stickies });
  await miro.board.deselect();
  await newFrame.add(groupNotes);
  await zoomToObject(newFrame);
}

export async function createTitle(newFrame, heading) {
  const title = await miro.board.createText({
    content: `<p><strong>${heading}</strong></p>`,
    style: {
      color: "#1a1a1a",
      fillColor: "#ff0000",
      fillOpacity: 1,
      fontFamily: "open_sans",
      fontSize: 64,
      textAlign: "center",
    },
    x: 0,
    y: -1039.4952916448976,
    width: 2417.9358486029682,
    height: 91.42857142857142,
  });
  await newFrame.add(title);
}

export async function createTags(tags) {
  const dictionary = [];

  //Check if tags exist
  const oldTags = await miro.board.get({
    type: "tag",
  });

  oldTags.forEach((tag) => {
    dictionary.push({
      title: tag.title,
      color: tag.color,
      id: tag.id,
    });
  });

  //Create new tags

  for (const tagKey in tags) {
    if (
      !dictionary.some((t) => t.title.toLowerCase() === tagKey.toLowerCase())
    ) {
      const newTag = await miro.board.createTag({
        title: tagKey,
        color: tags[tagKey],
      });

      dictionary.push({
        title: newTag.title,
        color: 'yellow',
        id: newTag.id,
      });
    }
  }

  return dictionary;
}

export async function createKey(newFrame) {
  const titles = [{
    title: "Sr Consultant with Direct Reports",
    color: "light_green",
    x: 1412.2563149682228,
    y: -995.6512570974843,
  }, {
    title: "Sr Consultant",
    color: "light_pink",
    x: 1555.6274929354358,
    y: -995.6512570974843,
  }, {
    title: "Consultant",
    color: "light_yellow",
    x: 1698.9395258682925,
    y: -995.6512570974843,
  }, {
    title: "Associate Consultant",
    color: "black",
    x: 1842.2515588011493,
    y: -995.6512570974843,
  }];

  const outline = await miro.board.createShape({
    content: `<p><strong>Key</strong></p>`,
    shape: "rectangle",
    relativeTo: "canvas_center",
    x: 1603.1581758467682,
    y: -995.6512570974843,
    width: 716.0506711419537,
    height: 179.1166405233987,
    style: {
      borderColor: "#1a1a1a",
      borderOpacity: 1,
      borderStyle: "normal",
      borderWidth: 4,
      color: "#1a1a1a",
      fillOpacity: 1,
      fontFamily: "open_sans",
      fontSize: 31,
      textAlign: "left",
      textAlignVertical: "top",
    },
  });

  titles.forEach(async (t) => {
    const keySticky = await miro.board.createStickyNote({
      content: `<p>${t.title}</p>`,
      style: {
        fillColor: `${t.color}`,
        textAlign: "center",
        textAlignVertical: "middle",
      },
      x: t.x,
      y: t.y,
      shape: "square",
      width: 130.31203293285665,
    });
    await newFrame.add(keySticky);
  });

  await newFrame.add(outline);
}

export async function contextTitles(newFrame) {
  const context = [
    {
      text: "Performance",
      font: 36,
      width: 1644.314043189205,
      x: -18.993435772100838,
      y: 1035.9390945053474,
      rotation: 0,
    },
    {
      text:
        "The extent to which a team member can deliver results, demonstrate competencies and act in the spirit of company values.(reminder to explore ALL competency areas, not just client delivery",
      font: 18,
      width: 1644.314043189205,
      x: -18.993435772100838,
      y: 1085.1549821175108,
      rotation: 0,
    },
    {
      text: "Potential",
      font: 36,
      width: 1644.314043189205,
      x: -1183.253638587198,
      y: -7.885198946161154,
      rotation: -90,
    },
    {
      text:
        "The ability to assume broad set of responsibilities as business needs change.",
      font: 18,
      width: 1644.314043189205,
      x: -1146.8948938321782,
      y: -7.885198946161154,
      rotation: -90,
    },
  ];

  context.forEach(async (c) => {
    const title = await miro.board.createText({
      content: `<p>${c.text}</p>`,
      style: {
        color: "#1a1a1a",
        fontFamily: "open_sans",
        fontSize: c.font,
        textAlign: "center",
      },
      x: c.x,
      y: c.y,
      width: c.width,
      rotation: c.rotation,
    });
    await newFrame.add(title);
  });

}

export async function createBullets(newFrame){
const bullets = [
  {
    text: `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Unclear what's going on for this person</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Fish out of water</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Wrong job</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>May need job intervention</li></ol>`,
    width: 495.53123496297394,
    x: -593.3848398852163,
    y: -754.9465117521851,
  },
  {
    text: '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Current star but still room to maximize performance</li></ol>',
    width: 516.0312349629738,
    x: -8.825549115703552,
    y: -780.6607974664707,
  },
  {
    text: '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Irreplaceable, key talent</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Provide special development opportunities</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Has mastered or excelling inn current role</li></ol>',
    width: 452.52863204939274,
    x: 533.7324401970181,
    y: -763.5179403236136,
  },
  {
    text: '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Inconsistent player</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Developing</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>May have plateaued, need more data</li></ol>',
    width: 495.53123496297394,
    x: -593.3848398852163,
    y: -191.34689917161177,
  },
  {
    text: '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Meet targets</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Has potential for growth</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Solid performer</li></ol>',
    width: 495.53123496297394,
    x: -24.776380558347228,
    y: -191.34689917161177,
  },
  {
    text: '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Current star</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Emerging talent</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Stretch and reward</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Growth potential is focus for development</li></ol>',
    width: 495.53123496297394,
    x: 555.2337416538089,
    y: -182.7754706001832,
  },
  {
    text: '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Take immediate action due to risk</li></ol>',
    width: 495.53123496297394,
    x: -599.5615384087273,
    y: 359.13720515003433,
  },
  {
    text: '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Plateaued</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Good performer</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>May have recent issues</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Same job, same role forever</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Consistent contributor showing limited future potential</li></ol>',
    width: 495.53123496297394,
    x: -19.07554911570196,
    y: 393.42291943574855,
  },
  {
    text: '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Leverage expertise to develop others</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Valued specialist - highly competent</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Dependable professional</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Not ambitious</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"><span class="ql-list-ui"></span></span>Reached top of career</li></ol>',
    width: 495.53123496297394,
    x: 555.2337416538089,
    y: 393.42291943574855,
  }
];

bullets.forEach(async (b) => {
  const bulletText = await miro.board.createText({
    content: b.text,
    style: {
      color: "#1a1a1a",
      fontFamily: "open_sans",
      fontSize: 12,
      textAlign: "left",
    },
    x: b.x,
    y: b.y,
    width: b.width
  });

  await newFrame.add(bulletText);
});

}
