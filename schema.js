//schema for server side validation

const Joi=require("joi");
// we will define the schema that we want to validate that is no empty listing can be sent from other ways like hopscotch
//here the schema that we want to validate is listingSchema
module.exports.listingSchema = Joi.object({
    listing:Joi.object({                    //we have a listing object
        title:Joi.string().required(),        
        description:Joi.string().required(),
        price:Joi.number().required().min(0), //we have it min (0) as price cant be entered a negative number
        location:Joi.string().required(),
        country:Joi.string().required(),
        image:Joi.string().allow("",null), //we have used allow here because we have set the default imgae so we can enter empty string string also 
    }).required(), // we have required our listing object
});

// Making a server side schema for review validation
module.exports.reviewSchema = Joi.object({
    review:Joi.object({                    //we have a review object
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(), // we have required our this review object as empty review can be sent
});
