# Welcome to the [Cinemathe](https://cinemathe.space/) Project.
> [!NOTE]  
> For the latest updates and changes, please refer to this section on <a href="https://ivanluna.dev/projects/post-cinemathe/" target="_blank">ivanluna.dev</a>.


![Guide GIF](./static/previews/cinemathe.png)

## What's New:

### Integrated Python Backend: 

Cinemathe seamlessly integrates a Django Rest Framework backend for robust user authentication, ensuring enhanced security and access control via the Django Administration Panel.

### Comprehensive User Profile Management: 

Users enjoy complete control over their profiles, with the ability to save favorite movies and TV series, personalize their entertainment preferences, and conveniently access account settings. The addition of a user profile menu on both the main and profile pages further enhances user interaction, providing easy access to authentication and account customization options, including avatar changes.

### Effortless Social Media Sharing:

Cinemathe empowers users to share their favorite movies and TV series effortlessly across various social media platforms, fostering engagement and expanding the community.

### Community-driven User Reviews:

Users can explore insightful reviews for specific movies and TV shows, facilitating community engagement and providing valuable feedback from fellow users.

### Extensive Provider Options:

With multiple provider options available for each movie and TV show, Cinemathe informs users about the streaming platforms where they can access specific content.

### Enhanced Content Discovery with New Carousels:

Introducing intuitive carousels for different movie and TV series categories, Cinemathe elevates the browsing experience and simplifies content discovery for users.



## Installation

### Vue.js Frontend:
To run this project locally, follow these steps:

1. Clone the repository to your local machine:
```bash
git clone https://github.com/imprvhub/cinemathe.git
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
  By default, Cinemathe is configured to work with Supabase as the backend DRF database. However, you can use another database if needed. Simply replace DATABASE_URL and DATABASE_ANON_KEY with the appropriate values based on your database configuration.

4. Run the project:
  ```bash
  yarn dev
  ```
  The project should be accesible at, e.g., 'http://localhost:3000'

<hr>

### Django Rest Framework Backend:
To set up the Django Rest Framework backend for Cinemathe, follow these steps:

### Prerequisites:
[Python 3.9](https://www.python.org/downloads/release/python-390/)

1. Clone the backend repository to your local machine:
```bash
git clone https://github.com/imprvhub/cinemathe-drf.git
```

2. Install Dependencies:
Navigate to the project directory and install the necessary dependencies using pip:
```bash
cd cinemathe-drf
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
python manage.py collectstatic
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
Your feedback is valuable! If you encounter any issues or have suggestions for improvements, please create a new issue in the [GitHub repository](https://github.com/imprvhub/cinemathe/issues/new).

##### Planned Features and Fixes for v1.3.0:

- **Feat: Implement Global Restructuring for Enhanced User Experience.**
  This restructuring aims to fundamentally enhance user interaction with the platform by introducing a cohesive global navigation bar with key features such as a search function, personalized user panel, language selector, and a convenient back button. These modifications are designed to streamline navigation and improve overall usability, leading to a more intuitive and efficient user experience across the entire platform. [Changelog.](https://github.com/imprvhub/cinemathe/commit/da82b26f4b22ead0de49a673f02aba83e0f04747)

- **Feat: TV Show Episode Reminders**  
  Add reminders for new episodes of TV shows. This feature will allow users to receive notifications about new episodes for their favorite TV shows, ensuring they never miss an update.

- **Feat: Advanced Search Filters**  
  Implement advanced search by year, genre, and rating. This feature will enhance the search functionality, enabling users to filter their search queries more precisely. Users will be able to search by specific years, genres, and ratings, making it easier to find exactly what they're looking for. [Changelog.](https://github.com/imprvhub/cinemathe/commit/ec436b5c5772836a3332506ffb0804b479061ab9)

- **Feat: Real-time Favorite Deletion**  
  Live deletion of favorites from the profile page. Users will be able to delete their favorites in real-time directly from their profile page, providing a more seamless and interactive experience.

- **Feat: Add Letterboxd Link to Movie Details**  
  This feature adds a Letterboxd link to the movie details page. The link is conditionally displayed based on the content type; it is visible only for movies and not for TV series. This differentiation is made because Letterboxd supports movies exclusively, not TV shows. [Changelog.](https://github.com/imprvhub/cinemathe/commit/fa1ffadb354fc7eeac0754ad8e465e00c9073eb0)

- **Feat: Add Trakt TV Link to Movie and TV Show Details**  
  This feature adds a Trakt TV link to the movie and TV Show details page. [Changelog.](https://github.com/imprvhub/cinemathe/commit/40b47b551998d1995172edcabbfc57a2d5fd633b)

- **Fix: Profile Name Display Issue**  
  Resolve an issue where the profile name is not displayed on the first launch. This fix will ensure that the profile name is correctly shown when a user accesses their profile for the first time. [Changelog.](https://github.com/imprvhub/cinemathe/commit/1bddc978def7a5d02c861fb5c81b0736cd90512a)

- **Fix: Favorites Menu Responsiveness**  
  Improve responsiveness of the favorite collection menu on the profile page for resolutions wider than 600px. This fix will enhance the layout and usability of the favorites menu on larger screens.

- **Fix: Star Ratings in Profile**  
  Add stars to the ratings in profile/index.vue. This fix will visually represent user ratings with star icons, providing a clearer and more intuitive rating system.

- **Fix: Move Language Picker to Top**
  Move the Language Picker from the footer to the top of the page. This change will make it more visible to all users and improve the user experience. [Changelog.](https://github.com/imprvhub/cinemathe/commit/46450650d3b44c72ded83d559abe0f09b2765049)

### Attributions

The foundational inspiration for this project is derived from the [TasteJS](https://github.com/tastejs/nuxt-movies) repository, and I extend my gratitude for their pioneering work.

Data concerning movies and TV shows are sourced from [TMDB](https://www.themoviedb.org/), while information on streaming providers, networks, and platforms is obtained from [JustWatch](https://www.justwatch.com/).

For further details, please refer to these [Terms and Conditions](https://cinemathe.space/terms/).

### Conclusion:

#### Achievements:
- **Synergistic Integration:** Successfully integrated Vue.js and Django Rest Framework, two less commonly paired technologies, this presented me with an intriguing challenge. Despite my prior experience with Django, blending it with Vue.js required careful problem-solving and adaptability. I successfully tackled hurdles encountered while implementing Django user authentication.

- **Streamlined UX/UI Integration and Data Management:**  Successfully tackled the complexities of UX/UI design, encompassing the management of diverse global and dynamic components, API integration, seamless data transmission between frameworks, and robust user experience and authentication. Despite initial complexities, diligent effort and incremental improvements paved the way for adept navigation through these challenges.

##### Learnings:
- **Improvements Through Perseverance:** This project allowed me to delve even deeper into the world of Vue.js. Just three months ago, facing the implementation of Vue.js seemed daunting due to its complexity. However, thanks to daily and constant effort, as well as my perseverance, I not only managed to understand the underlying logic required, but I also exceeded my initial expectations. This experience not only motivated me to explore new possibilities but also pushed me to implement features that I previously considered beyond my reach, especially in the frontend realm.
This project consolidated my perseverance and commitment to continuous learning. The consistent dedication to this project not only strengthened my confidence but also significantly expanded my skill set. From the start of the planning process to the successful conclusion of the project, this journey highlights how perseverance and dedicated effort can transform both personal and professional growth.
