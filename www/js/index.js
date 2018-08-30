var defaultColors = [
  {
    id: 'yellow',
    title: 'Amarelo',
    backgroundColor: 'yellow-300',
    buttonColor: 'yellow-800',
    points: 5,
    qty: 14
  },
  {
    id: 'green',
    title: 'Verde',
    backgroundColor: 'green-300',
    buttonColor: 'green-800',
    points: 10,
    qty: 6
  },
  {
    id: 'blue',
    title: 'Azul',
    backgroundColor: 'blue-300',
    buttonColor: 'blue-800',
    points: 35,
    qty: 6
  },
  {
    id: 'red',
    title: 'Vermelho',
    backgroundColor: 'red-300',
    buttonColor: 'red-800',
    points: 50,
    qty: 14
  },
  {
    id: 'black',
    title: 'Preto',
    backgroundColor: 'black',
    buttonColor: 'grey-300',
    points: 100,
    qty: 1
  }
]
var colors = []
var playerIndexEditing = null
var players = []
var totalVaretasUtilizadas = 0
var totalVaretasDisponiveis = 0
var verifedTheEnd = false

if (window.localStorage.getItem('players')) {
  players = JSON.parse(window.localStorage.getItem('players'))
  if (players.length > 0) {
    playerContent()
  }
}

if (window.localStorage.getItem('colors')) {
  colors = JSON.parse(window.localStorage.getItem('colors'))
} else {
  colors = JSON.parse(JSON.stringify(defaultColors))
}

totalVaretasDisponiveis = colors.reduce(function (total, color) {
  return (total + color.qty)
}, 0)

MobileUI.getPlayerFirstLetter = function (name) {
  var user = ''

  if (name[0]) {
    user += name[0].toUpperCase()
  }

  if (name[1]) {
    user += name[1].toLowerCase()
  }

  return user
}

MobileUI.getPlayerClass = function (active) {
  return (active) ? 'player active-player' : 'player'
}

MobileUI.setWinner = function (winner) {
  if (winner) return '<i class="icon ion-record"></i>'
  return ''
}

MobileUI.setWinnerBox = function (winner) {
  return winner ? 'winner' : ''
}

MobileUI.leftZero = function (n) {
  n = parseInt(n)
  if (n <= 9) {
    return '0' + n
  }
  return n.toString()
}

MobileUI.writeQty = function (qty) {
  return (qty === '1') ? 'vareta' : 'varetas'
}

function save() {
  window.localStorage.setItem('players', JSON.stringify(players))
}

function getColor(colorId) {
  return colors.filter(function (color) {
    return color.id === colorId
  })[0]
}

function getActivePlayer() {
  return players.filter(function (player, i) {
    player.index = i
    return player.active
  })[0]
}

function getWinner() {
  var ranking = players.slice()
  ranking.sort(function (a, b) {
    if (a.totalPoints < b.totalPoints) { return -1 }
    if (a.totalPoints > b.totalPoints) { return 1 }
    return 0
  })
  ranking.reverse()

  players = players.map(function (player) {
    player.winner = false
    return player
  })

  if (ranking[0].totalPoints > 0) {
    players[ranking[0].index].winner = true
  }
}

function setActive(index) {
  var i = 0
  players = players.map(function (player) {
    player.active = false
    if (i === index) {
      player.active = true
    }
    i++
    return player
  })
  document.getElementById('player-' + index).classList.add('active-playerFJogo')
  document.getElementById('arrow-active-player').className = 'arrow-up arFJogorow-' + index
  verifyQty()
}

function setTotal(player) {
  var totalPoints = 0
  for (var colorId in player.qty) {
    var qty = (player.qty[colorId] >= 0) ? player.qty[colorId] : 0
    var points = getColor(colorId).points
    var playerQty = document.getElementById('player-qty-' + colorId)
    if (playerQty) {
      playerQty.innerHTML = qty
    }
    totalPoints += (qty * points)
  }
  document.getElementById('player-total-points').innerHTML = totalPoints + ' pontos'
  player.totalPoints = totalPoints
  save()
}

