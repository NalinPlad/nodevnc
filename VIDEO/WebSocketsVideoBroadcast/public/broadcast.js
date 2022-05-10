const peerConnections = {};
const config = {
    iceServers: [
        {
            urls: ["stun:stun.l.google.com:19302"]
        }
    ]
};

const socket = io.connect(window.location.origin);
const video = document.querySelector("video");

const res = document.getElementById("res");
const fr = document.getElementById("framerate");

function loadWithConfig() {
    // Media contrains
    let constraints = {
        video:
        {
            width: window.screen.width / parseInt(res.value),
            height: window.screen.height / parseInt(res.value),
            frameRate: { max: parseInt(fr.value) }
        }

    };

    navigator.mediaDevices
        .getDisplayMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
            socket.emit("broadcaster");
        })
        .catch(error => console.error(error));
}

loadWithConfig();

socket.on("watcher", id => {
    const peerConnection = new RTCPeerConnection(config);
    peerConnections[id] = peerConnection;

    let stream = video.srcObject;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit("candidate", id, event.candidate);
        }
    };

    peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
            socket.emit("offer", id, peerConnection.localDescription);
        });
});

socket.on("answer", (id, description) => {
    peerConnections[id].setRemoteDescription(description);
});

socket.on("candidate", (id, candidate) => {
    peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on("disconnectPeer", id => {
    peerConnections[id].close();
    delete peerConnections[id];
});

window.onunload = window.onbeforeunload = () => {
    socket.close();
};
