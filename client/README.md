<div align="center" id="top">
  <h1>:scroll: GTFR-CG / Front end :film_strip:</h1>
</div>

<div align="center">
  <a href="https://github.com/Thomas-Fernandes/GTFR-CG/blob/develop/README.md">Main README</a> &#xa0; | &#xa0;
  <a href="https://github.com/Thomas-Fernandes/GTFR-CG/blob/develop/server/README.md">Back end README</a>
</div>

&#xa0;

<div align="center">
  <sup><b>powered by:</b></sup>
  <a href="#top"><img alt="TypeScript version" src="https://img.shields.io/badge/TypeScript-5.7.2-2d79c7?logo=typescript" height="24px" /></a>
  <a href="#top"><img alt="React version" src="https://img.shields.io/badge/React-19-5dd2f3?logo=react" height="24px" /></a>
  <a href="#top"><img alt="Tailwind version" src="https://img.shields.io/badge/Tailwind-3.4-06b6d4?logo=tailwindcss" height="24px" /></a>
  <a href="#top"><img alt="Vite version" src="https://img.shields.io/badge/Vite-6-fdd835?logo=vite" height="24px" /></a>
  <a href="#top"><img title="Docker" alt="Docker" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/docker.svg" height="24px" /></a>
</div>

&#xa0;

## :memo: Quick Description

The front end of **GTFR-CG** allows you to quickly access the core functionalities of the server and generate content dynamically.  
It is also the face of the application, where you can see your statistics and navigate through the different pages.

&#xa0;

## :gear: Requirements

All the required front end software and modules can be installed by running [the installer file](https://github.com/Thomas-Fernandes/GTFR-CG/blob/develop/installer.py) with Python.  
The installer will install **npm**, **node** and the required **node modules**.  
The front end doesn't use any library for technical features, and uses React's built-in features to manage state, routing and requests.  
We do use a library for nicer display: Maxwell Barvian's [NumberFlow](https://number-flow.barvian.me/) for statistics display.

&#xa0;

## :movie_camera: Usage

The project [is bundled _via_ Docker](../README.md).  
However, if you still want to run the front end locally, you can do so by following these steps:

&nbsp;&nbsp; :clamp:&nbsp; **Build**

```bash
pnpm install || npm install || yarn install # will install the needed node modules
```

&#xa0;

&nbsp;&nbsp; :rocket:&nbsp; **Launch**

```bash
pnpm run dev || npm run dev || yarn run dev # will launch the front end of the application
```

&#xa0;

&nbsp;&nbsp; :bookmark_tabs:&nbsp; **General Information**

- By default, the front end runs locally on port [**4242**](http://localhost:4242). Edit [the code](./src/constants/paths.ts) to change that.
- The front end features 6 pages to date:
  - [x] **Home**: the main page, where your statistics are displayed and you can navigate to the other 3 main pages described below.
  - [x] **Artwork Generation**: where you can generate artwork from an iTunes image, a local file or a YouTube video.
    - [x] **Processed Artworks**: where you can download a background image and a YouTube thumbnail.
  - [x] **Lyrics**: where you can fetch lyrics from Genius and convert them to lyrics blocks.
  - [x] **Cards Generation**: where cards are generated, based on the blocks from the Lyrics page.
- The client features a [toast notification system](https://web.dev/articles/building/a-toast-component) that will give you feedback upon actions.
- Your user statistics are stored in a file handled [by the back end](https://github.com/Thomas-Fernandes/GTFR-CG/blob/develop/server/README.md).

> [!NOTE] > **Report a malfunction** or **request a feature** by [**opening an issue**](https://github.com/Thomas-Fernandes/GTFR/issues)!

&#xa0;

## :pager: Codebase segments

:file_folder: [**_./_**](https://github.com/Thomas-Fernandes/GTFR-CG/tree/develop/client) : the root folder, where the main configuration files are located  
:file_folder: [**_public/_**](https://github.com/Thomas-Fernandes/GTFR-CG/tree/develop/client/public) : where the public assets lie, such as the favicon and other image files  
:file_folder: [**_src/common/_**](https://github.com/Thomas-Fernandes/GTFR-CG/tree/develop/client/src/common) : where the common properties, hooks and utils are located  
:file_folder: [**_src/components/_**](https://github.com/Thomas-Fernandes/GTFR-CG/tree/develop/client/src/components) : where all the generic components are located  
:file_folder: [**_src/constants/_**](https://github.com/Thomas-Fernandes/GTFR-CG/tree/develop/client/src/constants) : where the application's constants are located  
:file_folder: [**_src/pages/_**](https://github.com/Thomas-Fernandes/GTFR-CG/tree/develop/client/src/pages) : where the application's TSX code is located (one folder per page)

<br />

[Back to top](#top)
