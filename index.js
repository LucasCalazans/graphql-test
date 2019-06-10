const express = require('express');
const fetch = require('node-fetch');
const { importSchema } = require('graphql-import');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const graphqlSchema = importSchema('./schemas/schema.graphql');

const schema = buildSchema(graphqlSchema);

const root = {
    getAddressByZipcode: async ({ code }) => {
        const URL = `https://viacep.com.br/ws/${code}/json`;
        const response = await fetch(URL);
        const { cep, logradouro, complemento, bairro, localidade, uf } = await response.json();
        return {
            zipcode: cep,
            street: logradouro,
            complement: complemento,
            neighborhood: bairro,
            city: localidade,
            state: uf,
        };
    }
};

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
