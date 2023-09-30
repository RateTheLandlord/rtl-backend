# Rate The Landlord

A simple website for Renter's to rate their Landlord

## Getting Started

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) Installed

Copy the `.env.example` in a new `.env` file.

Set the environment to `development`

Then run the following commands:

- Install Packages `npm i`

- Start `docker-compose -f docker-compose.dev.yml up -d --build`

The project should not be running at `http://localhost` and pick up changes you make in you IDE

This will also create a Postgres DB for you to use for develop

## View API Documentation

`npm run documentation:serve`

You can now view the generated documentation at `localhost:3500`

## Load the Database with Dummy Reviews

Make sure your docker environment is running.

- Get the `CONTAINER ID` of the postgres container with the command `docker ps`
- Make sure the permissions are set correctly with `sudo chmod +x load-database.sh`
- Run the script with command `./load-database.sh`
- You will be prompted for the `CONTAINER ID`, postgres username (this is set in your `.env` file, and the number of rows you wish to populate)

Your database should now be loaded. Run this command as much as your wish.

## Troubleshooting

#### Captcha Not Working

If you are trying to submit a review locally, you need to edit your hosts file to allow Captcha to work. Follow These guides:

- [Hcaptcha Local Development](https://docs.hcaptcha.com/#local-development)

- [Editing a Hosts file on Windows](https://techcult.com/fix-access-denied-when-editing-hosts-file/#:~:text=In%20order%20to%20fix%20Access%20denied%20when%20editing,3.In%20the%20attribute%20section%2C%20uncheck%20the%20Read-only%20box.)

#### ESLint Parsing Error with JetBrains IDE in WSL

- [How to use WSL development environment in WebStorm](https://www.jetbrains.com/help/webstorm/how-to-use-wsl-development-environment-in-product.html)

#### Unable to Commit

This project uses Husky to run a pre-commit check to make sure the project passes tests and linting. It also formats the files to prettier standard we have set.

If it fails, then there is a chance that your changes have linting errors, or broke some tests.

You may get this error: `/usr/bin/env: ‘sh\r’: No such file or directory`

If you encounter this error, you'll need to install `dos2unix` in your terminal. Then run `sudo dos2unix .husky/pre-commit`.

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.
