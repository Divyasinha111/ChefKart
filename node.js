const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const fs = require('fs')

const mongoURI = 'mongodb+srv://root:root@cluster0.e9ezaox.mongodb.net/Project?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI)
    .catch((err) => console.error("MongoDB connection error", err));

const userSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
});
const User = mongoose.model("Id", userSchema);

app.use(express.json());

app.use(express.static(path.join(__dirname, "Project")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Project", "chefkart.html"));
  });
  
  app.get("/Sign", (req, res) => {
    res.sendFile(path.join(__dirname, "Project", "Sign.html"));
  });
  app.get("/login", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "login.html"));
    });
  app.get("/categories", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "categories.html"));
    });
    app.get("/dresses", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "dresses.html"));
    });
    app.get("/tops", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "tops.html"));
    });
    app.get("/shirt", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "shirt.html"));
    });
    app.get("/shirts", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "shirts.html"));
    });
    app.get("/jeans", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "jeans.html"));
    });
  
    app.get("/membership", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "membership.html"));
    });
    app.get("/cart", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "cart.html"));
    });
    app.get("/oversize", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "tshirts.html"));
    });
    app.get("/feedback", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "feedback.html"));
    });

app.post("/sign", async (req, res) => {
  try {
    const _id = await getNextSequence();
    const { name, email, password } = req.body;
    const newUser = new User({ _id, name, email, password });
    const savedUser = await newUser.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/log', async (req, res) => {
    const { email, password } = req.body;
    try {
        
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ success: true, message: "Congratulations ${user.name}, you have successfully logged in", user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        
        console.error('Error finding user:', error);
        res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
    }
});

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  feedback: String
});

// Create a model based on the schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Route to handle feedback form submission
app.post('/submit-feedback', async (req, res) => {
  const feedbackData = req.body;

  // Create a new feedback document based on the model
  const feedback = new Feedback(feedbackData);

  // Save the feedback document to the database
  feedback.save()
      .then(() => {
          console.log('Feedback saved successfully');
          res.sendStatus(200); // Send success response
      })
      .catch((error) => {
          console.error('Error saving feedback:', error);
          res.sendStatus(500); // Send error response
      });
});
async function getNextSequence() {
  const userCount = await User.countDocuments();
  return userCount + 1;
}


const PORT = 3000;
app.listen(PORT);