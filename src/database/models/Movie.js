module.exports = (sequelize, dataTypes) => {
    let alias = 'Movie'; // esto debería estar en singular
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        // created_at: dataTypes.TIMESTAMP,
        // updated_at: dataTypes.TIMESTAMP,
        title: {
            type: dataTypes.STRING(500),
            allowNull: false
        },
        rating: {
            type: dataTypes.DECIMAL(3, 1).UNSIGNED,
            allowNull: false
        },
        awards: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            allowNull: false
        },
        release_date: {
            type: dataTypes.DATEONLY,
            allowNull: true
        },
        length: dataTypes.BIGINT(10),
        genre_id: dataTypes.INTEGER(10)
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    }
    const Movie = sequelize.define(alias,cols,config);
    
    //Aquí debes realizar lo necesario para crear las relaciones con los otros modelos (Genre - Actor)
    Movie.associate = models => {
        Movie.belongsTo(models.Genre, { //una pelicula petenece a UN genero (belongsTo)
            as: "genre", //asociacion con genero
            foreignKey: "genre_id"
        })
    }
    
    Movie.associate = models => {
        Movie.belongsToMany(models.Actor, { //una pelicula pertenece a muchos actores (belongsToMany)
            as: "actors", //asociacion con actores
            through: "actor_movie", //a traves de la tabla intermedia o pivot
            foreignKey: "movie_id", //fk que pertenece al modelo Movie
            otherKey: "actor_id", //el otro fk pertenece al modelo Actor
            timestamps: false
        })
    }

    return Movie
};