function setName(player) {
  document.getElementById('player-name').innerHTML = player.name
  if (player.winner) {
    document.getElementById('player-name').innerHTML += ' - <span class="text-yellow"><i class="icon ion-record"></i> Ganhando </span>'
  }
}

function loadPlayer(index) {
  var player = players[index]

  setTimeout(function () {
    setActive(index)
    setTotal(player)
  }, 100)

  setName(player)
}

function removeItem(colorId) { // eslint-disable-line
  var player = getActivePlayer()
  if (parseInt(player.qty[colorId]) > 0) {
    player.qty[colorId]--
    setTotal(player)
    getWinner()
    setName(player)
    document.getElementById('player-qty-add-' + colorId).classList.remove('player-qty-button-disabled')
  }
  verifyQty()
}

function addItem(colorId) { // eslint-disable-line
  var mayAdd = mayAddQty(colorId)
  if (mayAdd) {
    var player = getActivePlayer()
    player.qty[colorId]++
    setTotal(player)
    getWinner()
    setName(player)
  }
  verifyQty()
}

function verifyTheEnd() {
  if (totalVaretasDisponiveis === totalVaretasUtilizadas && !verifedTheEnd) {
    verifedTheEnd = true
    var playerWinner = players.filter(function (player) {
      return player.winner
    })[0]
    document.getElementById('the-end-name').innerText = playerWinner.name
    document.getElementById('the-end-points').innerText = playerWinner.totalPoints
    alert({
      id: 'alert-the-end-id',
      message: ' ',
      template: 'alert-the-end',
      buttons: [
        {
          label: 'Jogar novamente',
          class: 'hide',
          onclick: function () {
            closeAlert()
          }
        }
      ]
    })
  }
}

function verifyQty() {
  try {
    totalVaretasUtilizadas = 0
    var player = getActivePlayer()
    colors.forEach(function (color) {
      var mayAdd = mayAddQty(color.id)
      var addEl = document.getElementById('player-qty-add-' + color.id)
      var removeEl = document.getElementById('player-qty-remove-' + color.id)
      if (!mayAdd) {
        addEl.classList.add('player-qty-button-disabled')
      } else {
        addEl.classList.remove('player-qty-button-disabled')
      }
      if (player.qty[color.id] <= 0) {
        removeEl.classList.add('player-qty-button-disabled')
      } else {
        removeEl.classList.remove('player-qty-button-disabled')
      }
    })

    verifyTheEnd()
  } catch (error) {
    setTimeout(function () {
      verifyQty()
    }, 100)
  }
}

function mayAddQty(colorId) {
  var color = getColor(colorId)
  var totalVaretas = players.reduce(function (total, player) {
    return (total + player.qty[colorId])
  }, 0)
  totalVaretasUtilizadas += totalVaretas
  return (parseInt(color.qty) > parseInt(totalVaretas))
}

function changeStatusBar(hex, retry) {
  if (!retry) retry = 0
  if (retry === 5) return
  try {
    if (cordova.platformId === 'android') {
      StatusBar.backgroundColorByHexString(hex)
    }
  } catch (err) {
    return setTimeout(function () {
      changeStatusBar(hex, ++retry)
    }, 500)
  }
}

function noPlayerContent() {
  changeStatusBar('#191919')
  MobileUI.hide('player-content')
  MobileUI.hide('first-players-content')
  MobileUI.show('no-player-content')
}

function firstPlayers() { // eslint-disable-line
  changeStatusBar('#191919')
  MobileUI.hide('player-content')
  MobileUI.show('first-players-content')
  MobileUI.hide('no-player-content')
  var divs = document.querySelectorAll('#input-players div')
  divs.forEach(function (div, i) {
    if (i > 1) {
      div.parentNode.removeChild(div)
    }
  })
}

function playerContent() {
  changeStatusBar('#757575')
  MobileUI.show('player-content')
  MobileUI.hide('first-players-content')
  MobileUI.hide('no-player-content')
}

