'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Inserir perfis
    await queryInterface.bulkInsert('perfil', [
      { nome: 'Administrador', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Criador', createdAt: new Date(), updatedAt: new Date() }
    ]);

    const perfis = await queryInterface.sequelize.query(
      `SELECT id FROM perfil WHERE nome IN ('Administrador', 'Criador');`
    );

    const perfilIds = perfis[0];

    // Inserir permissões
    await queryInterface.bulkInsert('permissao', [
      { nome: 'global', descricao: 'Acesso global', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'editar', descricao: 'Permissão para editar', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'excluir', descricao: 'Permissão para excluir', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'criar', descricao: 'Permissão para criar', createdAt: new Date(), updatedAt: new Date() }
    ]);

    const permissoes = await queryInterface.sequelize.query(
      `SELECT id FROM permissao WHERE nome IN ('global', 'editar', 'excluir', 'criar');`
    );

    const permissaoIds = permissoes[0];

    // Relacionar permissões ao perfil de Administrador
    await queryInterface.bulkInsert('perfil_permissao', [
      { perfilId: perfilIds[0].id, permissaoId: permissaoIds[0].id, createdAt: new Date(), updatedAt: new Date() },
      { perfilId: perfilIds[0].id, permissaoId: permissaoIds[1].id, createdAt: new Date(), updatedAt: new Date() },
      { perfilId: perfilIds[0].id, permissaoId: permissaoIds[2].id, createdAt: new Date(), updatedAt: new Date() },
      { perfilId: perfilIds[0].id, permissaoId: permissaoIds[3].id, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Relacionar permissões ao perfil de Criador
    await queryInterface.bulkInsert('perfil_permissao', [
      { perfilId: perfilIds[1].id, permissaoId: permissaoIds[3].id, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Inserir usuários
    await queryInterface.bulkInsert('usuario', [
      { nome: 'Admin User', cpf: '78901234567', email: 'admin@example.com', senha: 'admin123', status: 'Ativo', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Criador User', cpf: '89012345678', email: 'criador@example.com', senha: 'criador123', status: 'Ativo', createdAt: new Date(), updatedAt: new Date() }
    ]);

    const usuarios = await queryInterface.sequelize.query(
      `SELECT id FROM usuario WHERE cpf IN ('78901234567', '89012345678');`
    );

    const usuarioIds = usuarios[0];

    // Relacionar perfis aos usuários
    await queryInterface.bulkInsert('perfil_usuario', [
      { usuarioId: usuarioIds[0].id, perfilId: perfilIds[0].id, createdAt: new Date(), updatedAt: new Date() },
      { usuarioId: usuarioIds[1].id, perfilId: perfilIds[1].id, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Reverter os dados inseridos
    await queryInterface.bulkDelete('perfil_usuario', null, {});
    await queryInterface.bulkDelete('usuario', null, {});
    await queryInterface.bulkDelete('perfil_permissao', null, {});
    await queryInterface.bulkDelete('permissao', null, {});
    await queryInterface.bulkDelete('perfil', null, {});
  }
};
