const { engine } = require("express-handlebars");
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");

const session = require("express-session");
const connectSqlite3 = require("connect-sqlite3");
const dbFile = "my-project-data.sqlite3.db";
db = new sqlite3.Database(dbFile);
const SQLiteStore = connectSqlite3(session);

const app = express();
const PORT = process.env.PORT || 3000;
const adminPassword =
  "$2b$12$RkX0Qkf8GvctcU6HxooMWuudfbAl/Cvvs4CzHvHqN.E.dlZJCgLnO";
const bcrypt = require("bcrypt");

// Handlebars Middleware
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//Model
function initTableMovies(mytable) {
  const movies = [
    {
      id: 1,
      title: "The Shawshank Redemption",
      year: 1994,
      genres: ["Drama"],
      director: "Frank Darabont",
      cast: ["Tim Robbins", "Morgan Freeman"],
      synopsis:
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      runtimeMinutes: 142,
      rating: 9.3,
      posterUrl: "/img/posters/shawshank.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=NmzuHjWmXOc",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["classic", "prison", "redemption"],
    },
    {
      id: 2,
      title: "The Godfather",
      year: 1972,
      genres: ["Crime", "Drama"],
      director: "Francis Ford Coppola",
      cast: ["Marlon Brando", "Al Pacino"],
      synopsis:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      runtimeMinutes: 175,
      rating: 9.2,
      posterUrl: "/img/posters/godfather.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["mafia", "epic", "family"],
    },
    {
      id: 3,
      title: "Pulp Fiction",
      year: 1994,
      genres: ["Crime", "Drama"],
      director: "Quentin Tarantino",
      cast: ["John Travolta", "Samuel L. Jackson", "Uma Thurman"],
      synopsis:
        "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      runtimeMinutes: 154,
      rating: 8.9,
      posterUrl: "/posters/pulpfiction.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["cult", "nonlinear", "dialogue"],
    },
    {
      id: 4,
      title: "Star Wars: A New Hope",
      year: 1977,
      genres: ["Sci-Fi", "Adventure"],
      director: "George Lucas",
      cast: ["Mark Hamill", "Harrison Ford", "Carrie Fisher"],
      synopsis:
        "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee, and two droids to save the galaxy from the Empire's world-destroying battle station.",
      runtimeMinutes: 121,
      rating: 8.6,
      posterUrl: "/posters/starwars_a_new_hope.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=vZ734NWnAHA",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["space", "epic", "franchise"],
    },
    {
      id: 5,
      title: "The Dark Knight",
      year: 2008,
      genres: ["Action", "Crime", "Drama"],
      director: "Christopher Nolan",
      cast: ["Christian Bale", "Heath Ledger"],
      synopsis:
        "Batman faces his greatest psychological and physical test when the Joker wreaks havoc on Gotham City.",
      runtimeMinutes: 152,
      rating: 9.0,
      posterUrl: "/posters/dark_knight.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
      availability: ["DVD", "Blu-ray", "4K"],
      language: "English",
      tags: ["superhero", "dark", "thriller"],
    },
    {
      id: 6,
      title: "Back to the Future",
      year: 1985,
      genres: ["Adventure", "Comedy", "Sci-Fi"],
      director: "Robert Zemeckis",
      cast: ["Michael J. Fox", "Christopher Lloyd"],
      synopsis:
        "A teenager is accidentally sent 30 years into the past in a time-traveling DeLorean invented by a slightly mad scientist.",
      runtimeMinutes: 116,
      rating: 8.5,
      posterUrl: "/posters/back_to_the_future.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=qvsgGtivCgs",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["time travel", "80s", "family"],
    },
    {
      id: 7,
      title: "Jurassic Park",
      year: 1993,
      genres: ["Adventure", "Sci-Fi"],
      director: "Steven Spielberg",
      cast: ["Sam Neill", "Laura Dern", "Jeff Goldblum"],
      synopsis:
        "A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.",
      runtimeMinutes: 127,
      rating: 8.1,
      posterUrl: "/posters/jurassic_park.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=lc0UehYemQA",
      availability: ["DVD", "Blu-ray", "4K"],
      language: "English",
      tags: ["dinosaurs", "adventure", "thriller"],
    },
    {
      id: 8,
      title: "Titanic",
      year: 1997,
      genres: ["Drama", "Romance"],
      director: "James Cameron",
      cast: ["Leonardo DiCaprio", "Kate Winslet"],
      synopsis:
        "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated RMS Titanic.",
      runtimeMinutes: 195,
      rating: 7.8,
      posterUrl: "/posters/titanic.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=zCy5WQ9S4c0",
      availability: ["DVD", "Blu-ray", "4K"],
      language: "English",
      tags: ["romance", "epic", "historical"],
    },
    {
      id: 9,
      title: "The Matrix",
      year: 1999,
      genres: ["Action", "Sci-Fi"],
      director: "The Wachowskis",
      cast: ["Keanu Reeves", "Laurence Fishburne"],
      synopsis:
        "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      runtimeMinutes: 136,
      rating: 8.7,
      posterUrl: "/posters/matrix.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
      availability: ["DVD", "Blu-ray", "4K"],
      language: "English",
      tags: ["cyberpunk", "philosophy", "action"],
    },
    {
      id: 10,
      title: "Raiders of the Lost Ark",
      year: 1981,
      genres: ["Action", "Adventure"],
      director: "Steven Spielberg",
      cast: ["Harrison Ford"],
      synopsis:
        "Archaeologist and adventurer Indiana Jones is hired by the U.S. government to find the Ark of the Covenant before the Nazis can obtain its awesome powers.",
      runtimeMinutes: 115,
      rating: 8.4,
      posterUrl: "/posters/raiders.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=XkkzKHCx154",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["adventure", "classic", "action"],
    },
    {
      id: 11,
      title: "Forrest Gump",
      year: 1994,
      genres: ["Drama", "Romance"],
      director: "Robert Zemeckis",
      cast: ["Tom Hanks"],
      synopsis:
        "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold through the perspective of an Alabama man with an IQ of 75.",
      runtimeMinutes: 142,
      rating: 8.8,
      posterUrl: "/posters/forrest_gump.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=bLvqoHBptjg",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["heartfelt", "drama", "history"],
    },
    {
      id: 12,
      title: "The Silence of the Lambs",
      year: 1991,
      genres: ["Crime", "Drama", "Thriller"],
      director: "Jonathan Demme",
      cast: ["Jodie Foster", "Anthony Hopkins"],
      synopsis:
        "A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to catch another serial killer.",
      runtimeMinutes: 118,
      rating: 8.6,
      posterUrl: "/posters/silence_of_the_lambs.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=W6Mm8Sbe__o",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["thriller", "psychological", "crime"],
    },
    {
      id: 13,
      title: "Fight Club",
      year: 1999,
      genres: ["Drama"],
      director: "David Fincher",
      cast: ["Brad Pitt", "Edward Norton"],
      synopsis:
        "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much, much more.",
      runtimeMinutes: 139,
      rating: 8.8,
      posterUrl: "/posters/fight_club.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=SUXWAEX2jlg",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["cult", "satire", "psychological"],
    },
    {
      id: 14,
      title: "The Lord of the Rings: The Fellowship of the Ring",
      year: 2001,
      genres: ["Adventure", "Fantasy"],
      director: "Peter Jackson",
      cast: ["Elijah Wood", "Ian McKellen"],
      synopsis:
        "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the One Ring and save Middle-earth from the Dark Lord Sauron.",
      runtimeMinutes: 178,
      rating: 8.8,
      posterUrl: "/posters/lotr_fellowship.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=V75dMMIW2B4",
      availability: ["DVD", "Blu-ray", "4K"],
      language: "English",
      tags: ["epic", "fantasy", "adventure"],
    },
    {
      id: 15,
      title: "E.T. the Extra-Terrestrial",
      year: 1982,
      genres: ["Family", "Sci-Fi"],
      director: "Steven Spielberg",
      cast: ["Henry Thomas", "Drew Barrymore"],
      synopsis:
        "A troubled child summons the courage to help a friendly alien escape Earth and return to his home planet.",
      runtimeMinutes: 115,
      rating: 7.8,
      posterUrl: "/posters/et.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=qYAETtIIClk",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["family", "80s", "heartwarming"],
    },
    {
      id: 16,
      title: "Ghostbusters",
      year: 1984,
      genres: ["Comedy", "Fantasy"],
      director: "Ivan Reitman",
      cast: ["Bill Murray", "Dan Aykroyd", "Sigourney Weaver"],
      synopsis:
        "Three parapsychologists start a ghost-catching business in New York City and become unlikely local heroes.",
      runtimeMinutes: 105,
      rating: 7.8,
      posterUrl: "/posters/ghostbusters.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=3X6gGv6x3y0",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["comedy", "supernatural", "80s"],
    },
    {
      id: 17,
      title: "Jaws",
      year: 1975,
      genres: ["Thriller", "Adventure"],
      director: "Steven Spielberg",
      cast: ["Roy Scheider", "Robert Shaw"],
      synopsis:
        "A giant man-eating great white shark arrives on the shores of a New England beach resort and wreaks havoc until a hunt is organized to kill it.",
      runtimeMinutes: 124,
      rating: 8.0,
      posterUrl: "/posters/jaws.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=U1fu_sA7XhE",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["suspense", "classic", "thriller"],
    },
    {
      id: 18,
      title: "Terminator 2: Judgment Day",
      year: 1991,
      genres: ["Action", "Sci-Fi"],
      director: "James Cameron",
      cast: ["Arnold Schwarzenegger", "Linda Hamilton"],
      synopsis:
        "A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her teenage son from a more advanced and powerful cyborg.",
      runtimeMinutes: 137,
      rating: 8.5,
      posterUrl: "/posters/t2.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=CRRlbK5w8AE",
      availability: ["DVD", "Blu-ray", "4K"],
      language: "English",
      tags: ["sci-fi", "action", "classic"],
    },
    {
      id: 19,
      title: "Alien",
      year: 1979,
      genres: ["Horror", "Sci-Fi"],
      director: "Ridley Scott",
      cast: ["Sigourney Weaver"],
      synopsis:
        "The crew of a commercial space tug encounters a deadly lifeform after investigating an unknown transmission.",
      runtimeMinutes: 117,
      rating: 8.4,
      posterUrl: "/posters/alien.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=LjLamj-b0I8",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["horror", "sci-fi", "suspense"],
    },
    {
      id: 20,
      title: "Casablanca",
      year: 1942,
      genres: ["Drama", "Romance"],
      director: "Michael Curtiz",
      cast: ["Humphrey Bogart", "Ingrid Bergman"],
      synopsis:
        "A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape French Morocco.",
      runtimeMinutes: 102,
      rating: 8.5,
      posterUrl: "/posters/casablanca.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=BkL9l7qovsE",
      availability: ["DVD", "Blu-ray"],
      language: "English",
      tags: ["classic", "romance", "wartime"],
    },
  ];

  db.run(
    `CREATE TABLE IF NOT EXISTS movies (id INTEGER PRIMARY KEY, title TEXT, year INTEGER, genres TEXT, director TEXT, cast TEXT, synopsis TEXT, runtimeMinutes INTEGER, rating REAL, posterUrl TEXT, trailerUrl TEXT, availability TEXT, language TEXT, tags TEXT)`,
    (error) => {
      if (error) {
        console.log("Error", error);
      } else {
        console.log("Movies table ready");
      }

      movies.forEach((movie) => {
        db.run(
          "INSERT INTO movies (id, title, year, genres, director, cast, synopsis, runtimeMinutes, rating, posterUrl, trailerUrl, availability, language, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            movie.id,
            movie.title,
            movie.year,
            movie.genres.join(", "),
            movie.director,
            movie.cast.join(", "),
            movie.synopsis,
            movie.runtimeMinutes,
            movie.rating,
            movie.posterUrl,
            movie.trailerUrl,
            movie.availability.join(", "),
            movie.language,
            movie.tags.join(", "),
          ],
          (err) => {
            if (err) {
              console.log("Error inserting movie:", err);
            } else {
              console.log("Line added to movies tables");
            }
          }
        );
      });
    }
  );
}

