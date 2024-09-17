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
  <!-- <img title="HTML" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png" width="28px" alt="HTML" /> -->
  <!-- <img title="CSS" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png" width="28px" alt="CSS" /> -->
  <!-- <img title="JavaScript" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/js.svg" width="28px" alt="JS" /> -->
  <img title="React.js" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/react.svg" width="28px" alt="React" />
  <img title="Vite" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/vite.svg" width="28px" alt="Vite" />
  <img title="TypeScript" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png" width="28px" alt="TScript" />
  &nbsp;<sup><b>| formerly:</b></sup>&nbsp;
  <img title="GIMP" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/gimp.svg" width="28px" alt="GIMP" />
  <img title="Adobe Premiere Pro" src="https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg" width="28px" alt="Premiere" />

</div>

&#xa0;

<div align="center">
    <a href="#top"><img alt="Python version" src="https://img.shields.io/badge/Python-3.10+-blue?logo=python" /></a>
    <a href="#card_file_box-changelog"><img alt="Last version released" src="https://img.shields.io/badge/release-v1.2.4-blue?logo=windows-terminal" /></a>
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

**GTFR-CG** is a React-Python web application that generates content serving the creation of [**Genius traductions françaises**](https://www.youtube.com/c/geniustraductionsfrancaises) videos.  
Generate artwork and lyrics cards that can then be edited into **translation videos**.  
Save time by interacting with the APIs of **iTunes** and **Genius** to automate parts of the edition process!  
One day, maybe one day, this application maybe even be able to generate whole videos by itself...

**Disclaimer: the creators of this application do not claim any rights on the Genius brand. All rights belong to their respective owners.**

&#xa0;

## :gear: Requirements

This application was tested on, and designed for **Windows 11** and **Ubuntu 22.04**.  
All the required back end modules are listed in [the requirements file](./requirements.txt). They will be installed upon launch of the back end.  
All the required front end software and modules can be installed by running [the installer file](./installer.py) with Python 3.10.

> [!CAUTION]
> **GTFR-CG**'s back end is written in **Python 3.10**. It is compatible with later versions, but **not with anterior versions**.  
> You can check your Python version by running `python --version` in your terminal.
</blockquote>

> [!IMPORTANT]
> In order for **GTFR-CG**'s lyrics fetch feature to work, you need to declare a `GENIUS_API_TOKEN` variable in the `.env` file at the root of the repository.  
> Find more information about it by reading through [the tutorial .env file](./.env.example).  
> Without this token, the GTFR-CG application will still run, but the lyrics fetch feature will be disabled.

&#xa0;

## :movie_camera: Usage

&nbsp;&nbsp; :clamp:&nbsp; **Build**

``` bash
python installer.py # will install back end modules, front end software & modules
```

&#xa0;

&nbsp;&nbsp; :rocket:&nbsp; **Launch**

**Back end:**

``` bash
python launcher.py # will check needed modules and install, then launch the application
```

**Front end:**

``` bash
cd front-end/ && npm run dev # will launch the front end of the application
```

&#xa0;

&nbsp;&nbsp; :bookmark_tabs:&nbsp; **General Information**

- By default, the application runs locally on ports 8000 (back) and 4242 (front). Access it @ [**http://localhost:4242**](http://localhost:4242).
- The application features 6 major pages:
  - [x] **Home**: the main page, where your statistics are displayed and you can navigate to **Artwork Generation** and **Lyrics**.
  - [x] **Tests** : the unit tests page, to check the application's integrity.
  - [x] **Artwork Generation**: the page where you can generate artwork from a local file or an iTunes search.
    - [x] **Processed Images**: the page where you can download a background image and a YouTube thumbnail.
  - [x] **Lyrics**: the page where you can fetch lyrics from Genius and convert them to lyrics blocks.
    - [x] **Cards**: the page where cards are generated from text blocks.
- You can navigate between pages using the navigation buttons at the top of each page.
- The application features a [toast notification system](https://web.dev/articles/building/a-toast-component) that will give you feedback on your unsuccessful actions.
- Most of the application's back end actions and reactions will be logged in the terminal *via* Python.
  - You can define a minimum severity level in the `.env` file, choosing the logger verbosity's. Check out [`.env.example`](./.env.example) for more information.
- Your user statistics are stored at the root of the repository in a file named `stats.json`.
- If you encounter external Python module issues, try running `pip install -r requirements.txt --force-reinstall` for a complete reinstall.

> [!NOTE]
> **Report** any kind of malfunction or **request a feature** by [**opening an issue**](https://github.com/Thomas-Fernandes/GTFR/issues)!

&#xa0;

## :card_file_box: Changelog

- ***[1.0.0]** May 09 2024*: **Hello World!** — Project creation.
  - ***[1.0.1]** Jun 23 2024*: [**@QuentindiMeo**](https://github.com/QuentindiMeo) joins the project. Project starts. [#001](https://github.com/Thomas-Fernandes/GTFR/pull/1)
- ***[1.1.0]** Jun 23 2024*: **Welcome** — Project now supports artwork generation from a local file.
  - ***[1.1.1]** Jun 24 2024*: Project gets a new visual appearance. [#005](https://github.com/Thomas-Fernandes/GTFR/pull/5)
- ***[1.2.0]** Jun 27 2024*: **Thumbnails** — Project now supports artwork generation from iTunes. [#010](https://github.com/Thomas-Fernandes/GTFR/pull/10)
  - ***[1.2.1]** Jun 29 2024*: Project now generates thumbnails with 9 possible logo positions. [#022](https://github.com/Thomas-Fernandes/GTFR/pull/22)
  - ***[1.2.2]** Jul 04 2024*: Project now has a Python logger, navigation, better GitHub QoL. [#046](https://github.com/Thomas-Fernandes/GTFR/pull/46)
  - ***[1.2.3]** Jul 06 2024*: Project now supports artwork generation without center artwork, has statistics and gets reworked... [#059](https://github.com/Thomas-Fernandes/GTFR/pull/59)
    - routes are reworked and redirection is implemented
    - toasts are implemented as a feedback system of web actions
    - `requirements.txt` and this README are created
  - ***[1.2.4]** Jul 20 2024*: Project now supports artwork generation from a YouTube link, gets some more reworks. [#086](https://github.com/Thomas-Fernandes/GTFR-CG/pull/86)
    - a loading spinner now comes alongside action buttons
    - documentation strings are added to the codebase
    - the artwork generation page is reworked to welcome YT section and better UX
    - the logger system is reinforced to log more actions and be customizable
- ***[1.3.0]** Aug 19 2024*: **Lyrics Fetch** — Project now supports lyrics fetching from Genius and their conversion to lyrics blocks. [#089](https://github.com/Thomas-Fernandes/GTFR-CG/pull/89)
  - ***[1.3.1]** Aug 19 2024*: Project's front end is fully migrated to **React Typescript with Vite**. [#088](https://github.com/Thomas-Fernandes/GTFR-CG/pull/88)
  - ***[1.3.2]** Sep 14 2024*: Project now has a unit test page, better .env handling with a tutorial file. [#092](https://github.com/Thomas-Fernandes/GTFR-CG/pull/92)
- ***[1.4.0]** Sep 17 2024*: **Lyrics Cards** — Project now support automatic cards generation from text blocks. [#093](https://github.com/Thomas-Fernandes/GTFR-CG/pull/93)
- ***[1.5.0]** Coming later...*: **Boost!** — Project will see its existing functionalities sharpened. [#???](#card_file_box-changelog)
- ***[1.6.0]** Coming later...*: **Koh-Lanta** — Project will be unified in an all-in-one application. [#???](#card_file_box-changelog)
- ***[2.0.0]** Coming later...*: **Endgame** — Project will feature automated video edition with AI sync. [#???](#card_file_box-changelog)

<br />

[Back to top](#top)
