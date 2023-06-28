# teacher-management-app

USTC 2023 Database course Lab3.

![entity–relationship model](https://user-images.githubusercontent.com/77669094/248526333-31789e8e-cef5-4966-a87f-ddf79457fde1.png)

## demo

Query projects:

![projects](https://user-images.githubusercontent.com/77669094/249523361-c01acb41-4fe8-400f-b62e-2f222ea5d717.png)

Query classes:

![teach_classes](https://user-images.githubusercontent.com/77669094/249523538-74e20213-1dbe-475f-a3be-69b8e301d33f.png)

Query teachers:

![teacher_info](https://user-images.githubusercontent.com/77669094/249523198-13b170a3-ec3d-43f6-9cc6-916513abcf4a.png)

This project created by running `pnpm create sidebase@latest`. For more information, check [sidebase merino](https://sidebase.io).

This project uses the following technologies for a great developer- and user-experience:

-   [TypeScript](https://www.typescriptlang.org/)
-   [Nuxt 3](https://nuxt.com)
-   Prisma ORM
-   Tailwind CSS
-   Naive UI

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

You need a mysql server running on your machine. You can use docker to start one:

```bash
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=teacher_db -e MYSQL_USER=user -e MYSQL_PASSWORD=password -p 3306:3306 -d mysql:latest
```

Then, create `.env` file like this:

```bash
# Prisma
DATABASE_URL=mysql://user:password@localhost:3306/teacher_db
```

Start the development server on http://localhost:3000

```bash
pnpm run dev
```

## Production

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run preview
```
