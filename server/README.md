<div align="center" id="top">
  <h1>:scroll: GTFR-CG / Back end :film_strip:</h1>
</div>

<div align="center">
  <a href="https://github.com/Thomas-Fernandes/GTFR-CG/blob/develop/README.md">Main README</a> &#xa0; | &#xa0;
  <a href="https://github.com/Thomas-Fernandes/GTFR-CG/blob/develop/client/README.md">Front end README</a>
</div>

&#xa0;

<div align="center">
  <sup><b>powered by:</b></sup>

  <img title="Flask" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/flask.svg" width="28px" alt="Flask" />
  <img title="Pillow" src="https://cdn.fosstodon.org/accounts/avatars/109/325/533/008/309/323/original/6fe5f3db3360b8ff.png" width="28px" alt="PIL" />
  <img title="Genius API" src="https://images.genius.com/086f5809e96b133dd536982629e5844b.300x300x1.png" width="28px" alt="Genius API" />
  <img title="Flask-Restx" src="https://avatars.githubusercontent.com/u/59693083?v=4" width="28px" alt="Flask-Restx" />
  <img title="Swagger" src="https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/icons/files/swagger.svg" width="28px" alt="Swagger" />
  <a href="#top"><img alt="Python version" src="https://img.shields.io/badge/Python-3.11+-blue?logo=python" width="128px" /></a>
</div>

&#xa0;

## :memo: Quick Description

The back end of **GTFR-CG** allows you to generate content and expose the API endpoints triggering back room operations.  
It is also the backbone of the application, where all the complex operations are completed; our discreet powerhouse.  
Discreet, yet verbose: the back end logs all actions and reactions in the terminal, and stores your user statistics.  
All of the exposed routes are documented in the Swagger documentation, as well as the data models and the expected responses.

&#xa0;

## :gear: Requirements

All the required back end modules are listed in [the requirements file](./requirements.txt). They will be installed upon launch.  
All the required front end software and modules can be installed by running [the installer file](https://github.com/Thomas-Fernandes/GTFR-CG/blob/develop/installer.py) with Python.

> [!CAUTION]
> **GTFR-CG**'s back end is written in **Python 3.11**. It is compatible with later versions, but **not with anterior versions**.  
> You can check your Python version by running `python --version` in your terminal.
</blockquote>

> [!IMPORTANT]
> In order for **GTFR-CG**'s lyrics fetch feature to work, you need to declare a `GENIUS_API_TOKEN` variable in the `.env` file [here](./).  
> Find more information about it by reading through [the tutorial .env file](./.env.example).  
> Without this token, the GTFR-CG application will still run, but the lyrics fetch feature will be disabled.

&#xa0;

## :movie_camera: Usage

&nbsp;&nbsp; :clamp:&nbsp; **Build**

``` bash
python ../installer.py # will install back end modules !! requires **Python 3.11**
```

&#xa0;

&nbsp;&nbsp; :rocket:&nbsp; **Launch**

``` bash
python launcher.py # will launch the back end of the application
```

&#xa0;

&nbsp;&nbsp; :bookmark_tabs:&nbsp; **General Information**

- By default, the back end runs locally on port [**8000**](http://localhost:8000). Edit [the code](./src/app.py) to change that.
  - The API's Swagger documentation can be accessed @ [**http://localhost:8000/docs**](http://localhost:8000/docs).
- The server features a logger that displays the ongoing actions and reactions in the terminal *via* Python.
  - You can choose a severity level for the logger in the `.env` file. Check out [`.env.example`](./.env.example) for more information.
- Your user statistics are stored here, @ `stats.json`.
- If you encounter issues with external Python modules, try running `pip install -r requirements.txt --force-reinstall` for a complete reinstall.

> [!NOTE]
> **Report a malfunction** or **request a feature** by [**opening an issue**](https://github.com/Thomas-Fernandes/GTFR/issues)!

&#xa0;

## :pager: Codebase segments

:file_folder: [***./***](https://github.com/Thomas-Fernandes/GTFR-CG/tree/develop/server) : the root folder, where the main configuration files and the stats file are located  
:file_folder: [***./assets/***](https://github.com/Thomas-Fernandes/GTFR-CG/tree/develop/server/assets) : where the fonts and images needed for generation are stored  
:file_folder: [***./src/***](https://github.com/Thomas-Fernandes/GTFR-CG/tree/develop/server/src) : where the generic application logic is defined  
:file_folder: [***./src/constants/***](https://github.com/Thomas-Fernandes/GTFR-CG/tree/develop/server/src/constants) : where the application's constants are defined  
:file_folder: [***./src/routes/***](https://github.com/Thomas-Fernandes/GTFR-CG/tree/develop/server/src/routes) : where the API routes and their logic are defined  
:file_folder: [***./src/utils/***](https://github.com/Thomas-Fernandes/GTFR-CG/tree/develop/server/src/utils) : where the utility functions are defined

<br />

[Back to top](#top)