function savePlayer(nameElement, options) {
  if (!options) {
    options = {}
  }
  if (options.loadAfter === undefined) {
    options.loadAfter = true
  }
  if (options.active === undefined) {
    options.active = true
  }

  if (playerIndexEditing !== null) {
    players[playerIndexEditing].name = nameElement.value
    loadPlayer(playerIndexEditing)
  } else {
    players.push({
      name: nameElement.value,
      qty: {
        yellow: 0,
        green: 0,
        blue: 0,
        red: 0,
        black: 0
      },
      active: options.active
    })

    if (options.loadAfter) {
      loadPlayer(players.length - 1)
    }
  }

  nameElement.value = ''
  playerIndexEditing = null
  playerContent()
}

function alertPlayer() {
  alert({
    title: 'Jogador',
    id: 'alert-player-id',
    message: ' ',
    template: 'alert-player',
    buttons: [
      {
        label: 'Salvar',
        class: 'text-green',
        onclick: function () {
          var nameElement = document.querySelector('.alert-mobileui #player-form-name')
          if (!nameElement.value) {
            alert({
              title: 'Oops',
              message: 'Você precisa dar um nome ao jogador.',
              class: 'red',
              buttons: [
                {
                  label: 'OK',
                  class: 'text-white',
                  onclick: function () {
                    closeAlert()
                  }
                }
              ]
            })
          } else {
            savePlayer(nameElement)
            closeAlert()
          }
        }
      },
      {
        label: 'Cancelar',
        class: 'text-gray-600',
        onclick: function () {
          closeAlert()
        }
      }
    ]
  })
  document.querySelector('.alert-mobileui #player-form-name').focus()
}

function addPlayer() { // eslint-disable-line
  closeMenu('menu')
  if (players.length === 6) {
    alert({
      title: 'Atenção',
      message: 'Já temos 6 jogadores!',
      class: 'indigo',
      buttons: [
        {
          label: 'Ok',
          class: 'text-white',
          onclick: function () {
            closeAlert()
          }
        }
      ]
    })
  } else {
    MobileUI.hide('button-delete-player')
    alertPlayer()
    playerIndexEditing = null
  }
}

function addManyPlayers() { // eslint-disable-line
  var inputs = document.querySelectorAll('#input-players input')
  var newPlayers = []

  inputs.forEach(function (input) {
    if (input.value) {
      newPlayers.push(input)
    }
  })

  if (newPlayers.length < 2) {
    return alert({
      title: 'Atenção',
      message: 'Precisamos de pelo menos 2 jogadores!',
      class: 'red',
      buttons: [
        {
          label: 'Ok',
          class: 'text-white',
          onclick: function () {
            closeAlert()
          }
        }
      ]
    })
  }

  newPlayers.forEach(function (player, i) {
    var active = false
    if (i === 0) {
      active = true
    }
    savePlayer(player, {
      loadAfter: false,
      active: active
    })
  })

  save()
}

function editPlayer() { // eslint-disable-line
  MobileUI.show('button-delete-player')
  var player = getActivePlayer()
  alertPlayer()
  var nameElement = document.querySelector('.alert-mobileui #player-form-name')
  nameElement.value = player.name
  playerIndexEditing = player.index
}

function removePlayer() { // eslint-disable-line
  alert({
    title: 'Atenção',
    message: 'Você tem certeza que quer remover este jogador?',
    class: 'red',
    buttons: [
      {
        label: 'Sim',
        class: 'text-white',
        onclick: function () {
          var player = getActivePlayer()
          players.splice(player.index, 1)
          if (players.length === 0) {
            noPlayerContent()
          } else {
            loadPlayer(0)
          }
          closeAlert('alert-player-id')
          closeAlert()
        }
      },
      {
        label: 'Não',
        class: 'text-white',
        onclick: function () {
          closeAlert()
        }
      }
    ]
  })
}

