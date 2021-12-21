const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const { promiseImpl } = require('ejs');


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recommended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        Genres.findAll() //traemos todos lo generos
        .then(allGenres => { //en esa promesa de todos los generos
            res.render('moviesAdd', { //renderizamos en la vista moviesAdd y le pasamos la variable allGenres(promesa) para poder usarla en la vista
                allGenres
            })
        })
    },
    create: function (req,res) {
        const {
            title,
            rating,
            awards,
            release_data,
            length,
            genre_id
        } = req.body
        Movies.create({
            title,
            rating,
            awards,
            release_data,
            length,
            genreId: genre_id
        })
        .then(() => {
            res.redirect('/movies')
        })
        .catch(err =>console.log(err))

    },
    edit: function(req,res) {
        const genresPromise = Genres.findAll()
        const moviePromise = Movies.findByPk(req.params.id)
        Promise.all([genresPromise, moviePromise])
        .then(([allGenres, Movie]) => {
            res.render('moviesEdit', {
                allGenres,
                Movie
            })
        })

    },
    update: function (req,res) {
        const {
            title,
            rating,
            awards,
            release_data,
            length,
            genre_id
        } = req.body
        
        Movies.update({
            title,
            rating,
            awards,
            release_data,
            length,
            genreId: genre_id
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(() => {
            res.redirect('/movies')
        })
        .catch(error =>console(error))
    },
    delete: function (req,res) {
        Movies.findByPk(req.params.id)
        .then(Movie => {
            res.render('moviesDelete', {
                Movie
            })
        })
        .catch(error => console.log(error))
    },
    destroy: function (req,res) {
        Movies.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(() => {
            res.redirect('/movies')
        })
        .catch(error => console.log(error))
    }
}

module.exports = moviesController;