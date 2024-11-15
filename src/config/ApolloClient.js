import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link : new HttpLink( {
        uri: 'http://localhost:8080/v1/graphql',
        headers: {
            'x-hasura-admin-secret' :'12345',
        },
    }),
    cache: new InMemoryCache(),
});

export default client;