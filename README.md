<div align="center" id="top">
  <h1>:scroll: Genius traductions françaises Content Generator :film_strip:</h1>
</div>

<div align="center">
  <a href="#memo-description">Description</a> &#xa0; | &#xa0;
  <a href="#gear-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#movie_camera-usage--general-information">Usage & General Information</a> &#xa0; | &#xa0;
  <a href="#card_file_box-project-roadmap">Project Roadmap</a>
</div>

&#xa0;

<div align="center">
  <a href="#card_file_box-changelog"><img alt="Python version" src="https://img.shields.io/badge/Python-3.11+-blue?logo=python" /></a>
  <a href="#card_file_box-changelog"><img alt="Last version released" src="https://img.shields.io/badge/release-v1.5.1-blue?logo=semver" /></a>
  <a href="https://github.com/Thomas-Fernandes/GTFR/commits/main"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Thomas-Fernandes/GTFR?color=blueviolet&logo=clarifai" /></a>
</div>
<div align="center">
  <a href="https://github.com/Thomas-Fernandes/GTFR/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/Thomas-Fernandes/GTFR?color=yellow&logo=github" /></a>
  <a href="https://github.com/Thomas-Fernandes/GTFR/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/Thomas-Fernandes/GTFR?color=forestgreen&logo=target" /></a>
  <a href="https://github.com/Thomas-Fernandes/GTFR/graphs/contributors"><img alt="GitHub contributors" src="https://img.shields.io/github/contributors/Thomas-Fernandes/GTFR?color=red&logo=stackedit" /></a>
  <a href="#card_file_box-changelog"><img alt="GitHub repository size" src="https://img.shields.io/github/languages/code-size/Thomas-Fernandes/GTFR?color=blue&logo=frontify" /></a>
</div>

&#xa0;

<div align="center">
  <sup><b>The technical stack at play:</b></sup>

  <img title="Python" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1028px-Python-logo-notext.svg.png" height="24px" alt="Python" />
  <img title="Flask" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/flask.svg" height="24px" alt="Flask" />
  <img title="TypeScript" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/typeScript.svg" height="24px" alt="TypeScript" />
  <img title="React.js" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/react.svg" height="24px" alt="React" />
  <img title="Tailwind" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/tailwindcss.svg" height="24px" alt="Tailwind" />
  <img title="Vite" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/vite.svg" height="24px" alt="Vite" />
  &nbsp;<sup><b>| formerly:</b></sup>&nbsp;
  <img title="GIMP" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/gimp.svg" height="24px" alt="GIMP" />
  <img title="sgnarly.me" src="https://www.svgrepo.com/show/504384/genius.svg" height="24px" alt="sgnarly" />
  <img title="Adobe Premiere Pro" src="https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg" height="24px" alt="PremierePro" />
</div>

&#xa0;

## :memo: Description

**GTFR-CG** is a React-Python web application that generates content serving the creation and publication of [**Genius traductions françaises**](https://www.youtube.com/c/geniustraductionsfrancaises) YouTube videos.

- Generate artwork, lyrics cards and YouTube descriptions that can then be edited into **translation videos**.  
- Save time by interacting with the APIs of **iTunes** and **Genius** to automate parts of the edition process!  
- One day, maybe one day, this application maybe even be able to generate whole videos by itself...

<a href="https://github.com/QuentindiMeo"><img src="https://i.imgur.com/w8SH3M7.png" alt="qdm" width="100" align="right" /></a><a href="https://github.com/Thomas-Fernandes"><img src="https://i.imgur.com/MsvdW4y.png" alt="tf" width="100" align="right" /></a>
The application was thought, designed, programmed and crafted by Frenchmen 🇫🇷 [**@Thomas-Fernandes**](https://github.com/Thomas-Fernandes) and [**@QuentindiMeo**](https://github.com/QuentindiMeo).

The application's interfaces are localized in **English** and **French**, and are designed to be easily extensible to other languages.

**Disclaimer: the creators of this application do not claim any rights on the brands at play. All rights belong to their respective owners.**

&#xa0;

## :gear: Requirements

This application was tested on, and designed for **Windows 11** and **Ubuntu 22.04**.  

> [!CAUTION]
> **GTFR-CG**'s back end is written in **Python 3.11**. It is compatible with later versions, but **not with anterior versions**.  
> You can check your Python version by running `python --version` in your terminal.
</blockquote>

> [!IMPORTANT]
> In order for **GTFR-CG**'s lyrics fetch feature to work, you need to declare a `GENIUS_API_TOKEN` variable in the `.env` file at the root of the server.  
> Find more information about it by reading through [the tutorial .env file](./server/.env.example).  
> Without this token, the GTFR-CG application will still run, but the lyrics fetch feature will be disabled.

&#xa0;

## :movie_camera: Usage & General Information

<h1 align="center">
  <a href="./client#readme">Front</a> &#xa0; | &#xa0; <a href="./server#readme">Back</a>
</h1>

> [!NOTE]
> **Report** any kind of malfunction or **request a feature** by [**opening an issue**](https://github.com/Thomas-Fernandes/GTFR/issues)!

&#xa0;

## :card_file_box: Project Roadmap

Find detailed versioning in the [CHANGELOG.md](./CHANGELOG.md) file.

- ***[2.0.0]** Coming later...*: **Endgame** — Project will feature automated video edition with AI sync. [#???](#card_file_box-changelog)
- ***[1.6.0]** Coming later...*: **Koh-Lanta** — Project will be unified in an all-in-one application. [#???](#card_file_box-changelog)
- ***[1.5.0]** Nov 16 2024*: **Boost!** — Project sees its existing codebase, functionalities and looks sharpened. [#155](https://github.com/Thomas-Fernandes/GTFR-CG/pull/155)
- ***[1.4.0]** Sep 17 2024*: **Lyrics Cards** — Project supports automated cards generation from text blocks. [#093](https://github.com/Thomas-Fernandes/GTFR-CG/pull/93)
- ***[1.3.0]** Aug 19 2024*: **Lyrics Fetch** — Project supports lyrics fetching and converts them to lyrics blocks. [#089](https://github.com/Thomas-Fernandes/GTFR-CG/pull/89)
- ***[1.2.0]** Jun 27 2024*: **Thumbnails** — Project supports artwork generation. [#010](https://github.com/Thomas-Fernandes/GTFR/pull/10)
- ***[1.1.0]** Jun 23 2024*: **Welcome** — Project supports artwork generation from a local file. [#001](https://github.com/Thomas-Fernandes/GTFR/pull/1)
- ***[1.0.0]** May 09 2024*: **Hello World!** — Project ideation, artwork generation drafting.

<br />

[Back to top](#top)
