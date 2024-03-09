<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Run in Development
1. Clone the repository
2. Execute
```bash
yarn install
```
3. Should have Nest CLI installed
```
npm i -g @nestjs/cli
```
4. Build up the Database
```
docker-compose up -d
```
4. Rebuild the database with seed thought API
```
/api/v2/seed
```
5. Clone __.env.template__ file and rename copty to __.env__

5. populate env variables in ```.env``` file

## Production Build
1. Create file ```.env.prod```
2. Fill production environment variables

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
## Stack used
* Mongo DB
* Nest
