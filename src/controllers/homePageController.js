const rooms = [];

let handleHomepage = async (req, res) => {
    return res.render("homepage.ejs",{ //home
        user: req.user,
        rooms,
        roomId: rooms[Math.floor(Math.random()*rooms.length)]
        
    });
};

  //== Button to Redirect to Playpage
  let handlePlay = async (req, res) => {
    return res.redirect("homepage.ejs",{ //index
    });
};

  //== where /play routes to
let handleIndex = async (req, res) => {
    return res.render("homepage.ejs",{ //index
    });
};

  //== create a new room with random Id  
  let handleCreateRoom = async (req, res) => {
    return res.redirect(`/${uuidV4()}`);
};

  let handleRoom = async (req, res) => {
    return res.render("homepage.ejs",{ //room
        roomId: req.params.room,
    });
};
  

module.exports = {
    handleHomepage: handleHomepage,
    handlePlay: handlePlay,
    handleIndex: handleIndex,
    handleCreateRoom: handleCreateRoom,
    handleRoom: handleRoom,
};
