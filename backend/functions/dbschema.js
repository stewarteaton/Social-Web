let db = {
    users: [
        {
            userID: "2sf87293f90sdf0",
            email: "stew@gmail.com",
            handle: "stew",
            createdAt: '2019-03-15 sdff',
            bio: "Hello, name is x, blah blah",
            website: "https://user.com",
            location: "Orlando, FL"

        }
    ],
    screams: [
        {
            userHandle: "user",
            body: "shout body",
            createdAt: "2019-07-07T20:45:03.445Z",
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: '',
            shoutID: 'dsff3463fd',
            body: 'cool pic dude',
            createdAt: ''
        }
    ],
    notifications: [
        {
            recipient: 'user',
            sender: 'Bill',
            read: 'true | false',
            shoutID: 'sfl3rk43elfk',
            type: 'like | comment',
            createdAt: '' 
        }
    ]
};

const userDetails = {
    // Redux Data 
    credentials: {
        userId: 'J@#K$@#5',
        email: "",
        handle: 'user',
        createdAt: "",
        imageUrl: '',
        bio: "dfdfd",
        website: 'dfd',
        locatin: ''
    },
    // user can see if he liked picture
    likes: [
        {
         userHande: 'user',
         shoutID: 'sdfwefefe'   
        },
        {
         userHandle: 'user',
         shoutID: 'sdfdfg345432'
        }
    ]
}