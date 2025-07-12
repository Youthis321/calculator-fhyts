<center><img height="150" src="./public/images/icon.png" /></center>

# FhyTS

FhyTS is a lightweight, modular, and flexible TypeScript-based web framework. With its clean architecture, dependency injection support, middleware, and simple routing, FhyTS is suitable for small to large-scale web applications. See full [documentation](https://fhyts.fhylabs.com).

#  Recomended Requirements

* Node.js v22 or higher
* TypeScript v5 or higher
* A configured tsconfig.json file (recommended)

## Installation

To start using **FhyTS** in your project, simply install it via NPM:

```bash
npm install fhyts
```

## Create Starter App

If you want to quickly scaffold a new project with FhyTS and best practices pre-configured (TypeScript, routing, DI, etc), use the starter CLI:

```bash
npm create fhyts-app@latest
```

Then navigate into your new project folder:

```bash
npm install
npm start
```

#### Alternatively, you can also start by cloning the starter repository directly via git:

```bash
git clone https://github.com/fitri-hy/fhyts.git my-app
cd my-app
npm install
npm start
```

> This CLI is the recommended way to start a new FhyTS project with zero configuration.

## Folder Structure Recommendations

```
my-app/
├── app/
│   ├── controllers/        # Controller app
│   ├── middlewares/        # Middleware app
│   ├── models/             # Model app
│   ├── services/           # Service app
│   ├── views/              # Template views (.ejs)
│   │   ├── layouts/        # Layout templates
│   │   ├── partials/       # Partial templates
│   │   └── home.ejs        # Home page
│   └── routes.ts           # Route registrasi app
│
├── config/                 # Config files
│   └── App.Config.json
│
├── public/                 # Static assets (css, js, images)
│
├── app.ts                  # Entry point
├── package.json            # Project configuration and npm dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md
```