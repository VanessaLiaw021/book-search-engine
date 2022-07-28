//Import required packages 
const { User } = require("../models");
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {

    //Ability to get books from api/database
    Query: {
        me: async (parent, args, context) => {

            //If user data exist, return the user data 
            if (context.user) return await User.findOne({ _id: context.user._id });

            //Display error if user not logged in and try to add a book 
            throw new AuthenticationError("You need to logged in!");
        }
    },

    //Ability to do the CRUD operation 
    Mutation: {

        //Add new user when they sign up 
        addUser: async (parent, { username, email, password }) => {

            //Create user 
            const user = await User.create({ username, email, password });

            //Sign in user
            const token = signToken(user);

            //Return token and user 
            return { token, user };

        },

        //Login user if exist already 
        login: async (parent, { email, password }) => {

            //Find user's username and password 
            const user = await User.findOne(email);

            //Display error if user email is incorrect
            if (!user) throw new AuthenticationError("Incorrect Email!");

            //Check to see if password matches the inputted password 
            const correctPw = await user.isCorrectPassword(password);

            //Display error if user password is incorrect 
            if (!correctPw) throw new AuthenticationError("Incorrect Password!");

            //Sign in token if everything matches 
            const token = signToken(user);

            //Return token and user 
            return { token, user };
        },

        //Saved Books 
        saveBook: async (parent, { user, body }) => {
            
            //Make sure user is logged in to saved books
            if(user) {

                //Saved the book based on the user id 
                const updatedUser = await User.findOneAndUpdate(

                    { _id: user._id },
                    { $addToSet: { savedBooks: body }},
                    { new: true, runValidators: true }

                );

                //Return updated user 
                return updatedUser;
            };

            //Display error if user not logged in 
            throw new AuthenticationError("You need to be logged in to saved books!");
        },

        //Remove saved books 
        removeBook: async (parent, { user, params }) => {

            //Make sure the user is logged in to delete books
            if (user) {

                //Remove the book based on the user id 
                const updatedUser = await User.findOneAndUpdate(

                    { _id: user._id },
                    { $pull: { savedBooks: { bookId: params.bookId }}},
                    { new: true }
                );

                //Return updated user
                return updatedUser;
            };

            //Display error if user not logged in 
            throw new AuthenticationError("You need to be logged in to delete books!");
        }
    }
};

//Export resolvers 
module.exports = resolvers;