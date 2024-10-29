<div align="center" id="top">
    <h1>:scroll: Genius traductions françaises Content Generator :film_strip:</h1>
</div>

<div align="center">
    <a href="#memo-description">Description</a> &#xa0; | &#xa0;
    <a href="#gear-requirements">Requirements</a> &#xa0; | &#xa0;
    <a href="#movie_camera-usage">Usage</a> &#xa0; | &#xa0;
    <a href="#card_file_box-changelog">Changelog</a>
</div>

&#xa0;

<div align="center">
  <sup><b>The technical stack at play:</b></sup>

  <img title="Python" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1028px-Python-logo-notext.svg.png" width="28px" alt="Python" />
  <img title="Flask" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/flask.svg" width="28px" alt="Flask" />
  <img title="React.js" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/react.svg" width="28px" alt="React" />
  <img title="Vite" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/vite.svg" width="28px" alt="Vite" />
  <img title="TypeScript" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png" width="28px" alt="TScript" />
  &nbsp;<sup><b>| formerly:</b></sup>&nbsp;
  <img title="GIMP" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/gimp.svg" width="28px" alt="GIMP" />
  <img title="Adobe Premiere Pro" src="https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg" width="28px" alt="Premiere" />

</div>

&#xa0;

<div align="center">
    <a href="#top"><img alt="Python version" src="https://img.shields.io/badge/Python-3.11+-blue?logo=python" /></a>
    <a href="#card_file_box-changelog"><img alt="Last version released" src="https://img.shields.io/badge/release-v1.4.4-blue?logo=windows-terminal" /></a>
    <a href="https://github.com/Thomas-Fernandes/GTFR/commits/main"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Thomas-Fernandes/GTFR?color=blueviolet&logo=clarifai" /></a>
</div>
<div align="center">
    <a href="https://github.com/Thomas-Fernandes/GTFR/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/Thomas-Fernandes/GTFR?color=yellow&logo=github" /></a>
    <a href="https://github.com/Thomas-Fernandes/GTFR/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/Thomas-Fernandes/GTFR?color=forestgreen&logo=target" /></a>
    <a href="https://github.com/Thomas-Fernandes/GTFR/graphs/contributors"><img alt="GitHub contributors" src="https://img.shields.io/github/contributors/Thomas-Fernandes/GTFR?color=red&logo=stackedit" /></a>
    <a href="#top"><img alt="GitHub repository size" src="https://img.shields.io/github/languages/code-size/Thomas-Fernandes/GTFR?color=blue&logo=frontify" /></a>
</div>

&#xa0;

## :memo: Description

