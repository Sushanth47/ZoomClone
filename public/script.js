const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  //   path: "/peerjs",
  secure: true,
  host: "peerjs-server.herokuapp.com",
  port: "443",
});

let myVideoStream;
//its a web API
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    console.log("hot ser");
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", function (call) {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
    console.log(myVideoStream, "stream");
    socket.on("user-connected", (userId) => {
      setTimeout(() => {
        connecToNewUser(userId, stream);
      }, 1000);
    });

    //for texting part
    let text = $("input");

    $("html").keydown((e) => {
      if (e.which == 13 && text.val().length !== 0) {
        socket.emit("message", text.val());
        text.val("");
      }
    });

    socket.on("createMessage", (message) => {
      $(".messages").append(
        `<li class="message"><b>user</b><br/>${message}</li>`
      );
      scrollToBottom();
    });
  });

//
peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

//call connecting
const connecToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userId] = call;
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
//for chat part
const scrollToBottom = () => {
  let d = $(".main__chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};
//muting and unmuting call
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

//for muting part
const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

//for unmuting part
const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

//switching video on and off
const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

//to stopping video
const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `;
  document.querySelector(".main__video_button").innerHTML = html;
};

//for starting video
const setPlayVideo = () => {
  const html = `
    <i class="stop fas fa-video"></i>
    <span>Play Video</span>
    `;
  document.querySelector(".main__video_button").innerHTML = html;
};
