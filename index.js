const { engine } = require("express-handlebars")
const express = require("express")
const path = require("path")
const sqlite3 = require("sqlite3")
const bcrypt = require("bcrypt")
const multer = require("multer")

const session = require("express-session")
const connectSqlite3 = require("connect-sqlite3")
const dbFile = "my-project-data.sqlite3.db"
const db = new sqlite3.Database(dbFile)
const SQLiteStore = connectSqlite3(session)

const app = express()
const PORT = process.env.PORT || 3000
const adminPassword = "$2b$12$RkX0Qkf8GvctcU6HxooMWuudfbAl/Cvvs4CzHvHqN.E.dlZJCgLnO"

const upload = multer({ dest: "public/img/" })

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

// Initialize database tables and sample data
// Movies table
function initTableMovies(mytable) {
  mytable.run(
    `CREATE TABLE IF NOT EXISTS movies (id INTEGER PRIMARY KEY, title TEXT, year INTEGER, genres TEXT, director TEXT, cast TEXT, synopsis TEXT, runtimeMinutes INTEGER, rating REAL, posterUrl TEXT, trailerUrl TEXT, availability TEXT, language TEXT, tags TEXT)`,
    (error) => {
      if (error) {
        console.log("Error creating movies table:", error)
      } else {
        console.log("Movies table ready")

        mytable.get("SELECT COUNT(*) as count FROM movies", (err, result) => {
          if (err) {
            console.log("Error checking movies count:", err)
          } else if (result.count < 10) {
            const sampleMovies = [
              {
                title: "The Godfather",
                year: 1972,
                genres: "Crime, Drama",
                director: "Francis Ford Coppola",
                cast: "Marlon Brando, Al Pacino",
                synopsis: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
                runtimeMinutes: 175,
                rating: 9.2,
                posterUrl: "/the-godfather-poster.png",
                trailerUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
                availability: "Available",
                language: "English",
                tags: "classic, mafia",
              },
              {
                title: "Pulp Fiction",
                year: 1994,
                genres: "Crime, Drama",
                director: "Quentin Tarantino",
                cast: "John Travolta, Uma Thurman, Samuel L. Jackson",
                synopsis:
                  "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence.",
                runtimeMinutes: 154,
                rating: 8.9,
                posterUrl: "/pulp-fiction-poster.png",
                trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
                availability: "Available",
                language: "English",
                tags: "cult, nonlinear",
              },
              {
                title: "Star Wars: A New Hope",
                year: 1977,
                genres: "Sci-Fi, Adventure",
                director: "George Lucas",
                cast: "Mark Hamill, Harrison Ford, Carrie Fisher",
                synopsis: "Luke Skywalker joins forces with a Jedi Knight to rescue a princess and save the galaxy.",
                runtimeMinutes: 121,
                rating: 8.6,
                posterUrl: "/star-wars-movie-poster.jpg",
                trailerUrl: "https://www.youtube.com/watch?v=vZ734NWnAHA",
                availability: "Available",
                language: "English",
                tags: "space, epic",
              },
              {
                title: "The Dark Knight",
                year: 2008,
                genres: "Action, Crime, Drama",
                director: "Christopher Nolan",
                cast: "Christian Bale, Heath Ledger",
                synopsis: "Batman must accept one of the greatest psychological and physical tests to fight injustice.",
                runtimeMinutes: 152,
                rating: 9.0,
                posterUrl: "/the-dark-knight-inspired-poster.png",
                trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
                availability: "Available",
                language: "English",
                tags: "superhero, dark",
              },
              {
                title: "Back to the Future",
                year: 1985,
                genres: "Adventure, Comedy, Sci-Fi",
                director: "Robert Zemeckis",
                cast: "Michael J. Fox, Christopher Lloyd",
                synopsis: "A teenager is accidentally sent 30 years into the past in a time-traveling DeLorean.",
                runtimeMinutes: 116,
                rating: 8.5,
                posterUrl: "/back-to-the-future-movie-poster.jpg",
                trailerUrl: "https://www.youtube.com/watch?v=qvsgGtivCgs",
                availability: "Available",
                language: "English",
                tags: "time-travel, comedy",
              },
              {
                title: "Jurassic Park",
                year: 1993,
                genres: "Adventure, Sci-Fi",
                director: "Steven Spielberg",
                cast: "Sam Neill, Laura Dern, Jeff Goldblum",
                synopsis:
                  "A theme park suffers a major power breakdown that allows its cloned dinosaur exhibits to run amok.",
                runtimeMinutes: 127,
                rating: 8.1,
                posterUrl: "/jurassic-park-movie-poster.jpg",
                trailerUrl: "https://www.youtube.com/watch?v=lc0UehYemQA",
                availability: "Available",
                language: "English",
                tags: "dinosaurs, adventure",
              },
              {
                title: "The Matrix",
                year: 1999,
                genres: "Action, Sci-Fi",
                director: "Lana Wachowski, Lilly Wachowski",
                cast: "Keanu Reeves, Laurence Fishburne",
                synopsis:
                  "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
                runtimeMinutes: 136,
                rating: 8.7,
                posterUrl: "/matrix-movie-poster.png",
                trailerUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
                availability: "Available",
                language: "English",
                tags: "cyberpunk, action",
              },
              {
                title: "Forrest Gump",
                year: 1994,
                genres: "Drama, Romance",
                director: "Robert Zemeckis",
                cast: "Tom Hanks, Robin Wright",
                synopsis: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.",
                runtimeMinutes: 142,
                rating: 8.8,
                posterUrl: "/forrest-gump-movie-poster.jpg",
                trailerUrl: "https://www.youtube.com/watch?v=bLvqoHBptjg",
                availability: "Available",
                language: "English",
                tags: "inspirational, drama",
              },
              {
                title: "The Silence of the Lambs",
                year: 1991,
                genres: "Crime, Drama, Thriller",
                director: "Jonathan Demme",
                cast: "Jodie Foster, Anthony Hopkins",
                synopsis:
                  "A young FBI cadet must receive the help of an incarcerated cannibal killer to catch another serial killer.",
                runtimeMinutes: 118,
                rating: 8.6,
                posterUrl: "/silence-of-the-lambs-movie-poster.jpg",
                trailerUrl: "https://www.youtube.com/watch?v=W6Mm8Sbe__o",
                availability: "Available",
                language: "English",
                tags: "thriller, psychological",
              },
              {
                title: "Fight Club",
                year: 1999,
                genres: "Drama",
                director: "David Fincher",
                cast: "Brad Pitt, Edward Norton",
                synopsis: "An insomniac office worker and a devil-may-care soap maker form an underground fight club.",
                runtimeMinutes: 139,
                rating: 8.8,
                posterUrl: "/fight-club-movie-poster.jpg",
                trailerUrl: "https://www.youtube.com/watch?v=qtRKdVHc-cE",
                availability: "Available",
                language: "English",
                tags: "cult, psychological",
              },
              {
                title: "The Lord of the Rings: The Fellowship of the Ring",
                year: 2001,
                genres: "Adventure, Fantasy",
                director: "Peter Jackson",
                cast: "Elijah Wood, Ian McKellen",
                synopsis: "A meek Hobbit and eight companions set out on a journey to destroy the One Ring.",
                runtimeMinutes: 178,
                rating: 8.8,
                posterUrl: "/lord-of-the-rings-movie-poster.jpg",
                trailerUrl: "https://www.youtube.com/watch?v=V75dMMIW2B4",
                availability: "Available",
                language: "English",
                tags: "fantasy, epic",
              },
              {
                title: "Inception",
                year: 2010,
                genres: "Action, Sci-Fi, Thriller",
                director: "Christopher Nolan",
                cast: "Leonardo DiCaprio, Joseph Gordon-Levitt",
                synopsis:
                  "A thief who steals corporate secrets through dream-sharing technology is given the inverse task.",
                runtimeMinutes: 148,
                rating: 8.8,
                posterUrl: "/inception-inspired-poster.png",
                trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
                availability: "Available",
                language: "English",
                tags: "mind-bending, thriller",
              },
            ]

            sampleMovies.forEach((movie) => {
              mytable.run(
                "INSERT OR IGNORE INTO movies (title, year, genres, director, cast, synopsis, runtimeMinutes, rating, posterUrl, trailerUrl, availability, language, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  movie.title,
                  movie.year,
                  movie.genres,
                  movie.director,
                  movie.cast,
                  movie.synopsis,
                  movie.runtimeMinutes,
                  movie.rating,
                  movie.posterUrl,
                  movie.trailerUrl,
                  movie.availability,
                  movie.language,
                  movie.tags,
                ],
                (err) => {
                  if (err) {
                    console.log("Error inserting sample movie:", err)
                  }
                },
              )
            })
            console.log("Added sample movies to reach 10+ records")
          }
        })
      }
    },
  )
}

