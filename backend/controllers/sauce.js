const Sauces = require('../models/Sauces');
const fs = require('fs');
const { findOne } = require('../models/Sauces');


exports.getAllStuff = (req, res, next) => {

    Sauces.find().then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

  exports.createThing = (req, res, next) => {
      const sauceObject = JSON.parse(req.body.sauce);
      const sauce = new Sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      });  
      sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
        
        
    // const thingObject = JSON.parse(req.body.thing);
    // delete thingObject._id;
    // const thing = new Thing({
    //   ...thingObject,
    //   imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    // });
    // thing.save()
    //   .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    //   .catch(error => res.status(400).json({ error }));
  };
  
  exports.getOneThing = (req, res, next) => {
    Sauces.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };
  
  exports.modifyThing = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };
  
  exports.deleteThing = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(404).json({ error }));
  };
  
  exports.modifyLike = (req, res, next) => {
    let message;
    Sauces.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        if(req.body.like === 1){
          const finded = sauce.usersLiked.find(id => id.toString() === req.body.userId)
          if(finded === undefined){
            sauce.usersLiked.push(req.body.userId)
            sauce.likes++
            message = "L'utilisateur à liker la sauce"
          }else{
            message = "L'utilisateur à déjà liker la sauce"
          }
          
        }else if(req.body.like === 0){
          const findedlike = sauce.usersLiked.find(id => id.toString() === req.body.userId)
          const findeddislike = sauce.usersDisliked.find(id => id.toString() === req.body.userId)
          if(findedlike !== undefined){
            const arr = sauce.usersLiked.filter(id => id.toString() !== req.body.userId)
            sauce.usersLiked = arr
            sauce.likes--
            message = "L'utilisateur à annuler son like"
          }
          if(findeddislike !== undefined){
            const arr = sauce.usersDisliked.filter(id => id.toString() !== req.body.userId)
            sauce.usersDisliked = arr
            sauce.dislikes--
            message = "L'utilisateur à annuler son dislike"
          }
          
        }else if(req.body.like === -1){
          const finded = sauce.usersDisliked.find(id => id.toString() === req.body.userId)
          if(finded === undefined){
            sauce.usersDisliked.push(req.body.userId)
            sauce.dislikes++
            message = "L'utilisateur à disliker la sauce"
          }else{
            message = "L'utilisateur à déjà disliker la sauce"
          }

        }
        sauce
        .save()
    
        .then(() => res.status(200).json({ message: message}))
      }
    )

    .catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );

    //Récupérer le détails de la sauce avec son ID

    //Regarder l'état de l'attribut like qui est passé dans le body
    /*
    * Si like = 1 --> L'utilisateur veut liker
      Si like = 0 --> L'utilisateur veut enlever son like
      Si like = -1 --> L'utilisateur veut dislike
    */

    //Si l'utilisateur veut liker donc (like = 1)
    //Parcourir le tableau UserLike et ajouter l'id userId SI il n'existe pas 
    //Si le userId n'existe pas, on ajouter le userId dans le tableau UserLike ET incrémenter la valeur likes

    //Si l'utilisateur veut annuler son like (like = 0)
    //Parcour le tableau UserLike et si l'id est présent, on enleve l'id de l'utilisateur du tableau UserLike
    //Si l'id est présent, on décrémente à la valeur likes

    //Si l'utilisateur veut dislike donc (like = -1)
    //Parcourir le tableau UserDislike et ajouter l'id userId SI il n'existe pas 
    //Si le userId n'existe pas, on ajouter le userId dans le tableau UserDislke ET incrémenter la valeur dislikes


  }
