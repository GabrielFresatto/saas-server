'use strict'

const User = use('App/Models/User')
const Invite = use('App/Models/Invite')

class UserController {
  async store ({ request, response, auth }) {
    const data = await request.only(['name', 'email', 'password'])

    // Verifica se na tabela de convites existe o email de cadasttro
    // OBS: O usuário só pode se cadastrar se for convidado
    const teamQuery = Invite.query().where('email', data.email)

    // Pluck retorna um array contendo todos os teams vinculados ao usuário
    const teams = await teamQuery.pluck('team_id')

    // Test onl
    console.log(teams)

    if (teams.length === 0) {
      return response
        .status(401)
        .send({
          message: 'Você não está convidado para nenhum time'
        })
    }

    // Cria o usuário
    const user = await User.create(data)

    // Adiciona os times relacionados a ele
    await user.teams().attach(teams)

    // Deleta os convites
    await teamQuery.delete()

    const token = await auth.attempt(data.email, data.password)

    return token
  }
}

module.exports = UserController
