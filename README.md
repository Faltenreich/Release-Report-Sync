# Release-Report-Sync

[![License](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Release Report Sync synchronizes metadata for [Release Report](https://github.com/Faltenreich/Release-Report).

## Development

#### Setup

Release Report uses Parse Server as Mobile Backend as a Service (MBaaS). Therefor either a self-hosted or third party instance of Parse Server is crucial in order to continue.

###### Database

1. Create a database with following classes: <TODO: Scheme migration possible?>

###### Cloud Code

1. Clone or fork this repository
2. Create config.json in the root directory with following content from the Parse Server Core Settings:

    ```json
    {
        "parseServer": {
            "serverUrl": "<Parse API Address>",
            "applicationId": "<App Id>",
            "javascriptKey": "<Javascript Key>",
            "masterKey": "<Master Key>"
        }
    }
    ```

3. Deploy repository as Cloud Code

###### Job

1. Schedule Background Job which executes script regularly

#### Third-party licenses

This software uses following technologies with great appreciation:

* [IGDB: Video Game Database API](https://www.igdb.com/api): Offers metadata for upcoming video games
* [The Movie Database (TMDb) API](https://developers.themoviedb.org): Offers metadata for upcoming movies
* [TBD]: Offers metadata for upcoming music

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
