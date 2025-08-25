// index.js
require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// --- AUTHENTICATION ROUTES ---

// 1. User Registration (Signup)

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from your Express backend!' });
});

app.post('/api/register', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        if (error.code === 'P2002') { // Unique constraint failed
            return res.status(409).json({ error: 'Email already exists.' });
        }
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

// 2. User Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});


// --- JWT AUTHENTICATION MIDDLEWARE ---


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    // decoded contains userId, email, etc from jwt.sign()
    req.user = decoded;  
    next();
  });
}

// --- PROTECTED ROUTE EXAMPLE ---

app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, email: true, name: true, createdAt: true } // Don't send the password
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile.' });
    }
});


// --- BOOK ROUTES ---

// 1. Create a new book (Protected)

app.post('/api/add-books', authenticateToken, async (req, res) => {
  const { title, author, description } = req.body;
  const ownerId = req.user.userId; // now works ✅

  try {
    const newBook = await prisma.book.create({
      data: { title, author, description, ownerId },
    });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book.' });
  }
});

// app.post('/api/add-books', async (req, res) => {
//   const { title, author, description } = req.body;
//   const ownerId = req.user.userId; // Get user ID from the JWT

//   try {
//     const newBook = await prisma.book.create({
//       data: {
//         title,
//         author,
//         description,
//         ownerId,
//       },
//     });
//     res.status(201).json(newBook);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create book.' });
//   }
// });

// 2. Get all available books (Public)
app.get('/api/get-books', async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: { status: 'AVAILABLE' },
      include: { owner: { select: { name: true, id: true } } }, // Include owner's name
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books.' });
  }
});


// DELETE book by id
app.delete('/api/delete-book/:id', authenticateToken, async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check ownership using ownerId (from schema)
    if (book.ownerId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this book' });
    }

    await prisma.book.delete({
      where: { id: bookId }
    });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book.' });
  }
});


// Update book
// Update book
app.post('/api/update/:id', authenticateToken, async (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const { title, author, condition } = req.body;

  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.ownerId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this book' });
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: { title, author, condition }
    });

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book.' });
  }
});






// index.js

// --- REQUEST ROUTES ---

// 1. Create a swap request (Protected)
app.post('/api/requests', authenticateToken, async (req, res) => {
  const { bookId } = req.body;
  const requesterId = req.user.userId;

  try {
    // Check that user is not requesting their own book
    const bookToRequest = await prisma.book.findUnique({ where: { id: bookId } });
    if (bookToRequest.ownerId === requesterId) {
      return res.status(400).json({ error: "You cannot request your own book." });
    }

    const newRequest = await prisma.request.create({
      data: {
        bookId,
        requesterId,
      },
    });
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: "Failed to create request." });
  }
});

// 2. Get incoming requests for the logged-in user (Protected)
app.get('/api/requests/incoming', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const requests = await prisma.request.findMany({
            where: {
                book: {
                    ownerId: userId // Filter requests where the book's owner is the current user
                }
            },
            include: {
                requester: { select: { name: true } }, // Include who made the request
                book: { select: { title: true } }      // Include which book was requested
            }
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch incoming requests." });
    }
});

// ... Add routes for getting requests you've made, and for responding (accept/reject) to a request ...

// ... Add routes for getting a single book, updating, and deleting ...
// --- START THE SERVER ---

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});









// const express = require('express'); // Import the Express module
    // const cors = require('cors');
    // const app = express(); // Create an Express application instance

    // app.use(cors());

    // const PORT = process.env.PORT || 3000; // Define the port, using environment variable if available

    // // Define a basic route for the root URL
    // app.get('/api/hello', (req, res) => {
    //   res.send('<h1>Hello from Nodejs Backend!</h1>');
    // });

    // // Make the server listen for incoming requests
    // app.listen(PORT, () => {
    //   console.log(`Server running at http://localhost:${PORT}/`);
    // });