// Static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new SQLiteStore({ db: "session-db.db" }),
    saveUninitialized: false,
    resave: false,
    secret: "This123Is@Another#456GreatSecret678%Sentence",
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Routes
app.get("/", function (req, res) {
  res.render("home.handlebars");
});

app.get("/about", function (req, res) {
  res.render("about.handlebars");
});

app.get("/movies", function (req, res) {
  db.all("SELECT * FROM movies", (error, listOfMovies) => {
    if (error) {
      console.log("Error fetching movies:", error);
    } else {
      model = { movies: listOfMovies };
      res.render("movies.handlebars", model);
    }
  });
});

app.get("/contact", function (req, res) {
  res.render("contact.handlebars");
});

app.get("/login", function (req, res) {
  res.render("login.handlebars");
});

app.get("/logout", function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
      res.redirect("/");
    } else {
      console.log("Logged out...");
      res.redirect("/");
    }
  });
});

app.post("/login", function (request, response) {
  console.log(
    `Here comes the data received: ${request.body.username} - ${request.body.password}`
  );
  const { username, password } = request.body;

  if (request.body.username === "admin") {
    bcrypt.compare(request.body.password, adminPassword, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        model = { error: "Error in password verification." };
        response.render("login", model);
      }
      if (result) {
        request.session.isLoggedIn = true;
        request.session.un = request.body.username;
        request.session.isAdmin = true;
        console.log("---> SESSION INFO:", JSON.stringify(request.session));
        response.render("loggedin");
      } else {
        console.log("Wrong password!");
        model = { error: "Wrong password! Please try again." };
        response.render("login", model);
      }
    });
  } else {
    console.log("Unknown user!");
    model = { error: "Unknown user! Please try again." };
    response.render("login", model);
  }
});

function hashPassword(pw, saltRounds) {
  bcrypt.hash(pw, saltRounds, function (err, hash) {
    if (err) {
      console.error("Error hashing password:", err);
    } else {
      console.log("Hashed password:", hash);
    }
  });
}

app.listen(PORT, () => {
  //initTableMovies(db);
  hashPassword("wdf#2025", 12);
  console.log(`Server is running on http://localhost:${PORT}`);
});
