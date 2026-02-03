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

### Linting and Formatting

To check for code quality and formatting issues:

```sh
# Run ESLint
pnpm lint

# Run Prettier to format the code
pnpm format
```

## Architecture Deep Dive

### Routing System

The project utilizes `vue-router` with a module-based approach for scalability.

1.  **Module-based Routes**: Routes are defined within their respective feature modules in the `src/modules` directory. Each module can have its own routing file that exports an array of route definitions.
2.  **Centralized Registration**: The main router file, [`src/router/index.ts`](src/router/index.ts), dynamically imports and consolidates routes from all modules.
3.  **Navigation Guards**: Route guards are implemented to handle authentication and authorization. Before a user can access a protected route, these guards verify their session and permissions.

### Data Fetching with TanStack Query

The application employs a robust data fetching strategy using `TanStack Query` (`@tanstack/vue-query`) on top of a service layer.

1.  **Service Layer (`src/services`)**: This layer abstracts all API communications. Each function in this layer is responsible for a single API endpoint, typically returning a `Promise` with the response data. This keeps API logic decoupled from the UI.

    ```typescript
    // Example: src/services/userService.ts
    import apiClient from './apiClient';

    export const getUsers = (params) => {
      return apiClient.get('/users', { params });
    };
    ```

2.  **TanStack Query Integration**: In Vue components, we use hooks from `@tanstack/vue-query` to interact with the service layer. This provides caching, automatic refetching, and streamlined state management (loading, error, success).

    ```vue
    <!-- Example: src/views/UsersView.vue -->
    <script setup lang="ts">
    import { useQuery } from '@tanstack/vue-query';
    import { getUsers } from '@/services/userService';

    const { data: users, isLoading, isError } = useQuery({
      queryKey: ['users'],
      queryFn: () => getUsers(),
    });
    </script>
    ```

### Reusable DataTable Component

To ensure consistency and reduce boilerplate, the project includes a `DataTable.vue` component that wraps `TanStack Table` (`@tanstack/vue-table`).

1.  **Abstraction**: `DataTable.vue` provides a high-level interface for creating powerful and feature-rich tables.
2.  **Core Props**:
    *   `data`: An array of objects to be displayed in the table.
    *   `columns`: An array defining the table columns, including headers, accessor keys, and custom cell rendering.
3.  **Features**: The component is pre-configured to support common table features out-of-the-box:
    *   **Sorting**: Click on column headers to sort.
    *   **Filtering**: A global filter input is often included via a `toolbar` slot.
    *   **Pagination**: Controls for navigating through pages of data.
    *   **Row Selection**: Checkboxes for selecting rows.
4.  **Customization with Slots**: `DataTable.vue` uses slots to allow for extensive customization without modifying the base component.
    *   `#toolbar`: Allows injecting custom controls like filter inputs, action buttons (e.g., "Add New User"), and data export options.
    *   `#cell-{columnId}`: A dynamic slot to provide a completely custom template for rendering cells in a specific column.

    ```vue
    <!-- Example Usage of DataTable.vue -->
    <DataTable :data="users" :columns="userColumns">
      <template #toolbar="{ table }">
        <!-- Custom filter input and action buttons -->
      </template>
      <template #cell-actions="{ row }">
        <!-- Custom dropdown menu for each row -->
      </template>
    </DataTable>
    ```