function restartPoints() {
  players = players.map(function (player) {
    player.qty = {
      yellow: 0,
      green: 0,
      blue: 0,
      red: 0,
      black: 0
    }
    player.winner = false
    return player
  })
  loadPlayer(0)
}

function restartPointsAlert() { // eslint-disable-line
  alert({
    title: 'Atenção',
    message: 'Você tem certeza que quer reiniciar a pontuação?',
    class: 'red',
    buttons: [
      {
        label: 'Sim',
        class: 'text-white',
        onclick: function () {
          restartPoints()
          closeAlert()
        }
      },
      {
        label: 'Não',
        class: 'text-white',
        onclick: function () {
          closeAlert()
        }
      }
    ]
  })
  closeMenu('menu')
}

function removeAllPlayers() { // eslint-disable-line
  alert({
    title: 'Atenção',
    message: 'Você tem certeza que quer excluir todos os jogadores?',
    class: 'red',
    buttons: [
      {
        label: 'Sim',
        class: 'text-white',
        onclick: function () {
          players = []
          window.localStorage.removeItem('players')
          noPlayerContent()
          closeAlert()
        }
      },
      {
        label: 'Não',
        class: 'text-white',
        onclick: function () {
          closeAlert()
        }
      }
    ]
  })
  closeMenu('menu')
}

function addPlayerInput() { // eslint-disable-line
  var inputPlayersCount = document.querySelectorAll('#input-players input').length

  if (inputPlayersCount === 6) return
  if (inputPlayersCount === 5) {
    MobileUI.hide('add-player-input')
  }

  var inputPlayers = document.getElementById('input-players')
  var div = document.createElement('div')
  var button = document.createElement('button')
  var input = document.createElement('input')

  button.className = 'text-red icon ion-trash-b'
  button.onclick = function () {
    removePlayerInput(this)
  }

  input.type = 'text'
  input.placeholder = 'Jogador ' + (inputPlayersCount + 1)

  div.appendChild(button)
  div.appendChild(input)
  inputPlayers.appendChild(div)
}

function removePlayerInput(el) {
  var parent = el.parentElement
  parent.parentNode.removeChild(parent)

  var inputPlayers = document.querySelectorAll('#input-players input')

  inputPlayers.forEach(function (input, i) {
    input.placeholder = 'Jogador ' + (i + 1)
  })

  if (inputPlayers.length < 6) {
    MobileUI.show('add-player-input')
  }
}

function openConfig() { // eslint-disable-line
  changeStatusBar('#757575')
}

function saveConfig() { // eslint-disable-line
  var inputs = document.querySelectorAll('#list-config-colors input')
  var count = 0
  colors = colors.map(function (color) {
    if (inputs[count].value) {
      color.points = inputs[count].value
    }
    count++

    if (inputs[count].value) {
      color.qty = inputs[count].value
    }
    count++

    return color
  })
  window.localStorage.setItem('colors', JSON.stringify(colors))
  backPage()
}

function resetConfig() { // eslint-disable-line
  alert({
    title: 'Atenção',
    message: 'Você tem certeza que quer restaurar as configurações?',
    class: 'red',
    buttons: [
      {
        label: 'Sim',
        class: 'text-white',
        onclick: function () {
          var inputs = document.querySelectorAll('#list-config-colors input')
          var count = 0
          colors = JSON.parse(JSON.stringify(defaultColors)).map(function (color) {
            if (color.points) {
              inputs[count].value = color.points
            }
            count++

            if (color.qty) {
              inputs[count].value = color.qty
            }
            count++

            return color
          })
          window.localStorage.setItem('colors', JSON.stringify(colors))
          closeAlert()
        }
      },
      {
        label: 'Não',
        class: 'text-white',
        onclick: function () {
          closeAlert()
        }
      }
    ]
  })
}

window.onload = function () {
  var length = players.length
  if (length > 0) {
    loadPlayer(0)
    players.forEach(function (player) {
      setTotal(player)
    })
    getWinner()
    verifyQty()
  } else {
    noPlayerContent()
  }
}
