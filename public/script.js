//const { text } = require("express");

const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');

myVideo.muted = true;


var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', function(call) {
          call.answer(stream); 
          const video = document.createElement('video')
          call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
          })
        })

        socket.on('user-connected', (userId) => {
            connecToNewUser(userId, stream);
        })
    
})

let text = $('#chat_message')
let name = document.getElementById('nameOfTheUser');
$('html').keydown((e) => {
    if (e.which == 13 && text.val().length != 0) {
        console.log(text, document.getElementById('nameOfTheUser').innerHTML, 'text');
        socket.emit('message', {one: text.val(), two:document.getElementById('nameOfTheUser').innerHTML });
        text.val('')
    }
});

socket.on('createMessage', message => {
    $('.messages').append(`<li class="message" style="padding-left:120px;"><b>${message.two}</b><br/>${message.one}</li>`);
    scrollToBottom()
});


peer.on('open', (ROOM_ID,id) => {
    socket.emit('join-room', ROOM_ID, id);
    console.log(ROOM_ID, 'room')
})

const connecToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
      })
      peers[userId] =call;
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

/*async function getScreenShot() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('localhost:3030');
    await page.setViewport({width: 1000, height: 500})
    await page.screenshot({path: 'myshot.png'});
  
    await browser.close();
   }*/

const setStopVideo = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video"></i>
    <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}

