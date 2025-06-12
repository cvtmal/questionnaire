# Questionnaire Management System

A modern web application for managing and viewing questionnaire submissions. Built with Laravel and React, this application provides a clean interface for tracking and analyzing questionnaire data.

## Features

- **Questionnaire Overview**: View key statistics including total questionnaires and submissions this month
- **Advanced Data Table**: Sort, filter, and paginate questionnaire submissions
- **Search Functionality**: Search by ID or applicant name
- **Detailed Views**: Click on job titles to see comprehensive submission details
- **Responsive Design**: Works smoothly on various screen sizes

## Tech Stack

### Backend
- **Laravel 12**: PHP framework for robust backend development
- **MySQL**: Database for storing questionnaire submissions

### Frontend
- **React**: For building the user interface components
- **TypeScript**: Type-safe JavaScript for frontend development
- **Inertia.js**: For connecting Laravel with React
- **shadcn/ui**: Component library for consistent and beautiful UI

## Installation

### Prerequisites
- PHP 8.3 or higher
- Composer
- Node.js and npm
- MySQL

### Setup Steps

1. Clone the repository:
   ```
   git clone [repository-url]
   cd questionnaire
   ```

2. Install PHP dependencies:
   ```
   composer install
   ```

3. Install JavaScript dependencies:
   ```
   npm install
   ```

4. Create a `.env` file:
   ```
   cp .env.example .env
   ```

5. Generate application key:
   ```
   php artisan key:generate
   ```

6. Configure your database in the `.env` file:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=questionnaire
   DB_USERNAME=root
   DB_PASSWORD=
   ```

7. Run migrations and seed the database:
   ```
   php artisan migrate --seed
   ```

8. Build frontend assets:
   ```
   npm run build
   ```

## Development

### Running the Development Server

The application uses Herd for local development.

For frontend development with hot reloading:
```
npm run dev
```

### Code Structure

- **Backend**
  - `app/Models/Questionnaire.php`: Data model for questionnaire entries
  - `app/Http/Controllers/QuestionnaireController.php`: Handles questionnaire data display and filtering

- **Frontend**
  - `resources/js/components/questionnaires/questionnaires-table.tsx`: Main table component with sorting, filtering and pagination
  - `resources/js/components/questionnaires/questionnaire-detail-view.tsx`: Detailed view for questionnaire entries
  - `resources/js/pages/questionnaire.tsx`: Main questionnaire page

### Database Schema

The `questionnaires` table includes the following fields:

- `id`: Primary key
- `applicant_id`: Applicant identifier
- `job_title`: Position applied for
- `workload`: Expected workload (e.g., "100%")
- `region`: Geographic region
- `termination_reason`: Reason for termination if applicable
- `salary_current`: Current salary
- `salary_expectation`: Expected salary
- `availability`: Available start date
- `created_at`/`updated_at`: Timestamps

## Contributing

1. Follow the established coding style (PHP: PSR-12, JS/TS: Prettier)
2. Write meaningful commit messages
3. Create a pull request with a clear description of changes

## License

This project is licensed under the MIT License.