// Reviews table
function initTableReviews(mytable) {
  mytable.run(
    `CREATE TABLE IF NOT EXISTS reviews (reviewId INTEGER PRIMARY KEY, movieId INTEGER, userId INTEGER, rating INTEGER, comment TEXT, date TEXT)`,
    (error) => {
      if (error) {
        console.log("Error creating reviews table:", error)
      } else {
        console.log("Reviews table ready")

        mytable.get("SELECT COUNT(*) as count FROM reviews", (err, result) => {
          if (err) {
            console.log("Error checking reviews count:", err)
          } else if (result.count < 10) {
            const sampleReviews = [
              { movieId: 2, userId: 1, rating: 10, comment: "An absolute masterpiece of cinema!", date: "2024-01-15" },
              {
                movieId: 3,
                userId: 2,
                rating: 9,
                comment: "Tarantino at his finest. Unforgettable dialogue.",
                date: "2024-01-20",
              },
              { movieId: 4, userId: 3, rating: 10, comment: "The force is strong with this one!", date: "2024-02-01" },
              { movieId: 5, userId: 1, rating: 10, comment: "Best superhero movie ever made.", date: "2024-02-10" },
              { movieId: 6, userId: 2, rating: 9, comment: "Time travel done right. So much fun!", date: "2024-02-15" },
              { movieId: 7, userId: 3, rating: 8, comment: "Dinosaurs never looked so good!", date: "2024-03-01" },
              {
                movieId: 9,
                userId: 1,
                rating: 10,
                comment: "Mind-bending action. Take the red pill!",
                date: "2024-03-10",
              },
              { movieId: 11, userId: 2, rating: 9, comment: "Life is like a box of chocolates...", date: "2024-03-15" },
              {
                movieId: 12,
                userId: 3,
                rating: 10,
                comment: "Terrifying and brilliant performance by Hopkins.",
                date: "2024-03-20",
              },
              {
                movieId: 13,
                userId: 1,
                rating: 9,
                comment: "First rule: you don't talk about it.",
                date: "2024-03-25",
              },
            ]

            sampleReviews.forEach((review) => {
              mytable.run(
                "INSERT OR IGNORE INTO reviews (movieId, userId, rating, comment, date) VALUES (?, ?, ?, ?, ?)",
                [review.movieId, review.userId, review.rating, review.comment, review.date],
                (err) => {
                  if (err) {
                    console.log("Error inserting sample review:", err)
                  }
                },
              )
            })
            console.log("Added sample reviews to reach 10+ records")
          }
        })
      }
    },
  )
}

