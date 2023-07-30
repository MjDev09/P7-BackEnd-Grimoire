const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;  
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
      .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
      .catch(error => res.status(400).json({ error }));
    };

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
} : { ...req.body };

delete bookObject._userId;
Book.findOne({_id: req.params.id})
    .then((book) => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
            Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Livre modifié!'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
  };

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
  .then(book => {
      if (book.userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized'});
      } else {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              Book.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
          });
      }
  })
  .catch( error => {
      res.status(500).json({ error });
  });  
};

exports.ratingOneBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        const ratingUser = book.rating.find((user) => user.userId === req.auth.userId);
        if (ratingUser){
            res.status(401).json({message: 'note déjà transmise'});
        } else {
            const rate = parseInt(req.body.data.rating,10);
            if (isNaN(rate) || rate < 1 || rate > 5) {
                return res.status(400).json({ error: 'La note doit être un nombre entier entre 1 et 5.' });
              } 
            book.rating.push({userId: req.auth.userId, grade: rate});
            const totalRating = book.rating.reduce((sum, rating) => sum + rating.grade, 0);
            const averageRating = totalRating / book.rating.length;

            Book.updateOne({_id: req.params.id}, { rating: book.rating, averageRating: averageRating})
            .then((book) => res.status(200).json({message : 'Note ajoutée !', data: book}))
            .catch(error => res.status(401).json({ error }));
        }
    })

    .catch( error => {
        res.status(500).json({ error });
    });
};

exports.getAllBook = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
    };

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
  };

exports.bestRatingBook = (req, res, next) => {
    Book.find()
    .then(books => {
        if (!books || books.length === 0) {
            return res.status(404).json({ message: 'Aucun livre trouvé.' });
          }

        books.sort((a, b) => b.averageRating - a.averageRating)
        const tableBestAverage = books.slice(0, 3);
        res.status(200).json({tableBestAverage})
    })
    .catch(error => res.status(404).json({ error }));
};

