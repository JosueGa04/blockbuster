const { engine } = require("express-handlebars")
const express = require("express")
const path = require("path")
const sqlite3 = require("sqlite3")
const bcrypt = require("bcrypt")

const session = require("express-session")
const connectSqlite3 = require("connect-sqlite3")
const dbFile = "my-project-data.sqlite3.db"
const db = new sqlite3.Database(dbFile)
const SQLiteStore = connectSqlite3(session)

const app = express()
const PORT = process.env.PORT || 3000
const adminPassword = "$2b$12$RkX0Qkf8GvctcU6HxooMWuudfbAl/Cvvs4CzHvHqN.E.dlZJCgLnO"

// Handlebars Middleware
app.engine(
  "handlebars",
  engine({
    helpers: {
      eq: (a, b) => {
        return a === b
      },
      math: (a, operator, b) => {
        a = Number.parseFloat(a)
        b = Number.parseFloat(b)
        switch (operator) {
          case "+":
            return a + b
          case "-":
            return a - b
          case "*":
            return a * b
          case "/":
            return a / b
          default:
            return 0
        }
      },
      range: (start, end) => {
        const result = []
        for (let i = start; i <= end; i++) {
          result.push(i)
        }
        return result
      },
    },
  }),
)

app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

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
      synopsis: "Batman faces his greatest psychological and physical test when the Joker wreaks havoc on Gotham City.",
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
      posterUrl: "/posters/forrestgump.jpg",
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
      posterUrl: "/posters/silencelambs.jpg",
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
      posterUrl: "/posters/fightclub.jpg",
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
      posterUrl: "/posters/fellowship.jpg",
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
  ]

  db.run(
    `CREATE TABLE IF NOT EXISTS movies (id INTEGER PRIMARY KEY, title TEXT, year INTEGER, genres TEXT, director TEXT, cast TEXT, synopsis TEXT, runtimeMinutes INTEGER, rating REAL, posterUrl TEXT, trailerUrl TEXT, availability TEXT, language TEXT, tags TEXT)`,
    (error) => {
      if (error) {
        console.log("Error", error)
      } else {
        console.log("Movies table ready")
      }

      movies.forEach((movie) => {
        db.run(
          "INSERT INTO movies (id, title, year, genres, director, cast, synopsis, runtimeMinutes, rating, posterUrl, trailerUrl, availability, language, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
              console.log("Error inserting movie:", err)
            } else {
              console.log("Line added to movies tables")
            }
          },
        )
      })
    },
  )
}

function initTableReviews(mytable) {
  const reviews = [
    {
      reviewId: 1,
      movieId: 1,
      userId: 2,
      rating: 5,
      comment: "A masterpiece, emotional and powerful.",
      date: "2024-05-10",
    },
    {
      reviewId: 2,
      movieId: 1,
      userId: 4,
      rating: 4,
      comment: "Amazing story, a bit slow but worth it.",
      date: "2024-05-12",
    },
    {
      reviewId: 3,
      movieId: 5,
      userId: 1,
      rating: 5,
      comment: "Heath Ledger as Joker is legendary.",
      date: "2024-05-13",
    },
    {
      reviewId: 4,
      movieId: 7,
      userId: 3,
      rating: 4,
      comment: "Great effects for its time!",
      date: "2024-05-15",
    },
    {
      reviewId: 5,
      movieId: 9,
      userId: 5,
      rating: 5,
      comment: "Mind-bending and iconic sci-fi.",
      date: "2024-05-18",
    },
  ]

  mytable.run(
    `CREATE TABLE IF NOT EXISTS reviews (reviewId INTEGER PRIMARY KEY, movieId INTEGER, userId INTEGER, rating INTEGER, comment TEXT, date TEXT)`,
    (error) => {
      if (error) {
        console.log("Error", error)
      } else {
        console.log("Reviews table ready")
      }
    },
  )

  reviews.forEach((review) => {
    mytable.run(
      "INSERT INTO reviews (reviewId, movieId, userId, rating, comment, date) VALUES (?, ?, ?, ?, ?, ?)",
      [review.reviewId, review.movieId, review.userId, review.rating, review.comment, review.date],
      (err) => {
        if (err) {
          console.log("Error inserting review:", err)
        } else {
          console.log("Review added to reviews table")
        }
      },
    )
  })
}

function initTableUsers(mytable) {
  const users = [
    { userId: 1, username: "admin", passwordHash: adminPassword, isAdmin: 1 },
    {
      userId: 2,
      username: "johndoe",
      passwordHash: "$2b$12$examplehash1",
      isAdmin: 0,
    },
    {
      userId: 3,
      username: "janedoe",
      passwordHash: "$2b$12$examplehash2",
      isAdmin: 0,
    },
    {
      userId: 4,
      username: "alice",
      passwordHash: "$2b$12$examplehash3",
      isAdmin: 0,
    },
    {
      userId: 5,
      username: "bob",
      passwordHash: "$2b$12$examplehash4",
      isAdmin: 0,
    },
  ]

  mytable.run(
    `CREATE TABLE IF NOT EXISTS users (userId INTEGER PRIMARY KEY, username TEXT UNIQUE, passwordHash TEXT, isAdmin INTEGER)`,
    (error) => {
      if (error) {
        console.log("Error", error)
      } else {
        console.log("Users table ready")
      }

      users.forEach((user) => {
        mytable.run(
          "INSERT INTO users (userId, username, passwordHash, isAdmin) VALUES (?, ?, ?, ?)",
          [user.userId, user.username, user.passwordHash, user.isAdmin],
          (err) => {
            if (err) {
              console.log("Error inserting user:", err)
            } else {
              console.log("User added to users table")
            }
          },
        )
      })
    },
  )
}

