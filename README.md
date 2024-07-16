<div align="center" id="top">
    <h1>:scroll: Genius Traductions Françaises Content Generator :film_strip:</h1>
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
  <img title="Flask" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files//flask.svg" width="28px" alt="Flask" />
  <img title="HTML" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png" width="28px" alt="HTML" />
  <img title="CSS" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png" width="28px" alt="CSS" />
  <img title="JavaScript" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files//js.svg" width="28px" alt="JS" />
  <!-- <img title="React" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files//react.svg" width="28px" alt="React" /> -->
  <!-- <img title="TypeScript" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png" width="28px" alt="TScript" /> -->
  <img title="GIMP" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files//gimp.svg" width="28px" alt="GIMP" />
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

**GTFR-CG** is a Python web application that generates content serving the creation of [**Genius Traductions Françaises**](https://www.youtube.com/c/geniustraductionsfrancaises) videos.  
Generate artwork and lyrics cards that can then be edited into **translation videos**.  
Save time by interacting with the APIs of **iTunes** and **Genius** to automate parts of the edition process!  
One day, maybe one day, this application maybe even be able to generate whole videos by itself...

**Disclaimer: the creators of this application do not claim any rights on the Genius brand. All rights belong to their respective owners.**

&#xa0;

## :gear: Requirements

This application was tested on and designed for Windows 11 and Ubuntu 22.04.  
All the required Python modules are listed in [the requirements file](./requirements.txt). They will be installed upon launch.

> [!CAUTION]
> **GTFR-CG**'s code is written in **Python 3.10** and is **not** compatible with anterior versions.  
> You can check your Python version by running `python --version` in your terminal.
</blockquote>

> [!IMPORTANT]
> In order for **GTFR-CG**'s lyrics fetch feature to work, you need to define a `GENIUS_API_TOKEN` variable in a file named `.env` at the root of the repository.  
> As you can imagine, you need to assign your Genius API token as its value.  
> Without it, the application will still run, but the lyrics fetch feature will be disabled.

&#xa0;

## :movie_camera: Usage

&nbsp;&nbsp; :rocket:&nbsp; **Build & Launch**

``` bash
pip install -r requirements.txt && # OPTIONAL \
python launcher.py
```

&#xa0;

&nbsp;&nbsp; :bookmark_tabs:&nbsp; **General Information**

- By default, the application runs locally using [**Flask**](https://flask.palletsprojects.com/en/3.0.x/), on port 8000. Access it @ [**http://localhost:8000**](http://localhost:8000).
  - Feel free to tweak this at will.
- The application features 5 main pages:
  - **Home**: the main page, where your statistics are displayed and you can navigate to **Artwork Generation** and **Lyrics**.
  - **Artwork Generation**: the page where you can generate artwork from a local file or an iTunes search.
    - **Processed Images**: the page where you can download a background image and a YouTube thumbnail.
  - **Lyrics**: the page where you can fetch lyrics from Genius and convert them to lyrics blocks.
    - **Cards** (coming soon): the page where cards are generated from text blocks.
- You can navigate between pages using the navigation bar at the top of the page.
- The application features a [toast notification system](https://web.dev/articles/building/a-toast-component) that will give you feedback on your unsuccessful actions.
- Most of the application's actions and reactions will be logged in the terminal, *via* Python.
- Your user statistics are stored at the root of the repository in a file named `stats.json`.
- If you encounter external module issues, try running `pip install -r requirements.txt --force-reinstall` for a complete reinstall.

> [!NOTE]
> Feel free **report** any kind of malfunction or **request a feature** by [**opening an issue**](https://github.com/Thomas-Fernandes/GTFR/issues)!

&#xa0;

## :card_file_box: Changelog

- ***[1.0.0]** May 09 2024*: **Hello World!** — Project creation.
- ***[1.0.1]** Jun 23 2024*: [**@QuentindiMeo**](https://github.com/QuentindiMeo) joins the project. Project starts.
- ***[1.1.0]** Jun 23 2024*: **Welcome** — Project now supports artwork generation from a local file.
- ***[1.1.1]** Jun 24 2024*: Project gets a new visual appearance. [#005](https://github.com/Thomas-Fernandes/GTFR/pull/5)
- ***[1.2.0]** Jun 27 2024*: **Thumbnails** — Project now supports artwork generation from iTunes. [#010](https://github.com/Thomas-Fernandes/GTFR/pull/10)
  - ***[1.2.1]** Jun 29 2024*: Project now generates thumbnails with 9 possible logo positions. [#022](https://github.com/Thomas-Fernandes/GTFR/pull/22)
  - ***[1.2.2]** Jul 04 2024*: Project now has a Python logger, navigation, better GitHub QoL. [#046](https://github.com/Thomas-Fernandes/GTFR/pull/46)
  - ***[1.2.3]** Jul 06 2024*: Project now supports artwork generation without center artwork, has statistics and gets reworked... [#059](https://github.com/Thomas-Fernandes/GTFR/pull/59)
    - routes are reworked and redirection is implemented
    - toasts are implemented as a feedback system of web actions
    - `requirements.txt` and this README are created
  - ***[1.2.4]** Coming July 2024*: Project will support artwork generation from a YouTube link, gets some more reworks. [#???](#card_file_box-changelog)
    - a loading spinner now comes alongside action buttons
    - documentation strings are added to the codebase
    - the artwork generation page is reworked to welcome YT section and better UX
    - the logger system is reinforced to log more actions and be customizable
- ***[1.3.0]** Coming July 2024*: **Lyrics Fetch** — Project will support lyrics fetching from Genius and their conversion to lyrics blocks. [#???](#card_file_box-changelog)
- ***[1.4.0]** Coming later...*: **Lyrics Cards** — Project will support automatic cards generation from text blocks. [#???](#card_file_box-changelog)
- ***[1.5.0]** Coming later...*: **Boost!** — Project will see its existing functionalities sharpened. [#???](#card_file_box-changelog)
- ***[1.6.0]** Coming later...*: **Koh-Lanta** — Project will be unified in an all-in-one application. [#???](#card_file_box-changelog)
- ***[2.0.0]** Coming later...*: **Endgame** — Project will feature automated video edition with AI sync. [#???](#card_file_box-changelog)

<br />

[Back to top](#top)
