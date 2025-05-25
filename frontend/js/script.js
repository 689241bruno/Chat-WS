const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")
//chat elementos
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "conrflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]


const user = {id: "", nome: "", color: ""}

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")
    div.classList.add("message--self")
    div.innerHTML = content
    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")


    div.classList.add("message--other")
    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const processMessage = ({data}) => {
    const {userID, userName, userColor, content} = JSON.parse(data)
    
    const message = userID == user.id 
    ? createMessageSelfElement(content)
    :
    createMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()
    user.id = crypto.randomUUID()
    user.nome = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("ws://192.168.0.100:8080")

    websocket.onopen = () => websocket.send(`Usuário: ${user.nome} entrou no chat`)
    websocket.onmessage = processMessage
    console.log(user)
}

const sendMessage = (event) => {
    event.preventDefault()
    const message = {
        userID: user.id,
        userName: user.nome,
        userColor: user.color,
        content: chatInput.value
    }
    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

const scrollScreen = () =>  {
    window.screenTop({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)