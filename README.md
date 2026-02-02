# Project Title

A modern web application built with Vue.js, Vite, and TypeScript. This project is set up with a focus on best practices, including robust tooling for linting, formatting, and a scalable folder structure.

## Tech Stack

-   **Framework**: [Vue.js](https://vuejs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom theming for light/dark modes.
-   **Routing**: [Vue Router](https://router.vuejs.org/) (inferred from `src/router`)
-   **State Management**: [Pinia](https://pinia.vuejs.org/) (inferred from `src/stores`)
-   **Internationalization**: [Vue I18n](https://vue-i18n.intlify.dev/) (inferred from `src/i18n`)
-   **Package Manager**: [pnpm](https://pnpm.io/)
-   **Linting & Formatting**:
    -   [ESLint](https://eslint.org/)
    -   [Prettier](https://prettier.io/)
    -   [oxlint](https://oxc-project.github.io/docs/guide/linter.html)

## Folder Structure

The project follows a structured and scalable directory layout.

```
.
├── public/              # Static assets that are not processed by Vite
├── src/                 # Main application source code
│   ├── assets/          # CSS, fonts, images
│   ├── common/          # Common utilities, hooks, or constants
│   ├── components/      # Reusable Vue components
│   ├── configs/         # Application configuration files
│   ├── i18n/            # Internationalization locales and setup
│   ├── lib/             # Third-party libraries or internal library code
│   ├── modules/         # Feature-based modules
│   ├── router/          # Vue Router configuration
│   ├── services/        # API calls and other external services
│   ├── stores/          # Pinia state management stores
│   ├── views/           # Page-level components (routed views)
│   ├── App.vue          # Root Vue component
│   └── main.ts          # Application entry point
├── package.json         # Project dependencies and scripts
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [pnpm](https://pnpm.io/installation)

### Installation

1.  Clone the repository:
    ```sh
    git clone <repository-url>
    cd <project-directory>
    ```

2.  Install the dependencies using pnpm:
    ```sh
    pnpm install
    ```

### Running the Development Server

To start the local development server with hot-reloading:

```sh
pnpm dev
```

The application will be available at `http://localhost:5173` by default.

### Building for Production

To create a production-ready build of the application:

```sh
pnpm build
```

The output files will be generated in the `dist/` directory.

### Linting and Formatting

To check for code quality and formatting issues:

```sh
# Run ESLint
pnpm lint

# Run Prettier to format the code
pnpm format
```