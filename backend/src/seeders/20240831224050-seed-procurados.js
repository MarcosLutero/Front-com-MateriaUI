'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      return queryInterface.bulkInsert('procurado', [
        {
          nome: 'João da Silva',
          nomeMae: 'Maria da Silva',
          nomePai: 'José da Silva',
          cpf: '12345678901',
          naturalidade: 'São Paulo',
          municipio: 'São Paulo',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: 'Ana Souza',
          nomeMae: 'Clara Souza',
          nomePai: 'Carlos Souza',
          cpf: '23456789012',
          naturalidade: 'Rio de Janeiro',
          municipio: 'Rio de Janeiro',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: 'Carlos Pereira',
          nomeMae: 'Fernanda Pereira',
          nomePai: 'Paulo Pereira',
          cpf: '34567890123',
          naturalidade: 'Belo Horizonte',
          municipio: 'Belo Horizonte',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: 'Mariana Fernandes',
          nomeMae: 'Alice Fernandes',
          nomePai: 'Rafael Fernandes',
          cpf: '45678901234',
          naturalidade: 'Porto Alegre',
          municipio: 'Porto Alegre',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: 'Pedro Oliveira',
          nomeMae: 'Juliana Oliveira',
          nomePai: 'Roberto Oliveira',
          cpf: '56789012345',
          naturalidade: 'Salvador',
          municipio: 'Salvador',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
    } catch (error) {
      console.error('Erro ao inserir procurados:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('procurado', null, {});
  }
};
