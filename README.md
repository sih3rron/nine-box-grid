## Nine Box Grid - Automation

### What does the app do?

Once installed in Miro boards the prototype will:

1. Consume and read a Comma-Separate data file.
2. Create a nine-box grid, context labels, and headings at a specific set of static coordinates on a Miro board.
3. The app will then position sticky notes per data file row within the grid.
4. Populate the stickies with data from the CSV data file.
5. The prototype will then assign tags to each sticky based upon flags within the data file.
6. Add all of the newly created grid components and stickies to a frame so they can be collectively moved or deleted.
7. The app expects a rigid set of column headings in the format outlined below. These headers are used to identify data in the app and mispellings or additional spaces will cause the app to error.


|Name|People Leader|Practice|Title|Box|Talent Mgmt Flag|  
|----|-------------|--------|-----|---|----------------|




### How is the app built?

This Miro prototype provides you with code and configuration that you can further customize to fit your needs. 

* the Miro Web SDK
* Mirotone components & styling
* React & JavaScript  
* [`create-miro-app`](https://www.npmjs.com/package/create-miro-app)
* This app uses [Vite](https://vitejs.dev/). If you want to modify the `vite.config.js` configuration, see the [Vite documentation](https://vitejs.dev/guide/).

There are no environment variables included in this package as there is no requirement for authentication when using the Miro Web SDK as it runs in the browser.

For more information, visit the [Miro developer documentation](https://developers.miro.com).



### How to start locally

- Run `npm i` to install dependencies.
- Run `npm start` to start developing. \
  Your URL should be similar to this example:
 ```
 http://localhost:3000
 ```
- Paste the URL under **App URL** in your
  [app settings](https://developers.miro.com/docs/build-your-first-hello-world-app#step-3-configure-your-app-in-miro).
- Open a board; you should see your app in the app toolbar or in the **Apps**
  panel.

### How to build the app

- Run `npm run build`. \
  This generates a static output inside [`dist/`](./dist), which you can host on a static hosting
  service.

### Folder structure

<!-- The following tree structure is just an example -->

```
.
├── src
│  ├── assets
│  │  └── style.css
│  ├── functions
│  │  └── helpers.js // Coded into exported functions to make specific customizations simpler
│  ├── app.jsx     // The code for the app lives here
│  └── index.js    // The code for the app entry point lives here
├── app.html       // The app itself. It's loaded on the board inside the 'appContainer'
└── index.html     // The app entry point. This is what you specify in the 'App URL' box in the Miro app settings
```



