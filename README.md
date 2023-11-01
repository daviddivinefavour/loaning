# Loaning
  A simulation of how the backend service for loaning systems work.


## Getting Started

- Clone the repository to your local machine.

```sh
git clone [git@github.com:daviddivinefavour/loaning.git](https://github.com/daviddivinefavour/loaning.git)
```

- Change directory to the cloned repository.

```sh
cd loaning
```

- Install any necessary dependencies by running the `npm install` command in your terminal.

```sh
npm install
```

- Copy environment variables from .env.example to new .env file, and fill the credentials with data of your choice.

```sh
cp .env.example .env
```

- If this is being run locally, then after filling the details in the env file, next thing that should be done would be to run migrations for the database.

```sh
npm run migrate:latest
```

- Start the server locally using

```sh
npm start
```


## Usage

Documentation on how to play around the API's can be found in the published API [documentation](https://documenter.getpostman.com/view/18859386/VUqmvf1K)