// Users table
function initTableUsers(mytable) {
  mytable.run(
    `CREATE TABLE IF NOT EXISTS users (userId INTEGER PRIMARY KEY, username TEXT UNIQUE, passwordHash TEXT, isAdmin INTEGER)`,
    (error) => {
      if (error) {
        console.log("Error creating users table:", error)
      } else {
        console.log("Users table ready")

        mytable.get("SELECT COUNT(*) as count FROM users", (err, result) => {
          if (err) {
            console.log("Error checking users count:", err)
          } else if (result.count < 10) {
            const sampleUsers = [
              {
                username: "charlie_brown",
                password: "$2b$12$RkX0Qkf8GvctcU6HxooMWuudfbAl/Cvvs4CzHvHqN.E.dlZJCgLnO",
                isAdmin: 0,
              },
              {
                username: "diana_prince",
                password: "$2b$12$RkX0Qkf8GvctcU6HxooMWuudfbAl/Cvvs4CzHvHqN.E.dlZJCgLnO",
                isAdmin: 0,
              },
              {
                username: "edward_norton",
                password: "$2b$12$RkX0Qkf8GvctcU6HxooMWuudfbAl/Cvvs4CzHvHqN.E.dlZJCgLnO",
                isAdmin: 0,
              },
              {
                username: "fiona_apple",
                password: "$2b$12$RkX0Qkf8GvctcU6HxooMWuudfbAl/Cvvs4CzHvHqN.E.dlZJCgLnO",
                isAdmin: 0,
              },
              {
                username: "george_lucas",
                password: "$2b$12$RkX0Qkf8GvctcU6HxooMWuudfbAl/Cvvs4CzHvHqN.E.dlZJCgLnO",
                isAdmin: 0,
              },
              {
                username: "hannah_montana",
                password: "$2b$12$RkX0Qkf8GvctcU6HxooMWuudfbAl/Cvvs4CzHvHqN.E.dlZJCgLnO",
                isAdmin: 0,
              },
              {
                username: "ivan_drago",
                password: "$2b$12$RkX0Qkf8GvctcU6HxooMWuudfbAl/Cvvs4CzHvHqN.E.dlZJCgLnO",
                isAdmin: 0,
              },
              {
                username: "julia_roberts",
                password: "$2b$12$RkX0Qkf8GvctcU6HxooMWuudfbAl/Cvvs4CzHvHqN.E.dlZJCgLnO",
                isAdmin: 0,
              },
            ]

            sampleUsers.forEach((user) => {
              mytable.run(
                "INSERT OR IGNORE INTO users (username, passwordHash, isAdmin) VALUES (?, ?, ?)",
                [user.username, user.password, user.isAdmin],
                (err) => {
                  if (err) {
                    console.log("Error inserting sample user:", err)
                  }
                },
              )
            })
            console.log("Added sample users to reach 10+ records")
          }
        })
      }
    },
  )
}

