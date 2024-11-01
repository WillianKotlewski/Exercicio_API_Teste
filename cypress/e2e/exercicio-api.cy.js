/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
  }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
      expect(response.duration).to.be.lessThan(20)
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let usuario = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`
    let email = `EmailEBAC${Math.floor(Math.random() * 100000000)}@teste.com`
      cy.cadastrarUsuario(usuario, email)
        .then((response) => {
          expect(response.status).to.equal(201)
          expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        }) 
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.cadastrarUsuario('Usuario EBAC', 'paulao@teste.com')
      .then((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal("Este email já está sendo usado")
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let usuario = 'Usuario EBAC Editado ' + Math.floor(Math.random() * 10000000)
    let email = `EmailEbacEditado${Math.floor(Math.random() * 10000000)}@teste.com`
    cy.cadastrarUsuario('Usuario Ebac Editado', 'EmailEbacEditado@teste.com')
    cy.request('usuarios').then(response => {
      let id = response.body.usuarios[0]._id
      cy.request({
        method: 'PUT', 
        url: `usuarios/${id}`,
        body: {
          "nome": usuario,
          "email": email,
          "password": "Usuario editado",
          "administrador": 'true'
        }
      }).then(response => {
          expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuario('Usuario EBAC a ser deletado', 'Usuario@Delete.com')
      .then(response => {
        let id = response.body._id
        cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`
        }).should(resp => {
          expect(resp.body.message).to.equal('Registro excluído com sucesso')
          expect(resp.status).to.equal(200)
        })
    })
  });
});
