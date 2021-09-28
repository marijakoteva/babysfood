const { Validator } = require('node-input-validator');


const recipeSchema = {
    title: 'required',
    category:'required',
    prep_time: 'required',
    num_people:'required',
    description:'required',
    recipe: 'required',
    // recipe_image:'requred'
};

const validate = async (data, schema) => {
    let v = new Validator(data, schema);
    let e = await v.check();
    if(!e) {
        throw v.errors;
    }
};

module.exports = {
    recipeSchema,
    validate
};