**GTFR-CG** is a React-Python web application that generates content serving the creation and publication of [**Genius traductions françaises**](https://www.youtube.com/c/geniustraductionsfrancaises) YouTube videos.  

- Generate artwork, lyrics cards and YouTube descriptions that can then be edited into **translation videos**.  
- Save time by interacting with the APIs of **iTunes** and **Genius** to automate parts of the edition process!  
- One day, maybe one day, this application maybe even be able to generate whole videos by itself...

<a href="https://github.com/QuentindiMeo"><img src="https://i.imgur.com/w8SH3M7.png" alt="qdm" width="100" align="right" /></a><a href="https://github.com/Thomas-Fernandes"><img src="https://i.imgur.com/MsvdW4y.png" alt="tf" width="100" align="right" /></a>
The application was thought, designed, programmed and crafted by Frenchmen 🇫🇷 [**@Thomas-Fernandes**](https://github.com/Thomas-Fernandes) and [**@QuentindiMeo**](https://github.com/QuentindiMeo).

**Disclaimer: the creators of this application do not claim any rights on the brands at play. All rights belong to their respective owners.**

&#xa0;

## :gear: Requirements

This application was tested on, and designed for **Windows 11** and **Ubuntu 22.04**.  
All the required back end modules are listed in [the requirements file](./server/requirements.txt). They will be installed upon launch of the back end.  
All the required front end software and modules can be installed by running [the installer file](./installer.py) with Python.

> [!CAUTION]
> **GTFR-CG**'s back end is written in **Python 3.11**. It is compatible with later versions, but **not with anterior versions**.  
> You can check your Python version by running `python --version` in your terminal.
</blockquote>

> [!IMPORTANT]
> In order for **GTFR-CG**'s lyrics fetch feature to work, you need to declare a `GENIUS_API_TOKEN` variable in the `.env` file at the root of the repository.  
> Find more information about it by reading through [the tutorial .env file](./server/.env.example).  
> Without this token, the GTFR-CG application will still run, but the lyrics fetch feature will be disabled.

&#xa0;

## :movie_camera: Usage

&nbsp;&nbsp; :clamp:&nbsp; **Build**

``` bash
python installer.py # will install back end modules, front end software & modules !! requires **Python 3.11**
```

&#xa0;

&nbsp;&nbsp; :rocket:&nbsp; **Launch**

**Back end:**

``` bash
cd server/ && python launcher.py # will check needed modules and install, then launch the application
```

**Front end:**

``` bash
cd client/ && npm run dev # will launch the front end of the application
```

&#xa0;

&nbsp;&nbsp; :bookmark_tabs:&nbsp; **General Information**

- By default, the application runs locally on ports [**8000**](http://localhost:8000) (back) and [**4242**](http://localhost:4242) (front).
  - The API's documentation can be accessed @ [**http://localhost:8000/docs**](http://localhost:8000/docs).
- The application features 6 major pages:
  - [x] **Home**: the main page, where your statistics are displayed and you can navigate to **Artwork Generation** and **Lyrics**.
  - [x] **Tests** : the unit tests page, to check the application's integrity.
  - [x] **Artwork Generation**: the page where you can generate artwork from a local file or an iTunes search.
    - [x] **Processed Images**: the page where you can download a background image and a YouTube thumbnail.
  - [x] **Lyrics**: the page where you can fetch lyrics from Genius and convert them to lyrics blocks.
    - [x] **Cards Generation**: the page where cards are generated from the Lyrics text blocks.
- The application features a [toast notification system](https://web.dev/articles/building/a-toast-component) that will give you feedback upon actions.
- Most of the application's back end actions and reactions will be logged in the terminal *via* Python.
  - You can define a minimum severity level in the `.env` file, choosing the logger verbosity's. Check out [`.env.example`](./server/.env.example) for more information.
- Your user statistics are stored at the root of the repository in a file named `stats.json`.
- If you encounter external Python module issues, try running `pip install -r requirements.txt --force-reinstall` for a complete reinstall.

> [!NOTE]
> **Report** any kind of malfunction or **request a feature** by [**opening an issue**](https://github.com/Thomas-Fernandes/GTFR/issues)!

&#xa0;

## :card_file_box: Changelog

Find a detailed changelog in the [CHANGELOG.md](./CHANGELOG.md) file.

- ***[2.0.0]** Coming later...*: **Endgame** — Project will feature automated video edition with AI sync. [#???](#card_file_box-changelog)
- ***[1.6.0]** Coming later...*: **Koh-Lanta** — Project will be unified in an all-in-one application. [#???](#card_file_box-changelog)
- ***[1.5.0]** Coming later...*: **Boost!** — Project will see its existing functionalities sharpened. [#???](#card_file_box-changelog)
- ***[1.4.0]** Sep 17 2024*: **Lyrics Cards** — Project now supports automatic cards generation from text blocks. [#093](https://github.com/Thomas-Fernandes/GTFR-CG/pull/93)
- ***[1.3.0]** Aug 19 2024*: **Lyrics Fetch** — Project now supports lyrics fetching from Genius and their conversion to lyrics blocks. [#089](https://github.com/Thomas-Fernandes/GTFR-CG/pull/89)
- ***[1.2.0]** Jun 27 2024*: **Thumbnails** — Project now supports artwork generation. [#010](https://github.com/Thomas-Fernandes/GTFR/pull/10)
- ***[1.1.0]** Jun 23 2024*: **Welcome** — Project now supports artwork generation from a local file.
  - ***[1.0.1]** Jun 23 2024*: [**@QuentindiMeo**](https://github.com/QuentindiMeo) joins the project. Project starts. [#001](https://github.com/Thomas-Fernandes/GTFR/pull/1)
- ***[1.0.0]** May 09 2024*: **Hello World!** — Project creation.

<br />

[Back to top](#top)
