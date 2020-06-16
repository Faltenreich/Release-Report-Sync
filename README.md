# Release-Report-Sync

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip) [![License](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Release Report Sync synchronizes metadata for [Release Report](https://github.com/Faltenreich/Release-Report).

## Development

Parse Sync requests data from multiple endpoints. Every endpoint requires an API Key for authentication purposes which must be request in advance. Currently following APIs are used:

* [The Movie Database (TMDb) API](https://developers.themoviedb.org): Offers metadata for upcoming movies
* <i>TBD: Offers metadata for upcoming music albums</i>
* [IGDB: Video Game Database API](https://www.igdb.com/api): Offers metadata for upcoming video games

This data is then merged at the backend into one single database. Parse Server is used as Mobile Backend as a Service and therefor MongoDB as database. Therefor either a self-hosted or third party instance of Parse Server is crucial in order to continue.

#### Setup

1. Create a database with following classes: <TODO: Scheme migration possible?>
2. Clone or fork this repository
3. Create config.json in the root directory with following content:

    ```json
    {
        "parseServer": {
            "serverUrl": "<Parse API Address>",
            "applicationId": "<App Id>",
            "javascriptKey": "<Javascript Key>",
            "masterKey": "<Master Key>"
        },
        "igdb": {
            "serverUrl": "https://api-v3.igdb.com",
            "apiKey": "<API Key for IGDB>",
            "pageSize": 50
        },
        "movieDb": {
            "serverUrl": "https://api.themoviedb.org/3",
            "apiKey": "<API Key for TMDb>"
        }
    }
    ```

4. Deploy cloud code
5. Schedule Background Job which executes cloud code regularly

#### Deployment

1. Deploy via command-line (e.g. to Back4App.com)
2. Setup project: b4a new
3. Push code: b4a deploy

#### Third-party licenses

This software uses following technologies with great appreciation:

* [IGDB: Video Game Database API](https://www.igdb.com/api)
* [The Movie Database (TMDb) API](https://developers.themoviedb.org)
* [Parse SDK for JavaScript](https://github.com/parse-community/Parse-SDK-JS)

These dependencies are bundled under the terms of their respective license.

## Legal

#### Redistribution

Additionally to the permissions, conditions and limitations of the GPLv3, the permission for redistribution must be manually requested in advance. This ensures that neither the original software or any fork will be affected negatively by terms and conditions like the [Google Play Developer Distribution Agreement](https://play.google.com/about/developer-distribution-agreement.html). If you plan to redistribute this software, please contact the maintainer at [philipp.fahlteich@gmail.com](mailto:philipp.fahlteich@gmail.com).

#### License

    Copyright (C) 2020 Philipp Fahlteich

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