// Rentals table
function initTableRentals(mytable) {
  mytable.run(
    `CREATE TABLE IF NOT EXISTS rentals (rentalId INTEGER PRIMARY KEY, movieId INTEGER, userId INTEGER, rentalDate TEXT, returnDate TEXT, status TEXT)`,
    (error) => {
      if (error) {
        console.log("Error creating rentals table:", error)
      } else {
        console.log("Rentals table ready")

        mytable.get("SELECT COUNT(*) as count FROM rentals", (err, result) => {
          if (err) {
            console.log("Error checking rentals count:", err)
          } else if (result.count < 10) {
            const sampleRentals = [
              { movieId: 2, userId: 1, rentalDate: "2024-01-10", returnDate: "2024-01-17", status: "returned" },
              { movieId: 3, userId: 2, rentalDate: "2024-01-15", returnDate: "2024-01-22", status: "returned" },
              { movieId: 4, userId: 3, rentalDate: "2024-02-01", returnDate: "2024-02-08", status: "returned" },
              { movieId: 5, userId: 1, rentalDate: "2024-02-10", returnDate: "2024-02-17", status: "returned" },
              { movieId: 6, userId: 2, rentalDate: "2024-02-15", returnDate: null, status: "rented" },
              { movieId: 7, userId: 3, rentalDate: "2024-03-01", returnDate: "2024-03-08", status: "returned" },
              { movieId: 9, userId: 1, rentalDate: "2024-03-10", returnDate: null, status: "rented" },
              { movieId: 11, userId: 2, rentalDate: "2024-03-15", returnDate: "2024-03-22", status: "returned" },
              { movieId: 12, userId: 3, rentalDate: "2024-03-20", returnDate: null, status: "rented" },
              { movieId: 13, userId: 1, rentalDate: "2024-03-25", returnDate: "2024-04-01", status: "returned" },
            ]

            sampleRentals.forEach((rental) => {
              mytable.run(
                "INSERT OR IGNORE INTO rentals (movieId, userId, rentalDate, returnDate, status) VALUES (?, ?, ?, ?, ?)",
                [rental.movieId, rental.userId, rental.rentalDate, rental.returnDate, rental.status],
                (err) => {
                  if (err) {
                    console.log("Error inserting sample rental:", err)
                  }
                },
              )
            })
            console.log("Added sample rentals to reach 10+ records")
          }
        })
      }
    },
  )
}