function initTableRentals(mytable) {
  const rentals = [
    {
      rentalId: 1,
      movieId: 1,
      userId: 2,
      rentalDate: "2024-06-01",
      returnDate: "2024-06-05",
      status: "returned",
    },
    {
      rentalId: 2,
      movieId: 3,
      userId: 3,
      rentalDate: "2024-06-02",
      returnDate: null,
      status: "rented",
    },
    {
      rentalId: 3,
      movieId: 5,
      userId: 4,
      rentalDate: "2024-06-03",
      returnDate: "2024-06-07",
      status: "returned",
    },
    {
      rentalId: 4,
      movieId: 2,
      userId: 5,
      rentalDate: "2024-06-04",
      returnDate: null,
      status: "rented",
    },
  ]

  mytable.run(
    `CREATE TABLE IF NOT EXISTS rentals (rentalId INTEGER PRIMARY KEY, movieId INTEGER, userId INTEGER, rentalDate TEXT, returnDate TEXT, status TEXT)`,
    (error) => {
      if (error) {
        console.log("Error", error)
      } else {
        console.log("Rentals table ready")
      }
    },
  )

  rentals.forEach((rental) => {
    mytable.run(
      "INSERT INTO rentals (rentalId, movieId, userId, rentalDate, returnDate, status) VALUES (?, ?, ?, ?, ?, ?)",
      [rental.rentalId, rental.movieId, rental.userId, rental.rentalDate, rental.returnDate, rental.status],
      (err) => {
        if (err) {
          console.log("Error inserting rental:", err)
        } else {
          console.log("Rental added to rentals table")
        }
      },
    )
  })
}

// Static folder
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    store: new SQLiteStore({ db: "session-db.db" }),
    saveUninitialized: false,
    resave: false,
    secret: "This123Is@Another#456GreatSecret678%Sentence",
  }),
)

app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})

// Routes
app.get("/", (req, res) => {
  res.render("home.handlebars")
})

app.get("/about", (req, res) => {
  res.render("about.handlebars")
})

app.get("/movies", (req, res) => {
  const numberPerPage = 3
  const currentPage = Number.parseInt(req.query.page) || 1

  // Validate page number
  if (currentPage < 1) {
    return res.redirect("/movies?page=1")
  }

  // Get total count of movies
  db.get("SELECT COUNT(*) as total FROM movies", (error, result) => {
    if (error) {
      console.log("Error counting movies:", error)
      const model = { error: "Error loading movies." }
      return res.render("movies.handlebars", model)
    }

    const totalMovies = result.total
    const totalPages = Math.ceil(totalMovies / numberPerPage)
    const offset = (currentPage - 1) * numberPerPage

    const pages = []
    if (totalPages <= 8) {
      // Show all pages if 8 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first 4, ellipsis, last 4
      pages.push(1, 2, 3, 4)
      pages.push("...")
      pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    }

    // Fetch movies for current page
    db.all("SELECT * FROM movies LIMIT ? OFFSET ?", [numberPerPage, offset], (error, listOfMovies) => {
      if (error) {
        console.log("Error fetching movies:", error)
        const model = { error: "Error loading movies." }
        res.render("movies.handlebars", model)
      } else {
        const model = {
          movies: listOfMovies,
          currentPage: currentPage,
          totalPages: totalPages,
          hasPrevious: currentPage > 1,
          hasNext: currentPage < totalPages,
          pages: pages,
          previousPage: currentPage - 1,
          nextPage: currentPage + 1,
        }
        res.render("movies.handlebars", model)
      }
    })
  })
})

app.get("/movies/new", (req, res) => {
  if (req.session.isAdmin) {
    res.render("movieForm.handlebars")
  } else {
    const model = { error: "You are not authorized to create movies." }
    res.render("login.handlebars", model)
  }
})

app.get("/movies/:id", (req, res) => {
  const myMovieId = req.params.id
  db.get("SELECT * FROM movies WHERE id = ?", [myMovieId], (error, movie) => {
    if (error) {
      console.log("Error fetching movie:", error)
      const model = { error: "Error fetching movie." }
      res.render("movie.handlebars", model)
    } else {
      console.log("Movie fetched:", movie)
      const model = { movie: movie }
      res.render("movie.handlebars", model)
    }
  })
})

app.get("/contact", (req, res) => {
  res.render("contact.handlebars")
})

app.get("/login", (req, res) => {
  res.render("login.handlebars")
})

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err)
      res.redirect("/")
    } else {
      console.log("Logged out...")
      res.redirect("/")
    }
  })
})

