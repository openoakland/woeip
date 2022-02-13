## Operating Systems
`WSL Ubuntu based install is verified`

`Ubuntu linux should be the same instructions`

`Mac instructions are unverified`

`Standard Windows is unsupported.`

## Database setup
[PostGIS Installation](https://postgis.net/install/)
- OSX: 
    - [Postgres.app](https://postgresapp.com/)
    - [Homebrew](https://brew.sh/) `brew install postgis`
- Ubuntu WSL/Linux
    - [Apt Wiki](https://wiki.postgresql.org/wiki/Apt)
    - [Computing for Geeks](https://computingforgeeks.com/how-to-install-postgis-on-ubuntu-linux/)
    - `sudo apt install curl ca-certificates gnupg`
    - ```wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
  sudo apt-key add -```
    - ```echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list```
    - `sudo apt update`
    - `sudo apt install postgis postgresql-13-postgis-3`
    - `sudo pg_ctlcluster 13 main start`
# Add GIS extenstion to Postgres Database
- `sudo -i -u postgres`
- `createuser woaq_user`
- `createdb woaq_db -O woaq_user`
- `psql`
- `\c woaq_db`
- `CREATE EXTENSION postgis;`
- `SELECT PostGIS_version();`

## API Setup
- python 3.9
- `sudo apt install software-properties-common`
- `sudo add-apt-repository ppa:deadsnakes/ppa`
- `sudo apt install python3.9`
- `sudo apt install python3.9-venv binfmt-support`
- `python3.9 -m venv woaq-api`
- `source woaq-api/bin/activate` (assuming bash shell)
- `pip `


- GUnicorn (Green Unicorn)
- Pyenv
- Django

## 