// Genres table
function initTableGenres(mytable) {
  const genres = [
    { genreId: 1, genreName: "Action" },
    { genreId: 2, genreName: "Adventure" },
    { genreId: 3, genreName: "Comedy" },
    { genreId: 4, genreName: "Crime" },
    { genreId: 5, genreName: "Drama" },
    { genreId: 6, genreName: "Fantasy" },
    { genreId: 7, genreName: "Horror" },
    { genreId: 8, genreName: "Romance" },
    { genreId: 9, genreName: "Sci-Fi" },
    { genreId: 10, genreName: "Thriller" },
    { genreId: 11, genreName: "Family" },
    { genreId: 12, genreName: "Mystery" },
  ]

  mytable.run(`CREATE TABLE IF NOT EXISTS genres (genreId INTEGER PRIMARY KEY, genreName TEXT UNIQUE)`, (error) => {
    if (error) {
      console.log("Error creating genres table:", error)
    } else {
      console.log("Genres table ready")

      mytable.get("SELECT COUNT(*) as count FROM genres", (err, result) => {
        if (err) {
          console.log("Error checking genres:", err)
        } else if (result.count === 0) {
          genres.forEach((genre) => {
            mytable.run(
              "INSERT INTO genres (genreId, genreName) VALUES (?, ?)",
              [genre.genreId, genre.genreName],
              (err) => {
                if (err) {
                  console.log("Error inserting genre:", err)
                }
              },
            )
          })
        }
      })
    }
  })
}

// Movie_Genres table
function initTableMovieGenres(mytable) {
  const movieGenres = [
    // Movie ID 2: The Godfather - Crime, Drama
    { id: 1, movieId: 2, genreId: 4 }, // Crime
    { id: 2, movieId: 2, genreId: 5 }, // Drama

    // Movie ID 3: Pulp Fiction - Crime, Drama
    { id: 3, movieId: 3, genreId: 4 }, // Crime
    { id: 4, movieId: 3, genreId: 5 }, // Drama

    // Movie ID 4: Star Wars - Sci-Fi, Adventure
    { id: 5, movieId: 4, genreId: 9 }, // Sci-Fi
    { id: 6, movieId: 4, genreId: 2 }, // Adventure

    // Movie ID 5: The Dark Knight - Action, Crime, Drama
    { id: 7, movieId: 5, genreId: 1 }, // Action
    { id: 8, movieId: 5, genreId: 4 }, // Crime
    { id: 9, movieId: 5, genreId: 5 }, // Drama

    // Movie ID 6: Back to the Future - Adventure, Comedy, Sci-Fi
    { id: 10, movieId: 6, genreId: 2 }, // Adventure
    { id: 11, movieId: 6, genreId: 3 }, // Comedy
    { id: 12, movieId: 6, genreId: 9 }, // Sci-Fi

    // Movie ID 7: Jurassic Park - Adventure, Sci-Fi
    { id: 13, movieId: 7, genreId: 2 }, // Adventure
    { id: 14, movieId: 7, genreId: 9 }, // Sci-Fi

    // Movie ID 9: The Matrix - Action, Sci-Fi
    { id: 15, movieId: 9, genreId: 1 }, // Action
    { id: 16, movieId: 9, genreId: 9 }, // Sci-Fi

    // Movie ID 11: Forrest Gump - Drama, Romance
    { id: 17, movieId: 11, genreId: 5 }, // Drama
    { id: 18, movieId: 11, genreId: 8 }, // Romance

    // Movie ID 12: The Silence of the Lambs - Crime, Drama, Thriller
    { id: 19, movieId: 12, genreId: 4 }, // Crime
    { id: 20, movieId: 12, genreId: 5 }, // Drama
    { id: 21, movieId: 12, genreId: 10 }, // Thriller

    // Movie ID 13: Fight Club - Drama
    { id: 22, movieId: 13, genreId: 5 }, // Drama

    // Movie ID 14: The Lord of the Rings - Adventure, Fantasy
    { id: 23, movieId: 14, genreId: 2 }, // Adventure
    { id: 24, movieId: 14, genreId: 6 }, // Fantasy

    // Movie ID 19: Alien - Horror, Sci-Fi
    { id: 25, movieId: 19, genreId: 7 }, // Horror
    { id: 26, movieId: 19, genreId: 9 }, // Sci-Fi

    // Movie ID 20: Tron - Sci-Fi
    { id: 27, movieId: 20, genreId: 9 }, // Sci-Fi
  ]

  mytable.run(
    `CREATE TABLE IF NOT EXISTS movie_genres (id INTEGER PRIMARY KEY, movieId INTEGER, genreId INTEGER, FOREIGN KEY(movieId) REFERENCES movies(id), FOREIGN KEY(genreId) REFERENCES genres(genreId))`,
    (error) => {
      if (error) {
        console.log("Error creating movie_genres table:", error)
      } else {
        console.log("Movie_genres table ready")

        mytable.get("SELECT COUNT(*) as count FROM movie_genres", (err, result) => {
          if (err) {
            console.log("Error checking movie_genres:", err)
          } else if (result.count === 0) {
            // Only insert if table is empty
            movieGenres.forEach((mg) => {
              mytable.run(
                "INSERT INTO movie_genres (id, movieId, genreId) VALUES (?, ?, ?)",
                [mg.id, mg.movieId, mg.genreId],
                (err) => {
                  if (err) {
                    console.log("Error inserting movie_genre:", err)
                  }
                },
              )
            })
          }
        })
      }
    },
  )
}

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

