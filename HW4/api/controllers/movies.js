/**
 * Created by Christopher Corona on 3/28/2017.
 */
'use strict';

//using the usergrid from this website as a guide
//https://www.npmjs.com/package/usergrid
var usergrid = require('usergrid');
//using the lodash from this website as a guide
//https://lodash.com/
var _ = require('lodash');
//using the apigee-access from this website as a guide
//http://docs.apigee.com/api-services/content/using-apigee-access
var apigee = require('apigee-access');

//http://docs.apigee.com/api-services/cookbook/building-baas-service-nodejs
var UsergridClient = require('../../node_modules/usergrid/lib/client');
var Usergrid = new UsergridClient({
    "appId": "sandbox",
    "orgId": "coronach",
    "authMode": "NONE",
    "baseUrl": "https://apibaas-trial.apigee.net",
    "URI": "https://apibaas-trial.apigee.net",
    "clientId": "YXA6sQE7RxZCEeeZDA7sJBXz3w",
    "clientSecret": "YXA69rXR1cUsR7dhKH1cxr2SvjpDE1Q"
});

module.exports = {
    getMovies: getMovies,
    postMovie: postMovie,
    getMovieID: getMovieID,
    putMovieID: putMovieID,
    delMovieID: delMovieID
};

//getting all the movies that are listed
function getMovies (req,res)
{
    Usergrid.GET('movies', function(err, response, movie)
    {
        if(err){res.json({error: err});}
        else
            {
                console.log(response.entities);
                res.json({movies: response.entities}).end();
            }
    })
}

//creating a new movie to be inserted
function postMovie (req,res)
{
    var movies = req.swagger.params.movie.value.movie;
    _.assign(movies,{type: 'movie'});
    if(_.isUndefined(movies.actors))
        res.json({Error: "Actor value undefined"});
    else if(_.isUndefined(movies.title))
        res.json({Error: "Title value undefined"});
    else if(_.isUndefined(movies.year))
        res.json({Error: "Year value undefined"});
    else if(_.isUndefined(movies.ID))
        res.json({Error: "ID value undefined"});
    else
        Usergrid.POST(movies, function (err, response, movie)
        {
            if (err) {res.json({message: err});}
            else
                {
                    movie.save(Usergrid, function (err)
                    {
                        if (err) {res.status(500).json(err).end();}
                        else res.json({message: 'A movie have successfully been created', movie: response}).end();
                    });
                }
        })
}

//getting the movie when the ID is entered
function getMovieID (req,res)
{
    var uuid = req.swagger.params.ID.value;
    Usergrid.GET('movies',uuid, function(error, usergridResponse)
    {
        if (error){res.json({error: error});}
        else res.json({movie: usergridResponse}).end();
    })
}

//updating s movie with the ID is entered
function putMovieID(req,res)
{
    var uuid = req.swagger.params.ID.value;
    Usergrid.GET('movies', uuid, function(error, usergridResponse, movie)
    {
        _.assign(movie, req.swagger.params.movie.value.movie);
        _.assign(movie, {type: 'movie'});
        Usergrid.PUT(movie, {uuid : uuid}, function (err, usergridResponse)
        {
            if(err){res.json({error: err});}
            else {res.json({message: 'movie updated', movie: usergridResponse})}
        });
    })
}

//deleting s movie with the ID is entered
function delMovieID(req,res)
{
    var uuid = req.swagger.params.ID.value;
    Usergrid.DELETE('movies',uuid, function(error, usergridResponse)
    {
        if (error) {res.json({error: error});}
        else res.json({message: 'movie deleted', movie: usergridResponse}).end();
    })
}