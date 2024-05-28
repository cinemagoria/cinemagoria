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

#### Pending Fixes for v1.1.2:
- **Bug Adding First Favorite for New Users:** This issue occurs on the first click when adding a favorite for a newly created account. The first click is not recognized because the component fails to update the state when mapping '0' objects in the JSON. However, on the second click, the 'Add to Favorites' button functions correctly, and this issue never recurs for that user again. It only happens on the first click for the first favorite addition. Further investigation is needed into the Vue.js functions responsible for this behavior.

- **Auto-fill Bug on Login Page:** Auto-fill on mobile devices sometimes causes a redirection to the root page. The form configuration needs adjustment to prevent this redirection and allow users to continue the authentication flow.

- ~~**Sign In Button as Loader Button**: The sign-in button will be a 'loader-button' so that when users click on it, a loader is displayed until the authentication process is complete.~~ [Full changelog.](https://github.com/imprvhub/cinemathe/commit/ec387757026cc216a6efc275e1e49627657a8525)

- ~~**Grid Representation of Movies and TV Shows in the Profile**: Currently, there are two separate paginations for movies and TV shows in the profile. In the future, these paginations will be replaced by a filtering option that allows users to filter by 'All - Movies - TV Shows', resulting in a single pagination.~~ [Full changelog.](https://github.com/imprvhub/cinemathe/commit/720f5edd9206400be32c7a20017022706f01ce39) **Pending Fix**: Implement v-else to handle cases with no retrievals in movies or TV shows.

- ~~**Rating Score Consistency:** Refactor rating scores for movies and TV shows in the main carousel to two decimal places.~~ [Full changelog.](https://github.com/imprvhub/cinemathe/commit/f3251b04abb9a986559aa3f8db35a78431c6ead7)


- **Style Enhancements:** -Review and standardize font sizes, styles, and weights across all components to ensure a consistent and cohesive appearance throughout the entire application. -Review hover effect on user profile menus; the button's border-radius is causing the hover effect to misalign.

- ~~**Responsive UI:**: -Adjust avatar modal layout to fit within the parent element.
-Align paragraph text correctly in the confirmation modal after user registration.
-Modify the share modal width for screens larger than 800px to improve responsiveness.~~[Full changelog.](https://github.com/imprvhub/cinemathe/commit/7669bcbdd2b2de83de2a8d1cdaa62450cb2f8938)

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