// User management routes for admin
app.get("/admin/users", (req, res) => {
  if (!req.session.isAdmin) {
    const model = { error: "You are not authorized to manage users." }
    return res.render("login.handlebars", model)
  }

  db.all("SELECT userId, username, isAdmin FROM users", (error, users) => {
    if (error) {
      console.log("Error fetching users:", error)
      const model = { error: "Error loading users." }
      res.render("admin-users.handlebars", model)
    } else {
      const model = { users: users }
      res.render("admin-users.handlebars", model)
    }
  })
})

app.post("/admin/users/create", (req, res) => {
  if (!req.session.isAdmin) {
    const model = { error: "You are not authorized to create users." }
    return res.render("login.handlebars", model)
  }

  const { username, password, isAdmin } = req.body

  if (!username || !password) {
    db.all("SELECT userId, username, isAdmin FROM users", (error, users) => {
      const model = {
        users: users || [],
        error: "Username and password are required.",
      }
      res.render("admin-users.handlebars", model)
    })
    return
  }

  // Hash the password
  bcrypt.hash(password, 12, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err)
      db.all("SELECT userId, username, isAdmin FROM users", (error, users) => {
        const model = {
          users: users || [],
          error: "Error creating user.",
        }
        res.render("admin-users.handlebars", model)
      })
      return
    }

    // Insert new user
    const isAdminValue = isAdmin === "on" ? 1 : 0
    db.run(
      "INSERT INTO users (username, passwordHash, isAdmin) VALUES (?, ?, ?)",
      [username, hash, isAdminValue],
      (error) => {
        if (error) {
          console.log("Error inserting user:", error)
          db.all("SELECT userId, username, isAdmin FROM users", (error, users) => {
            const model = {
              users: users || [],
              error: "Error creating user. Username might already exist.",
            }
            res.render("admin-users.handlebars", model)
          })
        } else {
          console.log("User created successfully")
          res.redirect("/admin/users")
        }
      },
    )
  })
})

app.get("/admin/users/edit/:id", (req, res) => {
  if (!req.session.isAdmin) {
    const model = { error: "You are not authorized to edit users." }
    return res.render("login.handlebars", model)
  }

  const userId = req.params.id
  db.get("SELECT userId, username, isAdmin FROM users WHERE userId = ?", [userId], (error, user) => {
    if (error) {
      console.log("Error fetching user:", error)
      res.redirect("/admin/users")
    } else {
      const model = { editUser: user }
      res.render("admin-users.handlebars", model)
    }
  })
})

app.post("/admin/users/update/:id", (req, res) => {
  if (!req.session.isAdmin) {
    const model = { error: "You are not authorized to update users." }
    return res.render("login.handlebars", model)
  }

  const userId = req.params.id
  const { username, password, isAdmin } = req.body

  if (!username) {
    return res.redirect("/admin/users")
  }

  const isAdminValue = isAdmin === "on" ? 1 : 0

  // If password is provided, hash it and update everything
  if (password && password.trim() !== "") {
    bcrypt.hash(password, 12, (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err)
        return res.redirect("/admin/users")
      }

      db.run(
        "UPDATE users SET username = ?, passwordHash = ?, isAdmin = ? WHERE userId = ?",
        [username, hash, isAdminValue, userId],
        (error) => {
          if (error) {
            console.log("Error updating user:", error)
          } else {
            console.log("User updated successfully with new password")
          }
          res.redirect("/admin/users")
        },
      )
    })
  } else {
    // Update without changing password
    db.run("UPDATE users SET username = ?, isAdmin = ? WHERE userId = ?", [username, isAdminValue, userId], (error) => {
      if (error) {
        console.log("Error updating user:", error)
      } else {
        console.log("User updated successfully")
      }
      res.redirect("/admin/users")
    })
  }
})

