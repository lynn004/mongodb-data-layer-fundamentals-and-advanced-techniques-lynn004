// Connect to the bookstore database
use plp_bookstore;

// ==========================
// TASK 2: BASIC CRUD
// ==========================


// --- CRUD Queries ---

// 1. Find all books in a specific genre (Fiction)
db.books.find({ genre: "Fiction" });

// 2. Find books published after a certain year (after 2000)
db.books.find({ published_year: { $gt: 2000 } });

// 3. Find books by a specific author (George Orwell)
db.books.find({ author: "George Orwell" });

// 4. Update the price of a specific book ("Animal Farm")
db.books.updateOne(
  { title: "Animal Farm" },
  { $set: { price: 9.99 } }
);

// 5. Delete a book by its title ("Moby Dick")
db.books.deleteOne({ title: "Moby Dick" });


// ==========================
// TASK 3: ADVANCED QUERIES
// ==========================

// 1. Find books that are in stock AND published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
});

// 2. Use projection (only return title, author, price)
db.books.find(
  { genre: "Fiction" },
  { title: 1, author: 1, price: 1, _id: 0 }
);

// 3. Sorting books by price
db.books.find().sort({ price: 1 }); // ascending
db.books.find().sort({ price: -1 }); // descending

// 4. Pagination (5 books per page)
// Page 1:
db.books.find().limit(5);
// Page 2:
db.books.find().skip(5).limit(5);


// ==========================
// TASK 4: AGGREGATION PIPELINE
// ==========================

// 1. Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);

// 2. Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// 3. Group books by publication decade
db.books.aggregate([
  {
    $project: {
      decade: { $concat: [ { $toString: { $subtract: [ { $subtract: ["$published_year", { $mod: ["$published_year", 10] }] }, 0 ] } }, "s" ] }
    }
  },
  { $group: { _id: "$decade", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]);


// ==========================
// TASK 5: INDEXING
// ==========================

// 1. Create an index on title
db.books.createIndex({ title: 1 });

// 2. Compound index on author + published_year
db.books.createIndex({ author: 1, published_year: -1 });

// 3. Using explain() to see performance
db.books.find({ title: "Animal Farm" }).explain("executionStats");
db.books.find({ author: "George Orwell", published_year: 1945 }).explain("executionStats");

