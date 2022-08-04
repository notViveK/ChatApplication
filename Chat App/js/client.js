const socket = io('http://localhost:8000');
const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")
var img_send = document.getElementById("img-send");
var file = document.getElementById("myFile");

var audio = new Audio('ting.mp3')
let value = false;
let first = "";
const append = (message, position) => {
    const messsageElement = document.createElement('div')
    messsageElement.innerText = message;
    messsageElement.classList.add('message');
    messsageElement.classList.add(position);
    messageContainer.append(messsageElement);
    value = (messageInput.value).startsWith("@");
    console.log(value);
    if (value == true) {
        first = (messageInput.value).substring(1, (messageInput.value).indexOf(' '));
    }
    console.log(first);
    if (position == 'left') {
        audio.play();
    }

}
const imgappend = (message, position) => {
    const messsageElement = document.createElement('div')
    messsageElement.innerText = message;
    messsageElement.classList.add('message');
    messsageElement.classList.add(position);
    messageContainer.append(messsageElement);
    value = (messageInput.value).startsWith("@");
    console.log(value);
    if (value == true) {
        first = (messageInput.value).substring(1, (messageInput.value).indexOf(' '));
    }
    console.log(first);
    if (position == 'left') {
        audio.play();
    }

}

const appendpicture = (img, position) => {
    const imgElement = document.createElement('div')
    // imgElement.classList.add('img');
    const imgpic = document.createElement('img')
    imgpic.src = img
    imgpic.classList.add('img');
    imgpic.classList.add('position');
    imgElement.appendChild(imgpic)


    messageContainer.append(imgElement);
}
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`you:${message}`, 'right');
    if (value == false) {
        socket.emit('send', message);
    }
    else if (value == true) {
        socket.emit('personal-message', message);
    }
    messageInput.value = '';
})
img_send.addEventListener('click', (e) => {

    const message = messageInput.value;
    imgappend(`you:${message}`, 'right');
    console.log("clicked");
    const reader = new FileReader();

    var base64;
    reader.onload = function () {
        base64 = this.result;
        socket.emit('image', { "user": username, "image": base64 });
        //   socket.emit('image', base64);
        // console.log("inside:" + base64);

        //    rightappendpicture(base64);
        appendpicture(base64, 'right');

    };
    reader.readAsDataURL(file.files[0]);

});


// let c=0;
var username;

do {
    username = prompt("Enter your name :");
} while (!username)
socket.emit('new-user-joined', username);


socket.on('user-joined', username => {
    append(`${username} joined the chat`, 'right')
})

socket.on('receive', data => {
    append(`${data.username}: ${data.message}`, 'left')
})
socket.on('personal', data => {
    data.message = data.message.substring((data.message).indexOf(' '));
    append(`${data.username}: ${data.message}`, 'left')
})
socket.on('img', (obj) => {

    // console.log("received image");
    // console.log(obj.image);
    // leftappendpicture(obj);
    appendpicture(obj.image, 'left');
    // append(`${obj.username}:`, 'left')
    
});
socket.on('left', username => {
    append(`${username} left the chat`, 'right')
})