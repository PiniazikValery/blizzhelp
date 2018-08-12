class sessionStore {
    static createSession(user, req, callback) {
        let localReq = { req: req };
        localReq.req.sessionStore.db.collection('sessions').find({}, (err, userSessions) => {
            userSessions.toArray(function (a, sessionsData) {
                for (var i = 0; i < sessionsData.length; i++) {
                    let session = JSON.parse(sessionsData[i].session);
                    if (session.userId === user.id && sessionsData[i]._id !== localReq.req.session.id) {
                        localReq.req.sessionStore.destroy(sessionsData[i]._id);
                    }
                }
            });
        });
        localReq.req.session.userId = user._id;
    }
}

module.exports = sessionStore;