app.post("/login", (request, response) => {
  console.log(`Here comes the data received: ${request.body.username} - ${request.body.password}`)
  const { username, password } = request.body

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error("Database error:", err)
      const model = { error: "Error accessing database." }
      response.render("login.handlebars", model)
      return
    }

    if (!user) {
      console.log("Unknown user!")
      const model = { error: "Unknown user! Please try again." }
      response.render("login.handlebars", model)
      return
    }

    bcrypt.compare(password, user.passwordHash, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err)
        const model = { error: "Error in password verification." }
        response.render("login.handlebars", model)
        return
      }

      if (result) {
        request.session.isLoggedIn = true
        request.session.un = user.username
        request.session.isAdmin = user.isAdmin === 1
        request.session.userId = user.userId
        console.log("---> SESSION INFO:", JSON.stringify(request.session))
        response.render("loggedin.handlebars")
      } else {
        console.log("Wrong password!")
        const model = { error: "Wrong password! Please try again." }
        response.render("login.handlebars", model)
      }
    })
  })
})

app.post("/movies/new", (req, res) => {
  const {
    title,
    year,
    genres,
    director,
    cast,
    synopsis,
    runtimeMinutes,
    rating,
    posterUrl,
    trailerUrl,
    availability,
    language,
    tags,
  } = req.body
  db.run(
    "INSERT INTO movies (title, year, genres, director, cast, synopsis, runtimeMinutes, rating, posterUrl, trailerUrl, availability, language, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      title,
      year,
      genres,
      director,
      cast,
      synopsis,
      runtimeMinutes,
      rating,
      posterUrl,
      trailerUrl,
      availability,
      language,
      tags,
    ],
    (error) => {
      if (error) {
        console.log("Error inserting movie:", error)
        const model = { error: "Error inserting movie." }
        res.render("movieForm.handlebars", model)
      } else {
        console.log("Movie inserted successfully")
        const model = { success: "Movie inserted successfully." }
        res.render("movieForm.handlebars", model)
      }
    },
  )
})

app.get("/movies/modify/:id", (req, res) => {
  const myMovieId = req.params.id
  if (req.session.isAdmin) {
    db.get("SELECT * FROM movies WHERE id = ?", [myMovieId], (error, movie) => {
      if (error) {
        console.error(error.message)
        console.log("Error fetching movie:", error)
        res.redirect("/login")
      } else {
        console.log("Movie fetched:", movie)
        const model = { movie: movie }
        res.render("movieForm.handlebars", model)
      }
    })
  } else {
    const model = { error: "You are not authorized to modify movies." }
    res.render("login.handlebars", model)
  }
})

app.post("/movies/delete/:id", (req, res) => {
  const myMovieId = req.params.id

  if (req.session.isAdmin) {
    db.run("DELETE FROM movies WHERE id = ?", [myMovieId], (error) => {
      if (error) {
        console.error(error.message)
        console.log("Error deleting movie:", error)
        res.redirect("/login")
      } else {
        console.log("Movie deleted successfully")
        res.redirect("/login")
      }
    })
  } else {
    const model = { error: "You are not authorized to delete movies." }
    res.render("login.handlebars", model)
  }
})

app.post("/movies/modify/:id", (req, res) => {
  const myMovieId = req.params.id

  if (!req.session.isAdmin) {
    const model = { error: "You are not authorized to modify movies." }
    return res.render("login.handlebars", model)
  }

  const {
    title,
    year,
    genres,
    director,
    cast,
    synopsis,
    runtimeMinutes,
    rating,
    posterUrl,
    trailerUrl,
    availability,
    language,
    tags,
  } = req.body

  const sql = `UPDATE movies SET title = ?, year = ?, genres = ?, director = ?, cast = ?, synopsis = ?, runtimeMinutes = ?, rating = ?, posterUrl = ?, trailerUrl = ?, availability = ?, language = ?, tags = ? WHERE id = ?`
  const params = [
    title,
    year,
    genres,
    director,
    cast,
    synopsis,
    runtimeMinutes,
    rating,
    posterUrl,
    trailerUrl,
    availability,
    language,
    tags,
    myMovieId,
  ]

  db.run(sql, params, function (error) {
    if (error) {
      console.error("Error updating movie:", error)
      const model = { error: "Error updating movie.", movie: req.body }
      return res.render("movieForm.handlebars", model)
    }

    console.log("Movie updated successfully, rows changed:", this.changes)
    // Redirect to the movie details page
    res.redirect(`/movies/${myMovieId}`)
  })
})

function hashPassword(pw, saltRounds) {
  bcrypt.hash(pw, saltRounds, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err)
    } else {
      console.log("Hashed password:", hash)
    }
  })
}

app.use((req, res) => {
  res.status(404).render("404.handlebars")
})

app.use((req, res) => {
  console.log("-----> ERROR 500 <-----")
  res.status(500).render("500.handlebars")
})

app.listen(PORT, () => {
  //initTableMovies(db);
  //initTableUsers(db);
  //initTableReviews(db);
  //initTableRentals(db);
  hashPassword("wdf#2025", 12)
  console.log(`Server is running on http://localhost:${PORT}`)
})
