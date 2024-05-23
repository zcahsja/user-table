# Installation

run pnpm install

# DATABASE

To setup the postgresSQL database:

- run the start-database.sh script
- run pnpm db:push

If the above is not working, you can instead use the free tier of serverless postgres at neon

- https://neon.tech/
- Sign up and create your database, and paste the provided url into the DATABASE_URL variable inside the .env files
- run pnpm db:push

Alternatively please contact me for a working DATABASE_URL (the one I got from neon!).

# Start

To start the app locally:

- run pnpm dev
