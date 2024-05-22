// ! SERVER.JS

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

// ? REQUIRE MODEL
const Moss = require("./models/moss");
const port = process.env.PORT || 3000;
const app = express();
const path = require("path");
const session = require("express-session");
const authController = require("./controllers/auth.js");
const MongoStore = require("connect-mongo");

mongoose.connect(process.env.MONGODB_URI);

app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

app.use("/auth", authController);



app.use((req, res, next) => {
    if (req.session.message) {
      res.locals.message = req.session.message;
      req.session.message = null;
    }
    next();
});




app.get("/", (req, res) => {
  res.render("home.ejs", {});
});

app.get("/mosses", async (req, res) => {
  const allMoss = await Moss.find();
  res.render("index.ejs", {
    allMoss: allMoss,
  });
});

app.get("/mosses/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const moss = await Moss.findById(id).populate("creator");

    console.log(moss);

    res.render("show.ejs", {
      moss,
    });
  } catch (error) {
    res.render("error.ejs", { error: error.message });
  }
});

app.get("/post", (req, res) => {
  res.render("post.ejs", {
    user: req.session.user,
  });
});

app.get("/users", async (req, res) => {
  res.render("users.ejs", {
    user: req.session.user,
  });
});

app.use(express.json());

app.post("/mosses", async (req, res) => {
  try {
    if (!req.body.commonName.trim()) {
      throw new Error("'Common Name' cannot be empty!");
    }
    if (!req.body.latinName.trim()) {
      throw new Error("'Latin Name' cannot be empty!");
    }
    if (!req.body.division.trim()) {
      throw new Error("'Division' cannot be empty!");
    }
    if (!req.body.growthForm.trim()) {
      throw new Error("'Growth Form' cannot be empty!");
    }
    req.body.creator = req.session.user.userId;
    
    const newMoss = await Moss.create(req.body);
    
    req.session.message = "Bryophyte successfully added.";
    res.redirect(`/mosses/${newMoss._id}`);
  } catch (error) {
    req.session.message = error.message
    res.redirect("/mosses");
  }
});

app.delete("/mosses/:mossId", async (req, res) => {
  if (req.session.user) {
    try {
      const deletedMoss = await Moss.findByIdAndDelete(req.params.mossId);
      res.redirect("/mosses/");
    } catch (error) {
      {
        error
      }
    }
  } else {
    res.redirect("/auth/sign-in");
  }
});

app.put("/mosses/:mossId", async (req, res) => {
  if (req.session.user) {
    try {
      const updatedMoss = await Moss.findByIdAndUpdate(
        req.params.mossId,
        req.body,
        { new: true } // for Postman
      );
      res.redirect(`${req.params.mossId}`);
    } catch (error) {
      res.render("error.ejs", {
        error,
      });
    }
  } else {
    res.redirect("auth/sign-in");
  }
});

app.get("/mosses/:mossId/edit", async (req, res) => {
    if (req.session.user) {
        try {
            const foundMoss = await Moss.findById(req.params.mossId);
            res.render("edit.ejs", {
                moss: foundMoss,
            });
        } catch (error) {
            res.render("error.ejs", {
                error,
            });
        }
    } else {
        res.redirect("auth/sign-in");
    }
});


// ? CREATE A REVIEW ==================

app.get('/mosses/:mossId/reviews', (req, res) => {
    res.render('new-review.ejs', {
        mossId: req.params.mossId
    })
})

app.post('/mosses/:mossId/reviews', async (req, res) => {
// get moss ID, if user is signed in
console.log(req.body);
if(req.session.user) {
    const mossId = req.params.mossId
    
    const mossFromDatabase = await Moss.findById(mossId)

    req.body.reviewer = req.session.user.userId

    mossFromDatabase.reviews.push(req.body)

    await mossFromDatabase.save()

    res.redirect(`/mosses/${mossId}`)

} else {
    res.redirect('/auth/sign-in')
}



// add reviewers ID to req.body

// have review in req.body

//push new review into moss reviews key

// save the movie with the new review

})



app.get("*", function (req, res) {
  res.render("error.ejs", { error: "WAHHH. Page not found!" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
