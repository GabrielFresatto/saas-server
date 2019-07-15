'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/session', 'SessionController.store').validator('Session')
Route.post('/users', 'UserController.store').validator('User')

// Teams
Route.group(() => {
  Route.resource('teams', 'TeamController')
    .apiOnly()
    .validator(
      new Map(
        [
          [
            // Métodos que irão utilizar o validator
            ['teams.store', 'teams.update'],
            // Validator
            ['Team']
          ]
        ]
      )
    )
}).middleware('auth')

// Invite
Route.group(() => {
  Route.post('invites', 'InviteController.store').validator('Invite').middleware('can:invites_create')
  Route.get('members', 'MemberController.index').middleware('auth')
  Route.put('members/:id', 'MemberController.update').middleware(['auth', 'is:administrator'])
  Route.resource('projects', 'ProjectController')
    .apiOnly()
    .validator(
      new Map(
        [
          [
            // Métodos que irão utilizar o validator
            ['projects.store', 'projects.update'],
            // Validator
            ['Project']
          ]
        ]
      )
    )
    .middleware(
      new Map(
        [
          [
            // Métodos que irão utilizar o validator
            ['projects.store', 'projects.update'],
            // Validator
            ['can:projects_create']
          ]
        ]
      )
    )

  Route.get('permissions', 'PermissionController.show')
}).middleware(['auth', 'team'])

// Roles
Route.get('/roles', 'RoleController.index').middleware('auth')
