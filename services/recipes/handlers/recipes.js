const recipeModel = require('../../../pkg/recipes');
const recipeValidator = require('../../../pkg/recipes/validator');


const save = async (req, res) => {

    try {
        await recipeValidator.validate(req.body, recipeValidator.recipeSchema);
    } catch (error) {
        console.log(error);
        return res.status(400).send('Bad Request');
    }
    try {
        let data = {
            ...req.body,
            uid: req.user.uid,
            pubDate: new Date(),
            _deleted:false,
            starCount:0
        }
        await recipeModel.save(data);
        return res.status(201).send('Recipe Saved');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
};

const getOne = async (req,res) => {
    console.log(req.params.rid)
    try{
        let data = await recipeModel.getOne( req.params.rid);
        return res.status(200).send(data);
    }catch(error){
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
};

const getByUserId = async (req,res) => {
    try {
        let data = await recipeModel.getByUserId(req.user.uid)
        console.log(data)
        return res.status(200).send(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}

const getByCategory = async (req,res) => {
    try {
        let data = await recipeModel.getByCategory(req.params.cat);
        return res.status(200).send(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
};

const getByStars = async (req,res) => {
    try {
        let data = await recipeModel.getByStars({})
        return res.status(200).send(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}

const starOne = async (req,res) => {
    try {
        const id = req.params.rid
        let recipe = await recipeModel.getOne({_id:id})
        let starRecipe = await recipeModel.updateStar(id,{starCount:recipe.starCount + 1})
        return res.status(200).send(starRecipe);
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
};

const getByPubDate = async (req,res) => {
    try{
        let data = await recipeModel.getByPubDate({})
        return res.status(200).send(data);
    }catch(error){
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
};

const updateRecipe = async(req, res) => {
    try {
        await recipeValidator.validate(req.body, recipeValidator.recipeSchema);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');       
    }
    try {
        let data = await recipeModel.update(req.params.rid, req.body);
        if(data){
            return res.status(200).send('Recipe Updated');
        }
        return res.status(404).send('Not Found');
    } catch (error) {
        console.log(error);
        return res.status(404).send('Internal Server Error');
    }
}

const removeRecipe = async (req,res) => {
        try {
            let recipe = await recipeModel.remove(req.params.rid);
            if(recipe){
                return res.status(204).send('No Content');
            }
            return res.status(404).send('Not Found');
        } catch (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }
};



module.exports = {
    save,
    getOne,
    getByUserId,
    getByCategory,
    starOne,
    getByPubDate,
    getByStars,
    updateRecipe,
    removeRecipe
};