app.post("/admin/users/delete/:id", (req, res) => {
  if (!req.session.isAdmin) {
    const model = { error: "You are not authorized to delete users." }
    return res.render("login.handlebars", model)
  }

  const userId = req.params.id

  // Prevent admin from deleting themselves
  if (Number.parseInt(userId) === req.session.userId) {
    db.all("SELECT userId, username, isAdmin FROM users", (error, users) => {
      const model = {
        users: users || [],
        error: "You cannot delete your own account.",
      }
      res.render("admin-users.handlebars", model)
    })
    return
  }

  db.run("DELETE FROM users WHERE userId = ?", [userId], (error) => {
    if (error) {
      console.log("Error deleting user:", error)
    } else {
      console.log("User deleted successfully")
    }
    res.redirect("/admin/users")
  })
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

app.post("/movies/new", upload.single("posterImage"), (req, res) => {
  const imagePath = req.file ? `/img/${req.file.filename}` : req.body.posterUrl

  const {
    title,
    year,
    genres,
    director,
    cast,
    synopsis,
    runtimeMinutes,
    rating,
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
      imagePath,
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

app.post("/movies/modify/:id", upload.single("posterImage"), (req, res) => {
  const myMovieId = req.params.id

  if (!req.session.isAdmin) {
    const model = { error: "You are not authorized to modify movies." }
    return res.render("login.handlebars", model)
  }

  const imagePath = req.file ? `/img/${req.file.filename}` : req.body.posterUrl

  const {
    title,
    year,
    genres,
    director,
    cast,
    synopsis,
    runtimeMinutes,
    rating,
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
    imagePath,
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

app.get("/reviews", (req, res) => {
  const numberPerPage = 3
  const currentPage = Number.parseInt(req.query.page) || 1

  // Validate page number
  if (currentPage < 1) {
    return res.redirect("/reviews?page=1")
  }

  // Get total count of reviews
  db.get("SELECT COUNT(*) as total FROM reviews", (error, result) => {
    if (error) {
      console.log("Error counting reviews:", error)
      const model = { error: "Error loading reviews." }
      return res.render("reviews.handlebars", model)
    }

    const totalReviews = result.total
    const totalPages = Math.ceil(totalReviews / numberPerPage)
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

    // Fetch reviews for current page with LIMIT and OFFSET
    const sql = `
      SELECT 
        reviews.reviewId,
        reviews.rating,
        reviews.comment,
        reviews.date,
        movies.title,
        movies.year,
        movies.posterUrl,
        users.username
      FROM reviews
      INNER JOIN movies ON reviews.movieId = movies.id
      INNER JOIN users ON reviews.userId = users.userId
      ORDER BY reviews.date DESC
      LIMIT ? OFFSET ?
    `

    db.all(sql, [numberPerPage, offset], (error, reviews) => {
      if (error) {
        console.log("Error fetching reviews:", error)
        const model = { error: "Error loading reviews." }
        res.render("reviews.handlebars", model)
      } else {
        const model = {
          reviews: reviews,
          currentPage: currentPage,
          totalPages: totalPages,
          hasPrevious: currentPage > 1,
          hasNext: currentPage < totalPages,
          pages: pages,
          previousPage: currentPage - 1,
          nextPage: currentPage + 1,
        }
        res.render("reviews.handlebars", model)
      }
    })
  })
})

app.use((req, res) => {
  res.status(404).render("404.handlebars")
})

app.use((req, res) => {
  console.log("-----> ERROR 500 <-----")
  res.status(500).render("500.handlebars")
})

app.listen(PORT, () => {
  initTableMovies(db)
  initTableUsers(db)
  initTableReviews(db)
  initTableRentals(db)
  initTableGenres(db)
  initTableMovieGenres(db)
  hashPassword("wdf#2025", 12)
  console.log(`Server is running on http://localhost:${PORT}`)
})
