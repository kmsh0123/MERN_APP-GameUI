import CounterModel from "../models/CounterModel.js";
import NoteModel from "../models/NoteModel.js";

const getNextSequenceValue = async (sequenceName) => {
    const counter = await CounterModel.findOneAndUpdate(
      { name: sequenceName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // Create the counter if it doesn't exist
    );
    return counter.seq;
  };

export const getAllNotes = async (req,res)=>{
   try {
    const data = await NoteModel.find();
    res.status(200).json({
        success : true,
        message : `get all note successfully`,
        data
    });  
   } catch (error) {
    res.status(500).json({
        success : false,
        message : error.message,
    })
   }  
}

export const createNote = async (req, res) => {
    const { title, description, photo_url,} = req.body;  
      
    try {
        const id = await getNextSequenceValue('note_id');
        const note = new NoteModel({_id: id,title, description, photo_url,adminId : req.user.userId});
        const saveNote = await note.save();
        res.status(201).json({
            success: true,
            message: `Note created successfully`,
            saveNote
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const saveToDraft = async (req, res) => {
    req.body.status = "draft";
    await createNote(req, res);
};

export const deleteNote = async (req,res)=>{
    const id = req.params.id;    
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
              success: false,
              message: 'Access denied. Admins only.',
            });
          }
        const deleteNote = await NoteModel.findByIdAndDelete(id);
        res.status(200).json({
            success : true,
            message : `delete note successfully`,
            deleteNote
        });  
       } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message,
        })
       }  
}

export const getNote = async (req,res)=>{
    const id = req.params.id;
    try {
        const data = await NoteModel.findById(id);
        res.status(200).json({
            success : true,
            message : `get note successfully`,
            data
        });  
       } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message,
        })
       }
}

export const updateNote = async (req,res)=>{
    const id = req.params.id;
    const { title,description,photo_url } = req.body;
    try {
        const updateNote = await NoteModel.findByIdAndUpdate(id,{title,description,photo_url},{new : true});
        res.status(200).json({
            success : true,
            message : `update note successfully`,
            updateNote
        });  
       } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message,
        })
       }
}