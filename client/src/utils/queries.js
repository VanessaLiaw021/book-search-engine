//Import required packages
import { gql } from '@apollo/client';

//Export QUERY_ME
export const GET_ME = gql`
    {
        me {
            _id
            username 
            email 
            bookCount
            savedBooks {
                bookId 
                authors 
                description 
                title 
                image 
                link
            }
        }
    }
`;