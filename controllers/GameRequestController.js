import GameRequestModel from "../models/GameRequestModel.js"

export const createGameRequest = async (req,res) =>{
    const userId = req.user.userId;
    
    const { game_name,game_image_url,game_release_year,game_description } = req.body;
    try {
        const newGameRequest = new GameRequestModel({
            game_name,
            game_image_url,
            game_release_year,
            game_description,
            userId : userId
        })

       const savedGameRequest = await newGameRequest.save();

       const populatedGameRequest = await GameRequestModel.findById(savedGameRequest._id)
      .populate('userId', 'name email') // Only retrieve name and email from the User model
    //   .exec();

        res.status(201).send({
            success : true,
            message : "Game request created successfully",
            populatedGameRequest
        });

    }catch(error){
        res.status(500).send({
            success : false,
            message : error.message
        });
    }
}

export const gameRequestList = async (req,res) =>{
    try {
        const gameList = await GameRequestModel.find().populate('userId','name email');
        res.status(200).json({
            success : true,
            message : `Request game successfully`,
            gameList
       })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        })
    }

}

export const gameRequestListDetail = async (req,res) =>{
    const id = req.params.id
    try {
        const gameList = await GameRequestModel.findById(id);
        res.status(200).json({
            success : true,
            message : `Request game successfully`,
            gameList
       })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        })
    }

}

export const deleteRequestGame = async (req,res) => {
    const id = req.params.id;
    try{
        const deleteGameRequest = await GameRequestModel.findByIdAndDelete(id);
        res.status(200).json({
            success : true,
            message : `Delete game request successfully`,
            deleteGameRequest
        })
    }catch(error){
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

