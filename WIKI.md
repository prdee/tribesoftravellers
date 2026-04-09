# The Tribes of Travellers - Code Wiki Documentation

Welcome to the developer documentation for **The Tribes of Travellers**. This project is a modern, responsive Single Page Application (SPA) for a travel agency, allowing users to explore destinations, view tour packages, and read travel guides.

---

## 1. Overall Project Architecture

The project follows a standard modern frontend architecture using React and Vite. It is designed to be completely static and deployable to any static hosting service (like AWS S3 + CloudFront).

*   **Framework:** React 19 (SPA) powered by Vite.
*   **Language:** TypeScript for static typing and robust developer experience.
*   **Styling:** Tailwind CSS for utility-first styling, customized with a specific theme.
*   **UI Components:** Built using **shadcn/ui**, which leverages Radix UI primitives for accessibility and Tailwind for styling.
*   **Routing:** Client-side routing managed by `react-router-dom`.
*   **Data Layer:** Currently, the application uses static mock data (JSON/TypeScript objects) stored in the frontend codebase, eliminating the immediate need for a backend API.
*   **Deployment:** Automated via custom Bash scripts (`deploy.sh` and `redeploy.sh`) targeting AWS S3 and CloudFront.

---

## 2. Responsibilities of Major Modules

The codebase is organized into several key directories under `src/`, each with a specific responsibility:

*   **`src/components/ui/`**: Contains atomic, reusable UI components (e.g., `Button`, `Card`, `Dialog`, `Input`). These are mostly generated via shadcn/ui and should remain highly generic.
*   **`src/components/`**: Contains larger, composite components that build up the application's layout and features, such as `Header.tsx`, `Footer.tsx`, `Layout.tsx`, `ChatWidget.tsx`, and `LeadPopup.tsx`.
*   **`src/pages/`**: Houses the top-level route views. Each file represents a specific page in the application (e.g., `HomePage.tsx`, `DestinationPage.tsx`, `TourPackagesPage.tsx`, `ContactPage.tsx`).
*   **`src/data/`**: The data layer of the application. `destinations.ts` acts as a mock database containing arrays of destinations, travel packages, testimonials, and blog posts.
*   **`src/hooks/`**: Contains custom React hooks for reusable logic (e.g., `use-mobile.ts` for responsive breakpoints).
*   **`src/lib/`**: Utility functions and helpers. Notably, `utils.ts` contains the `cn` function for conditionally merging Tailwind classes using `clsx` and `tailwind-merge`.
*   **Root Scripts (`deploy.sh`, `redeploy.sh`)**: Shell scripts that handle building the Vite project, creating an AWS S3 bucket (if needed), configuring public access blocks, and syncing the `dist/` directory to S3.

---

## 3. Key Classes and Functions

### Core Components
*   **`App` ([`src/App.tsx`](./src/App.tsx))**: The root component. It initializes the React Router, defines all application routes (`<Route>`), and wraps them in the `<Layout>` component. It also orchestrates delayed global UI elements like the `ChatWidget` and `LeadPopup` using `useEffect` timeouts.
*   **`Layout` ([`src/components/Layout.tsx`](./src/components/Layout.tsx))**: A wrapper component that provides the consistent page structure (Header → Main Content → Footer). It listens to route changes to automatically scroll the user to the top of the page.
*   **`HomePage` ([`src/pages/HomePage.tsx`](./src/pages/HomePage.tsx))**: The primary landing page. It manages complex local state for search filters, active tabs, and testimonials. It also uses an `IntersectionObserver` to trigger scroll-based reveal animations.

### Data Helpers ([`src/data/destinations.ts`](./src/data/destinations.ts))
*   **`getDestinationsByType(type: string)`**: Filters and returns destinations that match a specific theme (e.g., 'honeymoon', 'family', 'adventure').
*   **`getDestinationBySlug(slug: string)`**: Retrieves a single destination object by its URL-friendly slug.
*   **`findDestinationByValue(value: string)`**: Normalizes the input string and searches for a destination by either its name or its slug, returning the match.
*   **`getPackagesByDestination(destinationValue: string)`**: Returns all tour packages associated with a specific destination.

---

## 4. Dependency Relationships

The project relies on a carefully selected stack of modern frontend tools:

*   **Core**: `react` (^19.2.0), `react-dom`
*   **Routing**: `react-router-dom` for SPA navigation.
*   **Styling**: `tailwindcss`, `postcss`, `autoprefixer`. Utility class merging is handled by `clsx` and `tailwind-merge`.
*   **UI Primitives**: `@radix-ui/react-*` libraries provide unstyled, accessible components that are styled via Tailwind in the `src/components/ui/` folder.
*   **Icons**: `lucide-react` provides the SVG icon set used throughout the application.
*   **Forms & State**: `react-hook-form` paired with `@hookform/resolvers` and `zod` for schema-based form validation.
*   **Miscellaneous Utilities**: 
    *   `date-fns` for date manipulation.
    *   `embla-carousel-react` for smooth image/testimonial sliders.
    *   `sonner` for toast notifications.

---

## 5. Instructions for Running the Project

### Prerequisites
*   **Node.js** (v20+ recommended)
*   **npm** (comes with Node.js)
*   **AWS CLI** (only required for deployment)

### Local Development
1.  **Install Dependencies:**
    Navigate to the project root and install the required packages:
    ```bash
    npm install
    ```
2.  **Start the Development Server:**
    Run Vite's local dev server with Hot Module Replacement (HMR):
    ```bash
    npm run dev
    ```
3.  **View the App:**
    Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

### Building for Production
To create a production-ready build:
```bash
npm run build
```
This will compile the TypeScript code and bundle the assets into the `dist/` directory. You can preview this build locally using:
```bash
npm run preview
```

### Deployment to AWS S3
The project includes automated scripts to deploy the `dist/` folder to AWS S3.
1.  Create a `.env` file in the root directory (you can copy `.env.example` if it exists) and set your AWS variables:
    ```env
    AWS_REGION=your-aws-region
    S3_BUCKET_NAME=your-bucket-name
    ```
2.  Ensure your AWS CLI is authenticated (`aws configure`).
3.  **First-time Deployment:**
    ```bash
    npm run deploy:s3:init
    ```
    This script (`deploy.sh`) builds the app, creates the S3 bucket, configures security policies, and uploads the files.
4.  **Subsequent Deployments:**
    ```bash
    npm run deploy:s3
    ```
    This script (`redeploy.sh`) updates the S3 bucket and optionally invalidates the CloudFront cache.
