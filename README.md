## Welcome to the [EnterCinema](https://entercinema.com/) Project.


![Guide GIF](./static/previews/entercinema.png)

## What's New:

### ASK AI Chatbot Assistant (Beta)
Introducing our intelligent chatbot assistant that helps users discover content based on their preferences. Users can ask for movie and TV show recommendations using natural language, get information about actors, directors, and much more. The AI assistant provides personalized suggestions and enhances the overall content discovery experience.

### Rating Functionality in Watchlist
Users can now rate and review items directly from their watchlist. A dedicated rating modal allows users to easily assign ratings and write reviews without leaving the watchlist page, providing a more streamlined user experience.

### Rated Items Modal with Edit Functionality
A new centralized modal displays all rated movies and TV shows with tabs for easy navigation between content types. Users can access this modal from both the Hero section and Watchlist page, and can edit their ratings and reviews directly within the modal.

### Revamped Upcoming Releases Section
The "Upcoming Releases" section has been transformed with a new carousel display for improved visual appeal. The date range for upcoming movies has been expanded to 180 days, providing users with a broader view of future releases. Section titles have been updated for clarity: "Upcoming Releases" is now "Releases Timeline" and "Latest Movies" is now "Movie Releases".

### Google OAuth Authentication
Users can now sign in using their Google accounts in addition to the existing authentication system. The existing DRF-based authentication remains available as an alternative option.

### *** Integration for Direct Content Access
Introduced direct streaming access through *** platform. Users can now enjoy seamless content viewing via our *** integration.

### Enhanced Advanced Search with Watch Providers
A new dropdown feature in the advanced search lets users filter TV shows by watch provider (Apple TV+, Disney+, Hulu, Max, Netflix, Prime Video). This option is available only when 'TV Show' is selected.


## Installation

### Vue.js Frontend:
To run this project locally, follow these steps:

1. Clone the repository to your local machine:
```bash
git clone https://github.com/imprvhub/entercinema.git
```
2. Install the necessary dependencies:
```bash
yarn install
```
3. Before running the project, you need to set up your environment variables in a .env file. Here's how:
```bash
FRONTEND_URL=<Specify the URL where your frontend will be hosted, e.g., 'https://localhost:3000' or your custom domain.>
API_KEY=<Provide your TMDB API key here>
SUPABASE_URL=<Enter the URL for your database, e.g., your Supabase database URL>
SUPABASE_ANON_KEY=<Enter the anonymous key for your database, e.g., your Supabase anonymous key>    
```
  By default, EnterCinema is configured to work with Supabase as the backend DRF database. However, you can use another database if needed. Simply replace DATABASE_URL and DATABASE_ANON_KEY with the appropriate values based on your database configuration.

4. Run the project:
  ```bash
  yarn dev
  ```
  The project should be accesible at, e.g., 'http://localhost:3000'

<hr>

### Django Rest Framework Backend:
To set up the Django Rest Framework backend for EnterCinema, follow these steps:

### Prerequisites:
[Python 3.9](https://www.python.org/downloads/release/python-390/)

1. Clone the backend repository to your local machine:
```bash
git clone https://github.com/imprvhub/entercinema-drf.git
```

2. Install Dependencies:
Navigate to the project directory and install the necessary dependencies using pip:
```bash
cd entercinema-drf
pip install -r requirements.txt
```

3. Set Up Environment Variables.
Create a .env file in the project directory and define the following variables:
```bash
DB_NAME=<Enter your database name>
DB_USER=<Enter your database username>
DB_PASSWORD=<Enter your database password>
DB_HOST=<Enter your database host, e.g., localhost>
DB_PORT=<Enter your database port>
```

4. Apply Migrations:
```bash
python manage.py migrate
```

5. Collect static files for deployment:
```bash
python manage.py collectstatic
```

6. Run the server:
```bash
python manage.py runserver
```

### Feedback:
Your feedback is valuable! If you encounter any issues or have suggestions for improvements, please create a new issue in the [GitHub repository](https://github.com/imprvhub/entercinema/issues/new).

### Attributions

The foundational inspiration for this project is derived from the [TasteJS](https://github.com/tastejs/nuxt-movies) repository, and I extend my gratitude for their pioneering work.

Data concerning movies and TV shows are sourced from [TMDB](https://www.themoviedb.org/), while information on streaming providers, networks, and platforms is obtained from [JustWatch](https://www.justwatch.com/).

For further details, please refer to these [Terms and Conditions](https://entercinema.com/terms/).