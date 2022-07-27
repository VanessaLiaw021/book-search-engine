//Import required packages 
import { gql } from "@apollo/client";

//Export to login user 
export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id 
                username 
            }
        }
    }
`;

//Export to add user 
export const ADD_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!) {
        createUser(username: $username, email: $email, password: $password) {
            token, 
            user {
                _id
                username
            }
        }
    }
`;